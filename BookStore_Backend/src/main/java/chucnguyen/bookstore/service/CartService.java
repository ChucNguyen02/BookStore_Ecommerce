package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.request.AddToCartRequest;
import chucnguyen.bookstore.dto.request.UpdateCartItemRequest;
import chucnguyen.bookstore.dto.response.CartItemResponse;
import chucnguyen.bookstore.dto.response.CartResponse;
import chucnguyen.bookstore.entity.Book;
import chucnguyen.bookstore.entity.CartItem;
import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.CartItemMapper;
import chucnguyen.bookstore.repository.BookRepository;
import chucnguyen.bookstore.repository.CartItemRepository;
import chucnguyen.bookstore.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final CartItemMapper cartItemMapper;

    @Value("${shipping.free-threshold:200000}")
    private BigDecimal freeShippingThreshold;

    @Value("${shipping.default-fee:30000}")
    private BigDecimal defaultShippingFee;

    @Transactional
    @Cacheable(value = "carts", key = "#email")
    public CartResponse getCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<CartItem> cartItems = cartItemRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<CartItemResponse> items = cartItemMapper.toCartItemResponseList(cartItems);

        BigDecimal subtotal = cartItemRepository.calculateCartTotal(user.getId());
        BigDecimal shippingFee = subtotal.compareTo(freeShippingThreshold) >= 0
                ? BigDecimal.ZERO
                : defaultShippingFee;

        return CartResponse.builder()
                .items(items)
                .totalItems(items.size())
                .subtotal(subtotal)
                .estimatedShippingFee(shippingFee)
                .estimatedTotal(subtotal.add(shippingFee))
                .build();
    }

    @Transactional
    @CacheEvict(value = "carts", allEntries = true)
    public CartItemResponse addToCart(String email, AddToCartRequest request) {
        log.info("Adding book {} to cart for user: {}", request.getBookId(), email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        // Check if book is active and in stock
        if (!book.getIsActive()) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }

        if (book.getStockQuantity() < request.getQuantity()) {
            throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
        }

        // Check if already in cart
        CartItem cartItem = cartItemRepository.findByUserIdAndBookId(user.getId(), book.getId())
                .orElse(null);

        if (cartItem != null) {
            // Update quantity
            int newQuantity = cartItem.getQuantity() + request.getQuantity();
            if (book.getStockQuantity() < newQuantity) {
                throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
            }
            cartItem.setQuantity(newQuantity);
        } else {
            // Create new cart item
            cartItem = CartItem.builder()
                    .user(user)
                    .book(book)
                    .quantity(request.getQuantity())
                    .build();
        }

        cartItem = cartItemRepository.save(cartItem);

        log.info("Book added to cart successfully");

        return cartItemMapper.toCartItemResponse(cartItem);
    }

    @Transactional
    @CacheEvict(value = "carts", allEntries = true)
    public CartItemResponse updateCartItem(String email, String cartItemId, UpdateCartItemRequest request) {
        log.info("Updating cart item {} for user: {}", cartItemId, email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        // Check ownership
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Check stock
        if (cartItem.getBook().getStockQuantity() < request.getQuantity()) {
            throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
        }

        cartItem.setQuantity(request.getQuantity());
        cartItem = cartItemRepository.save(cartItem);

        return cartItemMapper.toCartItemResponse(cartItem);
    }

    @Transactional
    @CacheEvict(value = "carts", allEntries = true)
    public void removeFromCart(String email, String cartItemId) {
        log.info("Removing cart item {} for user: {}", cartItemId, email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        // Check ownership
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        cartItemRepository.delete(cartItem);
    }

    @Transactional
    @CacheEvict(value = "carts", allEntries = true)
    public void clearCart(String email) {
        log.info("Clearing cart for user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        cartItemRepository.clearCart(user.getId());
    }

    @Cacheable(value = "carts", key = "'check_' + #email + '_' + #bookId")
    public boolean isBookInCart(String email, String bookId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return cartItemRepository.existsByUserIdAndBookId(user.getId(), bookId);
    }

    @Cacheable(value = "carts", key = "'count_' + #email")
    public long countCartItems(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return cartItemRepository.countByUserId(user.getId());
    }

    @Transactional
    @Scheduled(cron = "0 0 4 * * ?") // Run at 4 AM daily
    @CacheEvict(value = "carts", allEntries = true)
    public void removeInactiveItems() {
        cartItemRepository.removeInactiveBookItems();
        cartItemRepository.removeOutOfStockItems();
        log.info("Removed inactive and out-of-stock items from carts");
    }
}