package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.request.CancelOrderRequest;
import chucnguyen.bookstore.dto.request.CreateOrderRequest;
import chucnguyen.bookstore.dto.request.UpdateOrderStatusRequest;
import chucnguyen.bookstore.dto.response.*;
import chucnguyen.bookstore.entity.*;
import chucnguyen.bookstore.entity.enums.*;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.OrderMapper;
import chucnguyen.bookstore.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrderService {
    private final ReviewRepository reviewRepository;

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final VoucherRepository voucherRepository;
    private final BookRepository bookRepository;
    private final OrderMapper orderMapper;
    private final PointsService pointsService;

    private final EmailService emailService;

    @Value("${shipping.free-threshold:200000}")
    private BigDecimal freeShippingThreshold;

    @Value("${shipping.default-fee:30000}")
    private BigDecimal defaultShippingFee;

    @Value("${points.order-percentage:0.01}")
    private Double orderPointsPercentage;

    @Value("${points.to-vnd-rate:10}")
    private Integer pointsToVndRate;

    @Transactional
    @CacheEvict(value = {"orders", "statistics", "userStatistics"}, allEntries = true)
    public OrderDetailResponse createOrder(String email, CreateOrderRequest request) {
        log.info("Creating order for user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // ==================== LẤY CART ITEMS ====================
        List<CartItem> cartItems;

        if (request.getSelectedCartItemIds() != null && !request.getSelectedCartItemIds().isEmpty()) {
            log.info("Processing selective checkout with {} items", request.getSelectedCartItemIds().size());

            // Lấy chỉ những items được chọn
            cartItems = cartItemRepository.findAllByIds(request.getSelectedCartItemIds());

            // Verify số lượng items khớp với request
            if (cartItems.size() != request.getSelectedCartItemIds().size()) {
                log.error("Some cart items not found. Requested: {}, Found: {}",
                        request.getSelectedCartItemIds().size(), cartItems.size());
                throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
            }

            // Verify ownership - tất cả items phải thuộc về user này
            long ownedCount = cartItemRepository.countByIdsAndUserId(
                    request.getSelectedCartItemIds(), user.getId());

            if (ownedCount != cartItems.size()) {
                log.error("Ownership verification failed. User: {}, Items: {}, Owned: {}",
                        user.getId(), cartItems.size(), ownedCount);
                throw new AppException(ErrorCode.UNAUTHORIZED, "Some items don't belong to this user");
            }

            log.info("Successfully verified {} selected cart items for user {}", cartItems.size(), email);

        } else {
            // Nếu không có selectedCartItemIds, lấy toàn bộ giỏ hàng (backward compatibility)
            log.info("Processing full cart checkout");
            cartItems = cartItemRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        }

        // Validate cart không rỗng
        if (cartItems.isEmpty()) {
            throw new AppException(ErrorCode.CART_IS_EMPTY);
        }

        // ==================== VALIDATE & CALCULATE ====================
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItem item : cartItems) {
            Book book = item.getBook();

            // Validate book còn active
            if (!book.getIsActive()) {
                throw new AppException(ErrorCode.BOOK_NOT_FOUND,
                        "Book not available: " + book.getTitle());
            }

            // Validate stock đủ
            if (book.getStockQuantity() < item.getQuantity()) {
                throw new AppException(ErrorCode.INSUFFICIENT_STOCK,
                        String.format("Insufficient stock for '%s'. Available: %d, Requested: %d",
                                book.getTitle(), book.getStockQuantity(), item.getQuantity()));
            }

            subtotal = subtotal.add(item.getSubtotal());
        }

        // Calculate shipping
        BigDecimal shippingFee = subtotal.compareTo(freeShippingThreshold) >= 0
                ? BigDecimal.ZERO
                : defaultShippingFee;

        // Handle voucher
        BigDecimal discountAmount = BigDecimal.ZERO;
        Voucher voucher = null;
        if (request.getVoucherCode() != null && !request.getVoucherCode().isBlank()) {
            voucher = voucherRepository.findByCode(request.getVoucherCode())
                    .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

            if (!voucher.isValid()) {
                throw new AppException(ErrorCode.VOUCHER_INVALID);
            }

            discountAmount = voucher.calculateDiscount(subtotal);
            log.info("Applied voucher: {} - Discount: {}", voucher.getCode(), discountAmount);
        }

        // Handle points
        Integer pointsUsed = request.getPointsToUse() != null ? request.getPointsToUse() : 0;
        BigDecimal pointsDiscount = BigDecimal.valueOf(pointsUsed * pointsToVndRate);

        if (pointsUsed > 0) {
            // Validate user có đủ points - LẤY TỪ POINTSSERVICE
            try {
                var userPointsInfo = pointsService.getUserPoints(email);
                int userCurrentPoints = userPointsInfo.getTotalPoints();

                if (userCurrentPoints < pointsUsed) {
                    throw new AppException(ErrorCode.INSUFFICIENT_POINTS,
                            String.format("Insufficient points. Available: %d, Requested: %d",
                                    userCurrentPoints, pointsUsed));
                }
                log.info("Using {} points for discount: {} (User has {} points)",
                        pointsUsed, pointsDiscount, userCurrentPoints);
            } catch (Exception e) {
                log.error("Error checking user points", e);
                throw new AppException(ErrorCode.INSUFFICIENT_POINTS, "Cannot verify points balance");
            }
        }

        // Calculate total
        BigDecimal totalAmount = subtotal
                .add(shippingFee)
                .subtract(discountAmount)
                .subtract(pointsDiscount);

        // Validate total không âm
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }

        // ==================== GET SHIPPING INFO ====================
        String shippingAddress;
        String shippingName;
        String shippingPhone;

        if (request.getAddressId() != null && !request.getAddressId().isBlank()) {
            Address address = addressRepository.findById(request.getAddressId())
                    .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

            // Verify address ownership
            if (!address.getUser().getId().equals(user.getId())) {
                throw new AppException(ErrorCode.UNAUTHORIZED, "Address doesn't belong to this user");
            }

            shippingAddress = address.getFullAddress();
            shippingName = address.getFullName();
            shippingPhone = address.getPhone();
        } else {
            shippingAddress = request.getShippingAddress();
            shippingName = request.getShippingName();
            shippingPhone = request.getShippingPhone();
        }

        // ==================== CREATE ORDER ====================
        Order order = Order.builder()
                .orderCode(generateOrderCode())
                .user(user)
                .shippingName(shippingName)
                .shippingPhone(shippingPhone)
                .shippingAddress(shippingAddress)
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .discountAmount(discountAmount)
                .pointsUsed(pointsUsed)
                .pointsDiscount(pointsDiscount)
                .totalAmount(totalAmount)
                .voucher(voucher)
                .voucherCode(request.getVoucherCode())
                .paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()))
                .paymentStatus(PaymentStatus.PENDING)
                .status(OrderStatus.PENDING)
                .note(request.getNote())
                .pointsEarned((int)(totalAmount.doubleValue() * orderPointsPercentage))
                .build();

        // Add order items
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                    .book(cartItem.getBook())
                    .bookTitle(cartItem.getBook().getTitle())
                    .bookImage(cartItem.getBook().getCoverImageUrl())
                    .price(cartItem.getBook().getEffectivePrice())
                    .quantity(cartItem.getQuantity())
                    .subtotal(cartItem.getSubtotal())
                    .build();
            order.addOrderItem(orderItem);
        }

        order = orderRepository.save(order);
        log.info("Order created successfully: {}", order.getOrderCode());

        // ==================== SEND EMAIL ====================
        try {
            emailService.sendOrderConfirmation(order);
        } catch (Exception e) {
            log.error("Error sending order confirmation email", e);
            // Don't fail the order if email fails
        }

        // ==================== UPDATE POINTS ====================
        if (pointsUsed > 0) {
            pointsService.deductPoints(user, pointsUsed, ReferenceType.ORDER,
                    order.getId(), "Used points for order " + order.getOrderCode());
        }

        // ==================== UPDATE VOUCHER ====================
        if (voucher != null) {
            voucherRepository.incrementUsedCount(voucher.getId());
        }

        // ==================== UPDATE STOCK ====================
        for (CartItem cartItem : cartItems) {
            bookRepository.decrementStock(cartItem.getBook().getId(), cartItem.getQuantity());
        }

        // ==================== CLEAR CART ====================
        if (request.getSelectedCartItemIds() != null && !request.getSelectedCartItemIds().isEmpty()) {
            // Xóa chỉ những items đã checkout
            cartItemRepository.deleteAllByIds(request.getSelectedCartItemIds());
            log.info("Removed {} selected items from cart", request.getSelectedCartItemIds().size());
        } else {
            // Xóa toàn bộ giỏ hàng (backward compatibility)
            cartItemRepository.clearCart(user.getId());
            log.info("Cleared entire cart for user {}", email);
        }

        return orderMapper.toOrderDetailResponse(order);
    }



    @Transactional
    @Cacheable(value = "orders", key = "'user_' + #email + '_' + #page + '_' + #size")
    public PageResponse<OrderResponse> getUserOrders(String email, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        Page<OrderResponse> responsePage = orders.map(orderMapper::toOrderResponse);
        return PageResponse.from(responsePage);
    }

    @Transactional
    @Cacheable(value = "orders", key = "'detail_' + #email + '_' + #orderCode")
    public OrderDetailResponse getOrderDetail(String email, String orderCode) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Order order = orderRepository.findByOrderCodeWithDetails(orderCode)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        boolean isAdmin = user.getRole() == Role.ADMIN;
        boolean isOwner = order.getUser().getId().equals(user.getId());

        if (!isOwner && !isAdmin) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        OrderDetailResponse response = orderMapper.toOrderDetailResponse(order);


        enrichOrderItemsWithReviewStatus(response, user.getId(), order);

        return response;
    }

    private void enrichOrderItemsWithReviewStatus(
            OrderDetailResponse response,
            String userId,
            Order order) {

        boolean orderCanBeReviewed = order.getStatus() == OrderStatus.DELIVERED;

        for (OrderItemResponse item : response.getItems()) {
            // Check xem user đã review book này trong order này chưa
            boolean hasReviewed = reviewRepository.existsByUserIdAndBookIdAndOrderId(
                    userId,
                    item.getBookId(),
                    order.getId()
            );

            item.setCanReview(orderCanBeReviewed);
            item.setHasReviewed(hasReviewed);
        }
    }

    @Transactional
    @CacheEvict(value = {"orders", "statistics", "userStatistics"}, allEntries = true)
    public void cancelOrder(String email, String orderCode, CancelOrderRequest request) {
        log.info("Cancelling order {} for user: {}", orderCode, email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // Check ownership
        if (!order.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Check if can cancel
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new AppException(ErrorCode.ORDER_CANNOT_BE_CANCELLED);
        }

        // Update order status
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledReason(request.getReason());
        order.setCancelledAt(LocalDateTime.now());

        // Restore stock
        for (OrderItem item : order.getOrderItems()) {
            bookRepository.incrementStock(item.getBook().getId(), item.getQuantity());
        }

        // Refund points if used
        if (order.getPointsUsed() > 0) {
            pointsService.addPoints(user, order.getPointsUsed(), ReferenceType.ORDER,
                    order.getId(), "Refund points from cancelled order " + order.getOrderCode());
        }

        // Restore voucher usage
        if (order.getVoucher() != null) {
            voucherRepository.decrementUsedCount(order.getVoucher().getId());
        }

        orderRepository.save(order);

        log.info("Order cancelled successfully");
    }

    @Transactional
    @CacheEvict(value = {"orders", "statistics", "userStatistics"}, allEntries = true)
    public void updateOrderStatus(String orderCode, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        OrderStatus newStatus = OrderStatus.valueOf(request.getStatus());

        // Validate status transition
        if (!isValidStatusTransition(order.getStatus(), newStatus)) {
            throw new AppException(ErrorCode.INVALID_ORDER_STATUS);
        }

        order.setStatus(newStatus);

        switch (newStatus) {
            case CONFIRMED -> {
                order.setConfirmedAt(LocalDateTime.now());

                try {
                    emailService.sendOrderConfirmation(order);
                } catch (Exception e) {
                    log.error("Error sending confirmation email", e);
                }
            }
            case SHIPPING -> {

                order.setShippedAt(LocalDateTime.now());

                try {
                    emailService.sendShippingNotification(order);
                } catch (Exception e) {
                    log.error("Error sending shipping notification", e);
                }
            }
            case DELIVERED -> {
                order.setDeliveredAt(LocalDateTime.now());
                order.setPaymentStatus(PaymentStatus.PAID);

                // Award points
                pointsService.addPoints(order.getUser(), order.getPointsEarned(),
                        ReferenceType.ORDER, order.getId(),
                        "Earned from order " + order.getOrderCode());

                // Update sold count
                for (OrderItem item : order.getOrderItems()) {
                    bookRepository.incrementSoldCount(item.getBook().getId(), item.getQuantity());
                }

                try {
                    emailService.sendDeliveryConfirmation(order);
                } catch (Exception e) {
                    log.error("Error sending delivery confirmation", e);
                }
            }
            case CANCELLED -> {
                order.setCancelledAt(LocalDateTime.now());
                order.setCancelledReason(request.getCancelledReason());
            }
        }

        orderRepository.save(order);
    }

    private boolean isValidStatusTransition(OrderStatus current, OrderStatus next) {
        return switch (current) {
            case PENDING -> next == OrderStatus.CONFIRMED || next == OrderStatus.CANCELLED;
            case PAYMENT_PENDING -> false;
            case CONFIRMED -> next == OrderStatus.SHIPPING || next == OrderStatus.CANCELLED;
            case SHIPPING -> next == OrderStatus.DELIVERED;
            case DELIVERED, CANCELLED, RETURNED -> false;
        };
    }

    private String generateOrderCode() {
        return "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    public List<Order> getOrdersToAutoComplete(int daysAfterDelivery) {
        LocalDateTime beforeDate = LocalDateTime.now().minusDays(daysAfterDelivery);
        return orderRepository.findOrdersToAutoComplete(beforeDate);
    }

    public List<Order> getExpiredPendingOrders(int hoursTimeout) {
        LocalDateTime beforeDate = LocalDateTime.now().minusHours(hoursTimeout);
        return orderRepository.findExpiredPendingOrders(beforeDate);
    }

    @Cacheable(value = "orders", key = "'user_status_' + #email + '_' + #status + '_' + #page + '_' + #size")
    public PageResponse<OrderResponse> getUserOrdersByStatus(
            String email, OrderStatus status, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(
                user.getId(), status, pageable);

        Page<OrderResponse> responsePage = orders.map(orderMapper::toOrderResponse);
        return PageResponse.from(responsePage);
    }

    @Cacheable(value = "orders", key = "'status_' + #status + '_' + #page + '_' + #size")
    public PageResponse<OrderResponse> getAllOrdersByStatus(
            OrderStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders = orderRepository.findByStatusOrderByCreatedAtDesc(
                status, pageable);

        Page<OrderResponse> responsePage = orders.map(orderMapper::toOrderResponse);
        return PageResponse.from(responsePage);
    }

    @Transactional
    public PageResponse<OrderResponse> getOrdersBetweenDates(
            LocalDateTime startDate, LocalDateTime endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders = orderRepository.findOrdersBetweenDates(
                startDate, endDate, pageable);

        Page<OrderResponse> responsePage = orders.map(orderMapper::toOrderResponse);
        return PageResponse.from(responsePage);
    }

    public List<OrderResponse> getUserOrdersWithBook(String email, String bookId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<Order> orders = orderRepository.findUserOrdersWithBook(
                user.getId(), bookId);

        return orderMapper.toOrderResponseList(orders);
    }

    public boolean hasUserPurchasedBook(String email, String bookId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Use exists query for better performance
        return orderRepository.existsUserOrderWithBookAndStatus(
                user.getId(), bookId, OrderStatus.DELIVERED);
    }

    public boolean hasUserPurchasedBookFlexible(String email, String bookId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Check if user has order with book in DELIVERED or SHIPPING status
        // (some systems allow reviews for orders in transit)
        boolean hasDelivered = orderRepository.existsUserOrderWithBookAndStatus(
                user.getId(), bookId, OrderStatus.DELIVERED);

        boolean hasShipping = orderRepository.existsUserOrderWithBookAndStatus(
                user.getId(), bookId, OrderStatus.SHIPPING);

        return hasDelivered || hasShipping;
    }

    @Transactional
    public OrderDetailResponse getOrderDetailPublic(String orderCode) {
        Order order = orderRepository.findByOrderCodeWithDetails(orderCode)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        return orderMapper.toOrderDetailResponse(order);
    }


    @Transactional
    @Cacheable(value = "orders", key = "'all_' + #page + '_' + #size")
    public PageResponse<OrderResponse> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findAllOrders(pageable);

        Page<OrderResponse> responsePage = orders.map(orderMapper::toOrderResponse);
        return PageResponse.from(responsePage);
    }

    @Transactional
    public PageResponse<OrderResponse> searchOrders(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.searchOrders(keyword, pageable);

        Page<OrderResponse> responsePage = orders.map(orderMapper::toOrderResponse);
        return PageResponse.from(responsePage);
    }

    @Transactional
    public PageResponse<OrderResponse> getOrdersByCustomerId(String customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(customerId, pageable);

        Page<OrderResponse> responsePage = orders.map(orderMapper::toOrderResponse);
        return PageResponse.from(responsePage);
    }

    @Transactional
    public PageResponse<OrderResponse> getOrdersByPhone(String phone, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findByShippingPhone(phone, pageable);

        Page<OrderResponse> responsePage = orders.map(orderMapper::toOrderResponse);
        return PageResponse.from(responsePage);
    }

    @Transactional
    public PageResponse<OrderResponse> getOrdersByEmail(String email, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findByUserEmail(email, pageable);

        Page<OrderResponse> responsePage = orders.map(orderMapper::toOrderResponse);
        return PageResponse.from(responsePage);
    }

    @Transactional
    public PageResponse<OrderResponse> getOrdersByPaymentMethod(
            PaymentMethod paymentMethod, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findByPaymentMethod(paymentMethod, pageable);

        Page<OrderResponse> responsePage = orders.map(orderMapper::toOrderResponse);
        return PageResponse.from(responsePage);
    }

    @Transactional
    @CacheEvict(value = {"orders", "statistics", "userStatistics"}, allEntries = true)
    public void addOrderNote(String orderCode, String note) {
        log.info("Adding note to order: {}", orderCode);

        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        String currentNote = order.getNote();
        String newNote;

        if (currentNote == null || currentNote.isBlank()) {
            newNote = note;
        } else {
            newNote = currentNote + "\n---\n" + note;
        }

        order.setNote(newNote);
        orderRepository.save(order);

        log.info("Note added successfully to order: {}", orderCode);
    }

    @Transactional
    @CacheEvict(value = {"orders", "statistics", "userStatistics"}, allEntries = true)
    public void updateTrackingNumber(String orderCode, String trackingNumber) {
        log.info("Updating tracking number for order: {}", orderCode);

        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        order.setTrackingNumber(trackingNumber);
        orderRepository.save(order);

        log.info("Tracking number updated successfully for order: {}", orderCode);
    }

    @Transactional
    @Cacheable(value = "orders", key = "'statistics'")
    public OrderStatisticsResponse getOrderStatistics() {
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long processingOrders = orderRepository.countByStatus(OrderStatus.CONFIRMED)
                + orderRepository.countByStatus(OrderStatus.SHIPPING);
        long deliveredOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELLED);

        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        return OrderStatisticsResponse.builder()
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .processingOrders(processingOrders)
                .deliveredOrders(deliveredOrders)
                .cancelledOrders(cancelledOrders)
                .totalRevenue(totalRevenue)
                .build();
    }
}