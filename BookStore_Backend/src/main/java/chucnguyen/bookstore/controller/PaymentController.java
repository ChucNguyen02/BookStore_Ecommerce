package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.request.PaymentRequest;
import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.PaymentResponse;
import chucnguyen.bookstore.service.LocalPaymentService;
import chucnguyen.bookstore.service.MomoService;
import chucnguyen.bookstore.service.PayOSService;
import chucnguyen.bookstore.service.VNPayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import org.springframework.beans.factory.annotation.Value;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payment", description = "Payment gateway APIs")
public class PaymentController {

    private final VNPayService vnPayService;
    private final MomoService momoService;
    private final PayOSService payOSService;
    private final LocalPaymentService localPaymentService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    // ============================================================
    // VNPAY
    // ============================================================

    @PostMapping("/vnpay/create")
    @Operation(summary = "Create VNPay payment")
    public ApiResponse<PaymentResponse> createVNPayPayment(
            @Valid @RequestBody PaymentRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = httpRequest.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = httpRequest.getRemoteAddr();
        }
        request.setIpAddress(ipAddress);

        PaymentResponse response = vnPayService.createPayment(request);
        return ApiResponse.success(response, "VNPay payment URL created");
    }

    @GetMapping("/vnpay/return")
    @Operation(summary = "VNPay payment return callback")
    public RedirectView vnpayReturn(HttpServletRequest request) {
        log.info("=== VNPAY RETURN CALLBACK ===");
        log.info("Full URL: {}", request.getRequestURL() + "?" + request.getQueryString());

        Map<String, String> params = new HashMap<>();
        request.getParameterMap().forEach((key, values) -> {
            if (values.length > 0) {
                params.put(key, values[0]);
                log.info("Param [{}] = {}", key, values[0]);
            }
        });

        boolean success = vnPayService.processPaymentReturn(params);
        String orderCode = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");

        log.info("Payment result: success={}, orderCode={}, responseCode={}",
                success, orderCode, responseCode);

        String redirectUrl = frontendUrl + "/payment-result" +
                "?orderCode=" + orderCode +
                "&resultCode=" + (success ? "0" : responseCode);

        log.info("Redirecting to: {}", redirectUrl);
        return new RedirectView(redirectUrl);
    }

    // ============================================================
    // MOMO
    // ============================================================

    @PostMapping("/momo/create")
    @Operation(summary = "Create Momo payment")
    public ApiResponse<PaymentResponse> createMomoPayment(
            @Valid @RequestBody PaymentRequest request) {

        PaymentResponse response = momoService.createPayment(request);
        return ApiResponse.success(response, "Momo payment URL created");
    }

    @PostMapping("/momo/notify")
    @Operation(summary = "Momo payment IPN callback")
    public ApiResponse<Map<String, Object>> momoNotify(@RequestBody Map<String, Object> params) {
        log.info("Received Momo IPN: {}", params);

        boolean success = momoService.processPaymentNotify(params);

        Map<String, Object> response = new HashMap<>();
        response.put("partnerCode", params.get("partnerCode"));
        response.put("requestId", params.get("requestId"));
        response.put("orderId", params.get("orderId"));
        response.put("resultCode", success ? 0 : 1);
        response.put("message", success ? "Success" : "Failed");

        return ApiResponse.success(response);
    }

    @GetMapping("/momo/return")
    @Operation(summary = "Momo payment return callback")
    public RedirectView momoReturn(HttpServletRequest request) {
        String momoOrderId = request.getParameter("orderId");
        String resultCode = request.getParameter("resultCode");

        String orderCode = extractOriginalOrderCode(momoOrderId);

        String redirectUrl = frontendUrl + "/payment-result" +
                "?orderCode=" + orderCode +
                "&resultCode=" + resultCode;

        return new RedirectView(redirectUrl);
    }

    // ============================================================
    // PAYOS
    // ============================================================

    @PostMapping("/payos/create")
    @Operation(summary = "Create PayOS payment link")
    public ApiResponse<PaymentResponse> createPayOSPayment(
            @Valid @RequestBody PaymentRequest request) {

        log.info("Creating PayOS payment for order: {}", request.getOrderCode());
        PaymentResponse response = payOSService.createPayment(request);
        return ApiResponse.success(response, "PayOS payment link created");
    }

    /**
     * PayOS Webhook (IPN) - PayOS gọi endpoint này sau khi user thanh toán
     * Endpoint này KHÔNG cần auth (PayOS server gọi trực tiếp)
     */
    @PostMapping("/payos/webhook")
    @Operation(summary = "PayOS webhook callback (IPN)")
    public Map<String, Object> payosWebhook(@RequestBody Map<String, Object> webhookBody) {
        log.info("=== PAYOS WEBHOOK RECEIVED ===");
        log.info("Webhook body: {}", webhookBody);

        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = payOSService.processWebhook(webhookBody);
            result.put("error", 0);
            result.put("message", success ? "Ok" : "Failed");
        } catch (Exception e) {
            log.error("Error processing PayOS webhook: {}", e.getMessage());
            result.put("error", -1);
            result.put("message", e.getMessage());
        }
        return result;
    }

    /**
     * PayOS Return URL - user được redirect về đây sau khi thanh toán/hủy
     */
    @GetMapping("/payos/return")
    @Operation(summary = "PayOS return callback")
    public RedirectView payosReturn(HttpServletRequest request) {
        String orderCode = request.getParameter("appOrderCode");
        if (orderCode == null) {
            orderCode = request.getParameter("orderCode");
        }
        String resultCode = request.getParameter("resultCode");
        String status = request.getParameter("status");

        log.info("=== PAYOS RETURN: orderCode={}, resultCode={}, status={}", orderCode, resultCode, status);

        // Verify payment nếu cần
        if ("0".equals(resultCode) || "PAID".equals(status)) {
            payOSService.processReturnCallback(orderCode, "0");
        }

        String redirectUrl = frontendUrl + "/payment-result" +
                "?orderCode=" + orderCode +
                "&resultCode=" + (resultCode != null ? resultCode : "1");

        log.info("Redirecting to: {}", redirectUrl);
        return new RedirectView(redirectUrl);
    }

    /**
     * PayOS Cancel URL - user được redirect về đây khi hủy thanh toán
     */
    @GetMapping("/payos/cancel")
    @Operation(summary = "PayOS cancel callback")
    public RedirectView payosCancel(HttpServletRequest request) {
        String orderCode = request.getParameter("appOrderCode");
        if (orderCode == null) {
            orderCode = request.getParameter("orderCode");
        }
        String resultCode = request.getParameter("resultCode");

        log.info("=== PAYOS CANCEL: orderCode={}, resultCode={}", orderCode, resultCode);

        String redirectUrl = frontendUrl + "/payment-result" +
                "?orderCode=" + orderCode +
                "&resultCode=1";

        return new RedirectView(redirectUrl);
    }

    // ============================================================
    // LOCAL (DEV)
    // ============================================================

    @PostMapping("/local/create")
    @Operation(summary = "Create local test payment")
    public ApiResponse<PaymentResponse> createLocalPayment(
            @Valid @RequestBody PaymentRequest request) {

        PaymentResponse response = localPaymentService.createPayment(request);

        String paymentUrl = frontendUrl + "/payment-result" +
                "?orderCode=" + response.getOrderCode() +
                "&resultCode=0";

        response.setPaymentUrl(paymentUrl);
        return ApiResponse.success(response, "Local payment confirmed");
    }

    // ============================================================
    // HELPERS
    // ============================================================

    private String extractOriginalOrderCode(String momoOrderId) {
        if (momoOrderId == null || momoOrderId.isEmpty()) {
            return null;
        }

        int lastDashIndex = momoOrderId.lastIndexOf('-');
        if (lastDashIndex > 0) {
            String possibleTimestamp = momoOrderId.substring(lastDashIndex + 1);
            if (possibleTimestamp.matches("\\d{13}")) {
                return momoOrderId.substring(0, lastDashIndex);
            }
        }

        return momoOrderId;
    }
}