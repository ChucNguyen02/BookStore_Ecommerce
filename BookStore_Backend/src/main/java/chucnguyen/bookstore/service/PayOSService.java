package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.request.PaymentRequest;
import chucnguyen.bookstore.dto.response.PaymentResponse;
import chucnguyen.bookstore.entity.Order;
import chucnguyen.bookstore.entity.enums.OrderStatus;
import chucnguyen.bookstore.entity.enums.PaymentStatus;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.repository.OrderRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.payos.PayOS;
import vn.payos.core.ClientOptions;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.v2.paymentRequests.PaymentLink;
import vn.payos.model.webhooks.WebhookData;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayOSService {

    private final OrderRepository orderRepository;

    @Value("${payos.client-id}")
    private String clientId;

    @Value("${payos.api-key}")
    private String apiKey;

    @Value("${payos.checksum-key}")
    private String checksumKey;

    @Value("${payos.return-url}")
    private String returnUrl;

    @Value("${payos.cancel-url}")
    private String cancelUrl;

    private PayOS payOSClient;

    @PostConstruct
    public void init() {
        payOSClient = new PayOS(
            new ClientOptions(clientId, apiKey, checksumKey)
        );
        log.info("✅ PayOS client initialized with clientId: {}", clientId);
    }

    /**
     * Tạo link thanh toán PayOS thật
     */
    public PaymentResponse createPayment(PaymentRequest request) {
        Order order = orderRepository.findByOrderCode(request.getOrderCode())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            throw new AppException(ErrorCode.ORDER_ALREADY_PAID);
        }

        // Chuyển sang PAYMENT_PENDING
        if (order.getStatus() == OrderStatus.PENDING) {
            order.setStatus(OrderStatus.PAYMENT_PENDING);
            orderRepository.save(order);
            log.info("Order {} status changed to PAYMENT_PENDING for PayOS", order.getOrderCode());
        }

        try {
            long amount = order.getTotalAmount().longValue();

            // PayOS orderCode phải là số Long
            long payosOrderCode = generatePayOSOrderCode(order.getOrderCode());

            // Description: max 25 chars, no special chars (PayOS rule)
            String description = "Thanh toan " + truncateForPayOS(order.getOrderCode(), 14);

            CreatePaymentLinkRequest paymentData = CreatePaymentLinkRequest.builder()
                    .orderCode(payosOrderCode)
                    .amount(amount)
                    .description(description)
                    .returnUrl(returnUrl + "?appOrderCode=" + order.getOrderCode() + "&resultCode=0")
                    .cancelUrl(cancelUrl + "?appOrderCode=" + order.getOrderCode() + "&resultCode=1")
                    .build();

            CreatePaymentLinkResponse response = payOSClient.paymentRequests().create(paymentData);

            String checkoutUrl = response.getCheckoutUrl();
            log.info("✅ PayOS checkout URL created for order {}: {}", order.getOrderCode(), checkoutUrl);

            return PaymentResponse.builder()
                    .paymentUrl(checkoutUrl)
                    .orderCode(order.getOrderCode())
                    .amount(order.getTotalAmount())
                    .build();

        } catch (Exception e) {
            log.error("❌ Error creating PayOS payment for order {}: {}", order.getOrderCode(), e.getMessage(), e);
            throw new AppException(ErrorCode.PAYMENT_FAILED, "PayOS: " + e.getMessage());
        }
    }

    /**
     * Xử lý PayOS Webhook (IPN) - PayOS server gọi endpoint này sau khi thanh toán thành công
     */
    @Transactional
    public boolean processWebhook(Map<String, Object> webhookBody) {
        try {
            // Verify webhook signature với PayOS SDK
            WebhookData webhookData = payOSClient.webhooks().verify(webhookBody);

            String code = webhookData.getCode();
            String description = webhookData.getDescription();
            long payosOrderCode = webhookData.getOrderCode();
            String reference = webhookData.getReference(); // transaction ID

            log.info("📥 PayOS Webhook: payosOrderCode={}, code={}, description={}",
                    payosOrderCode, code, description);

            // Trích xuất orderCode từ description: "Thanh toan ORD-xxx"
            String orderCode = extractOrderCodeFromDescription(description);
            if (orderCode == null) {
                log.error("❌ Cannot extract orderCode from description: {}", description);
                return false;
            }

            Order order = orderRepository.findByOrderCodeWithLock(orderCode).orElse(null);
            if (order == null) {
                log.error("❌ Order not found for PayOS webhook: {}", orderCode);
                return false;
            }

            // Idempotency check
            if (order.getPaymentStatus() == PaymentStatus.PAID) {
                log.info("⏭️ Order {} already paid, skipping duplicate webhook", orderCode);
                return true;
            }

            // PayOS success code = "00"
            if ("00".equals(code)) {
                order.setPaymentStatus(PaymentStatus.PAID);
                order.setStatus(OrderStatus.CONFIRMED);
                order.setTransactionId(reference);
                order.setConfirmedAt(java.time.LocalDateTime.now());
                orderRepository.save(order);

                log.info("✅ PayOS payment SUCCESS for order: {}, ref: {}", orderCode, reference);
                return true;
            } else {
                order.setPaymentStatus(PaymentStatus.FAILED);
                orderRepository.save(order);

                log.warn("❌ PayOS payment FAILED for order: {} with code: {}", orderCode, code);
                return false;
            }

        } catch (Exception e) {
            log.error("❌ Error processing PayOS webhook: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Xác minh & cập nhật trạng thái đơn hàng khi user quay về từ PayOS
     */
    @Transactional
    public boolean processReturnCallback(String orderCode, String resultCode) {
        try {
            if (orderCode == null || resultCode == null) {
                return false;
            }

            Order order = orderRepository.findByOrderCode(orderCode).orElse(null);
            if (order == null) {
                log.error("Order not found for PayOS return: {}", orderCode);
                return false;
            }

            // Nếu resultCode=0 (success) nhưng backend chưa update (IPN chưa đến)
            // → query trực tiếp PayOS API để verify
            if ("0".equals(resultCode) && order.getPaymentStatus() != PaymentStatus.PAID) {
                try {
                    long payosOrderCode = generatePayOSOrderCode(orderCode);
                    PaymentLink paymentLink = payOSClient.paymentRequests().get(payosOrderCode);

                    String status = paymentLink.getStatus().toString();
                    log.info("PayOS payment link status for order {}: {}", orderCode, status);

                    if ("PAID".equals(status)) {
                        order.setPaymentStatus(PaymentStatus.PAID);
                        order.setStatus(OrderStatus.CONFIRMED);
                        order.setConfirmedAt(java.time.LocalDateTime.now());
                        orderRepository.save(order);
                        log.info("✅ PayOS return: confirmed PAID for order {}", orderCode);
                        return true;
                    }
                } catch (Exception e) {
                    log.warn("⚠️ Could not verify PayOS status for order {}: {}", orderCode, e.getMessage());
                }
            }

            return order.getPaymentStatus() == PaymentStatus.PAID;

        } catch (Exception e) {
            log.error("❌ Error processing PayOS return for order {}: {}", orderCode, e.getMessage());
            return false;
        }
    }

    /**
     * Tạo PayOS orderCode dưới dạng Long từ orderCode string.
     * PayOS yêu cầu orderCode là số nguyên dương.
     * Dùng hash để đảm bảo unique và ngắn gọn (9 chữ số).
     */
    private long generatePayOSOrderCode(String orderCode) {
        long hash = Math.abs((long) orderCode.hashCode());
        // Khoảng: 100_000_000 - 999_999_999 (9 chữ số)
        long payosCode = (hash % 900_000_000L) + 100_000_000L;
        log.debug("Generated PayOS orderCode {} from {}", payosCode, orderCode);
        return payosCode;
    }

    /**
     * Trích xuất orderCode từ description của PayOS webhook.
     * Description format: "Thanh toan ORD-xxx" (chuỗi 25 chars tối đa)
     */
    private String extractOrderCodeFromDescription(String description) {
        if (description == null || description.isBlank()) return null;

        String[] parts = description.split("\\s+");
        for (String part : parts) {
            // Tìm phần bắt đầu bằng ORD- (case insensitive)
            if (part.toUpperCase().startsWith("ORD-")) {
                return part.toUpperCase().startsWith("ORD-") ? part : part;
            }
        }

        // Fallback: tìm trong string
        int ordIdx = description.toUpperCase().indexOf("ORD-");
        if (ordIdx >= 0) {
            String rest = description.substring(ordIdx);
            int spaceIdx = rest.indexOf(' ');
            return spaceIdx > 0 ? rest.substring(0, spaceIdx) : rest;
        }

        return null;
    }

    /**
     * Rút ngắn orderCode để fit vào description PayOS (max 25 chars tổng)
     * "Thanh toan " = 11 chars → còn 14 chars cho orderCode
     */
    private String truncateForPayOS(String orderCode, int maxLen) {
        if (orderCode == null) return "";
        return orderCode.length() <= maxLen ? orderCode : orderCode.substring(0, maxLen);
    }
}
