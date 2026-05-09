package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.request.AddOrderNoteRequest;
import chucnguyen.bookstore.dto.request.UpdateTrackingNumberRequest;
import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.OrderResponse;
import chucnguyen.bookstore.dto.response.OrderStatisticsResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.entity.Order;
import chucnguyen.bookstore.entity.enums.OrderStatus;
import chucnguyen.bookstore.entity.enums.PaymentMethod;
import chucnguyen.bookstore.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Orders", description = "Admin order management APIs")
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "Get all orders with pagination")
    public ApiResponse<PageResponse<OrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                orderService.getAllOrders(page, size));
    }

    @GetMapping("/search")
    @Operation(summary = "Search orders by keyword")
    public ApiResponse<PageResponse<OrderResponse>> searchOrders(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                orderService.searchOrders(keyword, page, size));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get orders by customer ID")
    public ApiResponse<PageResponse<OrderResponse>> getOrdersByCustomer(
            @PathVariable String customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                orderService.getOrdersByCustomerId(customerId, page, size));
    }

    @GetMapping("/phone/{phone}")
    @Operation(summary = "Get orders by phone number")
    public ApiResponse<PageResponse<OrderResponse>> getOrdersByPhone(
            @PathVariable String phone,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                orderService.getOrdersByPhone(phone, page, size));
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get orders by email")
    public ApiResponse<PageResponse<OrderResponse>> getOrdersByEmail(
            @PathVariable String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                orderService.getOrdersByEmail(email, page, size));
    }

    @GetMapping("/payment-method/{paymentMethod}")
    @Operation(summary = "Get orders by payment method")
    public ApiResponse<PageResponse<OrderResponse>> getOrdersByPaymentMethod(
            @PathVariable String paymentMethod,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PaymentMethod method = PaymentMethod.valueOf(paymentMethod);
        return ApiResponse.success(
                orderService.getOrdersByPaymentMethod(method, page, size));
    }

    @GetMapping("/auto-complete")
    @Operation(summary = "Get orders ready for auto-complete")
    public ApiResponse<List<Order>> getOrdersToAutoComplete(
            @RequestParam(defaultValue = "7") int daysAfterDelivery) {
        return ApiResponse.success(
                orderService.getOrdersToAutoComplete(daysAfterDelivery));
    }

    @GetMapping("/expired-pending")
    @Operation(summary = "Get expired pending orders")
    public ApiResponse<List<Order>> getExpiredPendingOrders(
            @RequestParam(defaultValue = "24") int hoursTimeout) {
        return ApiResponse.success(
                orderService.getExpiredPendingOrders(hoursTimeout));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get all orders by status")
    public ApiResponse<PageResponse<OrderResponse>> getAllOrdersByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        OrderStatus orderStatus = OrderStatus.valueOf(status);
        return ApiResponse.success(
                orderService.getAllOrdersByStatus(orderStatus, page, size));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get orders between dates")
    public ApiResponse<PageResponse<OrderResponse>> getOrdersBetweenDates(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        // Default: Last 30 days
        LocalDate effectiveStartDate = startDate != null ? startDate : LocalDate.now().minusDays(30);
        LocalDate effectiveEndDate = endDate != null ? endDate : LocalDate.now();

        LocalDateTime startDateTime = effectiveStartDate.atStartOfDay();
        LocalDateTime endDateTime = effectiveEndDate.atTime(23, 59, 59);

        return ApiResponse.success(
                orderService.getOrdersBetweenDates(startDateTime, endDateTime, page, size));
    }

    @PostMapping("/{orderCode}/note")
    @Operation(summary = "Add note to order")
    public ApiResponse<Void> addOrderNote(
            @PathVariable String orderCode,
            @RequestBody AddOrderNoteRequest request) {
        orderService.addOrderNote(orderCode, request.getNote());
        return ApiResponse.success(null);
    }

    @PatchMapping("/{orderCode}/tracking")
    @Operation(summary = "Update tracking number")
    public ApiResponse<Void> updateTrackingNumber(
            @PathVariable String orderCode,
            @RequestBody UpdateTrackingNumberRequest request) {
        orderService.updateTrackingNumber(orderCode, request.getTrackingNumber());
        return ApiResponse.success(null);
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get order statistics")
    public ApiResponse<OrderStatisticsResponse> getOrderStatistics() {
        return ApiResponse.success(orderService.getOrderStatistics());
    }
}