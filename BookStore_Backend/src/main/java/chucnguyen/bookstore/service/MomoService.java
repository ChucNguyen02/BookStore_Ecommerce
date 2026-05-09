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
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MomoService {

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${momo.partner-code}")
    private String partnerCode;

    @Value("${momo.access-key}")
    private String accessKey;

    @Value("${momo.secret-key}")
    private String secretKey;

    @Value("${momo.endpoint}")
    private String momoEndpoint;

    @Value("${momo.return-url}")
    private String returnUrl;

    @Value("${momo.notify-url}")
    private String notifyUrl;

    private static final String REQUEST_TYPE = "captureWallet";
    private static final String LANG = "vi";
    private static final String SUCCESS_CODE = "0";

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
            String requestId = UUID.randomUUID().toString();
            String orderId = order.getOrderCode();
            long amount = order.getTotalAmount().longValue();
            String orderInfo = "Payment for order: " + orderId;

            // Build and sign request
            Map<String, Object> requestBody = buildPaymentRequest(
                    requestId, orderId, amount, orderInfo);

            // Call Momo API
            Map<String, Object> response = callMomoApi(requestBody);

            // Validate and extract response
            return processPaymentResponse(response, order);

        } catch (NoSuchAlgorithmException e) {
            log.error("HMAC algorithm not available", e);
            throw new AppException(ErrorCode.SYSTEM_ERROR);
        } catch (InvalidKeyException e) {
            log.error("Invalid secret key configuration", e);
            throw new AppException(ErrorCode.SYSTEM_ERROR);
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            log.error("Momo API HTTP error for order {}: {}", order.getOrderCode(), e.getMessage());
            throw new AppException(ErrorCode.PAYMENT_GATEWAY_ERROR);
        } catch (Exception e) {
            log.error("Unexpected error creating Momo payment for order: {}", order.getOrderCode(), e);
            throw new AppException(ErrorCode.PAYMENT_FAILED);
        }
    }

    private Map<String, Object> buildPaymentRequest(
            String requestId, String orderId, long amount, String orderInfo)
            throws NoSuchAlgorithmException, InvalidKeyException {

        String extraData = "";
        String uniqueOrderId = orderId + "-" + System.currentTimeMillis();

        // Build raw signature
        String rawSignature = "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&ipnUrl=" + notifyUrl +
                "&orderId=" + uniqueOrderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + returnUrl +
                "&requestId=" + requestId +
                "&requestType=" + REQUEST_TYPE;

        String signature = hmacSHA256(secretKey, rawSignature);

        // Build request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("partnerCode", partnerCode);
        requestBody.put("accessKey", accessKey);
        requestBody.put("requestId", requestId);
        requestBody.put("amount", amount);
        requestBody.put("orderId", uniqueOrderId);
        requestBody.put("orderInfo", orderInfo);
        requestBody.put("redirectUrl", returnUrl);
        requestBody.put("ipnUrl", notifyUrl);
        requestBody.put("requestType", REQUEST_TYPE);
        requestBody.put("extraData", extraData);
        requestBody.put("signature", signature);
        requestBody.put("lang", LANG);

        return requestBody;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> callMomoApi(Map<String, Object> requestBody) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        return restTemplate.postForObject(momoEndpoint, entity, Map.class);
    }

    private PaymentResponse processPaymentResponse(Map<String, Object> response, Order order) {
        if (response == null) {
            log.error("Null response from Momo API for order: {}", order.getOrderCode());
            throw new AppException(ErrorCode.PAYMENT_GATEWAY_ERROR);
        }

        Object resultCodeObj = response.get("resultCode");
        String resultCode = resultCodeObj != null ? String.valueOf(resultCodeObj) : null;

        if (!SUCCESS_CODE.equals(resultCode)) {
            String message = (String) response.get("message");
            log.error("Momo payment creation failed for order {}: code={}, message={}",
                    order.getOrderCode(), resultCode, message);
            throw new AppException(ErrorCode.PAYMENT_FAILED, "Momo: " + message);
        }

        String payUrl = (String) response.get("payUrl");
        if (payUrl == null || payUrl.isEmpty()) {
            log.error("Missing payUrl in Momo response for order: {}", order.getOrderCode());
            throw new AppException(ErrorCode.PAYMENT_GATEWAY_ERROR);
        }

        log.info("Momo payment URL created successfully for order: {}", order.getOrderCode());

        return PaymentResponse.builder()
                .paymentUrl(payUrl)
                .orderCode(order.getOrderCode())
                .amount(order.getTotalAmount())
                .build();
    }

    @Transactional
    public boolean processPaymentNotify(Map<String, Object> params) {
        try {
            // Filter sensitive data before logging
            Map<String, Object> safeParams = new HashMap<>(params);
            safeParams.remove("signature");
            log.info("Processing Momo IPN for order: {}", safeParams.get("orderId"));

            // Verify signature
            if (!verifyNotifySignature(params)) {
                log.error("Momo signature verification failed for order: {}", params.get("orderId"));
                return false;
            }

            String momoOrderId = (String) params.get("orderId");
            String orderCode = extractOriginalOrderCode(momoOrderId);
            Object resultCodeObj = params.get("resultCode");
            String transId = String.valueOf(params.get("transId"));

            if (orderCode == null || resultCodeObj == null) {
                log.error("Missing required parameters in Momo IPN");
                return false;
            }

            // Lock order to prevent race condition
            Order order = orderRepository.findByOrderCodeWithLock(orderCode)
                    .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

            // Check if already processed (idempotency)
            if (order.getPaymentStatus() == PaymentStatus.PAID) {
                log.info("Order {} already paid, skipping duplicate IPN", orderCode);
                return true;
            }

            // Validate amount if present
            if (params.containsKey("amount")) {
                long receivedAmount = ((Number) params.get("amount")).longValue();
                long expectedAmount = order.getTotalAmount().longValue();

                if (receivedAmount != expectedAmount) {
                    log.error("Amount mismatch for order {}: expected {}, received {}",
                            orderCode, expectedAmount, receivedAmount);
                    return false;
                }
            }

            // Convert resultCode to integer
            int resultCode;
            if (resultCodeObj instanceof Integer) {
                resultCode = (Integer) resultCodeObj;
            } else {
                resultCode = Integer.parseInt(String.valueOf(resultCodeObj));
            }

            // Process payment result
            if (resultCode == 0) {
                // ✅ THANH TOÁN THÀNH CÔNG
                order.setPaymentStatus(PaymentStatus.PAID);
                order.setStatus(OrderStatus.CONFIRMED);  // Chuyển sang CONFIRMED
                order.setTransactionId(transId);
                order.setConfirmedAt(java.time.LocalDateTime.now());
                orderRepository.save(order);

                log.info("Momo payment successful for order: {}, transactionId: {}",
                        orderCode, transId);
                return true;
            } else {
                // ❌ THANH TOÁN THẤT BẠI - GIỮ PAYMENT_PENDING
                // Scheduler sẽ tự động hủy sau 1 tiếng
                order.setPaymentStatus(PaymentStatus.FAILED);
                orderRepository.save(order);

                log.warn("Momo payment failed for order: {} with result code: {}. Order remains PAYMENT_PENDING",
                        orderCode, resultCode);
                return false;
            }

        } catch (NumberFormatException e) {
            log.error("Invalid number format in Momo IPN", e);
            return false;
        } catch (Exception e) {
            log.error("Error processing Momo IPN", e);
            return false;
        }
    }

    private String extractOriginalOrderCode(String momoOrderId) {
        int lastDashIndex = momoOrderId.lastIndexOf('-');
        if (lastDashIndex > 0) {
            String possibleTimestamp = momoOrderId.substring(lastDashIndex + 1);
            if (possibleTimestamp.matches("\\d{13}")) {
                return momoOrderId.substring(0, lastDashIndex);
            }
        }
        return momoOrderId;
    }

    private boolean verifyNotifySignature(Map<String, Object> params) {
        try {
            String receivedSignature = (String) params.get("signature");

            if ("mock_signature".equals(receivedSignature)) {
                log.warn("⚠️ Using mock signature - DEV MODE ONLY");
                return true;
            }

            if (receivedSignature == null || receivedSignature.isEmpty()) {
                return false;
            }

            String rawSignature = "accessKey=" + accessKey +
                    "&amount=" + params.get("amount") +
                    "&extraData=" + params.get("extraData") +
                    "&message=" + params.get("message") +
                    "&orderId=" + params.get("orderId") +
                    "&orderInfo=" + params.get("orderInfo") +
                    "&orderType=" + params.get("orderType") +
                    "&partnerCode=" + partnerCode +
                    "&payType=" + params.get("payType") +
                    "&requestId=" + params.get("requestId") +
                    "&responseTime=" + params.get("responseTime") +
                    "&resultCode=" + params.get("resultCode") +
                    "&transId=" + params.get("transId");

            String calculatedSignature = hmacSHA256(secretKey, rawSignature);

            return calculatedSignature.equals(receivedSignature);

        } catch (Exception e) {
            log.error("Error verifying Momo signature", e);
            return false;
        }
    }

    private String hmacSHA256(String key, String data) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmac.init(secretKey);
        byte[] hash = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));

        StringBuilder result = new StringBuilder();
        for (byte b : hash) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
}