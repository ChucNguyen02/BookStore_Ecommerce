package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.request.PaymentRequest;
import chucnguyen.bookstore.dto.response.PaymentResponse;
import chucnguyen.bookstore.entity.Order;
import chucnguyen.bookstore.entity.enums.OrderStatus;
import chucnguyen.bookstore.entity.enums.PaymentStatus;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class VNPayService {

    private final OrderRepository orderRepository;

    @Value("${vnpay.tmn-code}")
    private String vnpTmnCode;

    @Value("${vnpay.hash-secret}")
    private String vnpHashSecret;

    @Value("${vnpay.url}")
    private String vnpUrl;

    @Value("${vnpay.return-url}")
    private String vnpReturnUrl;

    private static final String VNP_VERSION = "2.1.0";
    private static final String VNP_COMMAND = "pay";
    private static final String VNP_CURR_CODE = "VND";
    private static final String VNP_LOCALE = "vn";
    private static final int PAYMENT_TIMEOUT_MINUTES = 15;

    public PaymentResponse createPayment(PaymentRequest request) {
        Order order = orderRepository.findByOrderCode(request.getOrderCode())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // Validate order status
        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            throw new AppException(ErrorCode.ORDER_ALREADY_PAID);
        }

        // ✅ SET STATUS = PAYMENT_PENDING khi tạo payment URL
        if (order.getStatus() == OrderStatus.PENDING) {
            order.setStatus(OrderStatus.PAYMENT_PENDING);
            orderRepository.save(order);
            log.info("Order {} status changed to PAYMENT_PENDING", order.getOrderCode());
        }

        try {
            String paymentUrl = buildPaymentUrl(order, request.getIpAddress());

            log.info("VNPay payment URL created successfully for order: {}", order.getOrderCode());

            return PaymentResponse.builder()
                    .paymentUrl(paymentUrl)
                    .orderCode(order.getOrderCode())
                    .amount(order.getTotalAmount())
                    .build();

        } catch (NoSuchAlgorithmException e) {
            log.error("HMAC algorithm not available", e);
            throw new AppException(ErrorCode.SYSTEM_ERROR);
        } catch (InvalidKeyException e) {
            log.error("Invalid secret key configuration", e);
            throw new AppException(ErrorCode.SYSTEM_ERROR);
        } catch (Exception e) {
            log.error("Unexpected error creating VNPay payment for order: {}", order.getOrderCode(), e);
            throw new AppException(ErrorCode.PAYMENT_FAILED);
        }
    }

    private String buildPaymentUrl(Order order, String ipAddress) throws Exception {
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", VNP_VERSION);
        vnpParams.put("vnp_Command", VNP_COMMAND);
        vnpParams.put("vnp_TmnCode", vnpTmnCode);
        vnpParams.put("vnp_Amount", String.valueOf(order.getTotalAmount().longValue() * 100));
        vnpParams.put("vnp_CurrCode", VNP_CURR_CODE);
        vnpParams.put("vnp_TxnRef", order.getOrderCode());
        vnpParams.put("vnp_OrderInfo", "Payment for order: " + order.getOrderCode());
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", VNP_LOCALE);
        vnpParams.put("vnp_ReturnUrl", vnpReturnUrl);
        vnpParams.put("vnp_IpAddr", ipAddress != null ? ipAddress : "127.0.0.1");

        // Format datetime
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnpParams.put("vnp_CreateDate", formatter.format(cld.getTime()));

        cld.add(Calendar.MINUTE, PAYMENT_TIMEOUT_MINUTES);
        vnpParams.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        // Build query string
        String queryString = buildQueryString(vnpParams);
        String vnpSecureHash = hmacSHA512(vnpHashSecret, queryString);

        return vnpUrl + "?" + queryString + "&vnp_SecureHash=" + vnpSecureHash;
    }

    private String buildQueryString(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();

        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = params.get(fieldName);

            if (fieldValue != null && !fieldValue.isEmpty()) {
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                if (itr.hasNext()) {
                    query.append('&');
                }
            }
        }

        return query.toString();
    }

    @Transactional
    public boolean processPaymentReturn(Map<String, String> params) {
        try {
            // Verify signature
            if (!verifySignature(params)) {
                log.error("VNPay signature verification failed for order: {}", params.get("vnp_TxnRef"));
                return false;
            }

            String orderCode = params.get("vnp_TxnRef");
            String responseCode = params.get("vnp_ResponseCode");
            String transactionNo = params.get("vnp_TransactionNo");
            String amountStr = params.get("vnp_Amount");

            if (orderCode == null || responseCode == null) {
                log.error("Missing required parameters in VNPay callback");
                return false;
            }

            // Lock order to prevent race condition
            Order order = orderRepository.findByOrderCodeWithLock(orderCode)
                    .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

            // Check if already processed (idempotency)
            if (order.getPaymentStatus() == PaymentStatus.PAID) {
                log.info("Order {} already paid, skipping duplicate callback", orderCode);
                return true;
            }

            // Validate amount
            if (amountStr != null) {
                long receivedAmount = Long.parseLong(amountStr);
                long expectedAmount = order.getTotalAmount().longValue() * 100;

                if (receivedAmount != expectedAmount) {
                    log.error("Amount mismatch for order {}: expected {}, received {}",
                            orderCode, expectedAmount, receivedAmount);
                    return false;
                }
            }

            // Process payment result
            if ("00".equals(responseCode)) {
                // ✅ THANH TOÁN THÀNH CÔNG
                order.setPaymentStatus(PaymentStatus.PAID);
                order.setStatus(OrderStatus.CONFIRMED);  // Chuyển sang CONFIRMED
                order.setTransactionId(transactionNo);
                order.setConfirmedAt(java.time.LocalDateTime.now());
                orderRepository.save(order);

                log.info("VNPay payment successful for order: {}, transactionId: {}",
                        orderCode, transactionNo);
                return true;
            } else {
                // ❌ THANH TOÁN THẤT BẠI - GIỮ PAYMENT_PENDING
                // Scheduler sẽ tự động hủy sau 1 tiếng
                order.setPaymentStatus(PaymentStatus.FAILED);
                orderRepository.save(order);

                log.warn("VNPay payment failed for order: {} with response code: {}. Order remains PAYMENT_PENDING",
                        orderCode, responseCode);
                return false;
            }

        } catch (NumberFormatException e) {
            log.error("Invalid amount format in VNPay callback", e);
            return false;
        } catch (Exception e) {
            log.error("Error processing VNPay payment callback", e);
            return false;
        }
    }

    private boolean verifySignature(Map<String, String> params) {
        try {
            String vnpSecureHash = params.get("vnp_SecureHash");
            if (vnpSecureHash == null || vnpSecureHash.isEmpty()) {
                return false;
            }

            // Remove signature fields
            Map<String, String> verifyParams = new HashMap<>(params);
            verifyParams.remove("vnp_SecureHash");
            verifyParams.remove("vnp_SecureHashType");

            // Build hash data
            String hashData = buildQueryString(verifyParams);
            String calculatedHash = hmacSHA512(vnpHashSecret, hashData);

            return calculatedHash.equals(vnpSecureHash);

        } catch (Exception e) {
            log.error("Error verifying VNPay signature", e);
            return false;
        }
    }

    private String hmacSHA512(String key, String data) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac hmac = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmac.init(secretKey);
        byte[] hash = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));

        StringBuilder result = new StringBuilder();
        for (byte b : hash) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
}