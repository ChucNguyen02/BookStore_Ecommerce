package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.request.CancelOrderRequest;
import chucnguyen.bookstore.dto.request.CreateOrderRequest;
import chucnguyen.bookstore.dto.request.UpdateOrderStatusRequest;
import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.OrderDetailResponse;
import chucnguyen.bookstore.dto.response.OrderResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.entity.enums.OrderStatus;
import chucnguyen.bookstore.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order management APIs")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Create new order")
    public ApiResponse<OrderDetailResponse> createOrder(
            Authentication authentication,
            @Valid @RequestBody CreateOrderRequest request) {
        return ApiResponse.success(
                orderService.createOrder(authentication.getName(), request),
                "Order created successfully");
    }

    @GetMapping
    @Operation(summary = "Get user orders")
    public ApiResponse<PageResponse<OrderResponse>> getUserOrders(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                orderService.getUserOrders(authentication.getName(), page, size));
    }

    @GetMapping("/{orderCode}")
    @Operation(summary = "Get order detail")
    public ApiResponse<OrderDetailResponse> getOrderDetail(
            Authentication authentication,
            @PathVariable String orderCode) {
        return ApiResponse.success(
                orderService.getOrderDetail(authentication.getName(), orderCode));
    }

    @PostMapping("/{orderCode}/cancel")
    @Operation(summary = "Cancel order")
    public ApiResponse<Void> cancelOrder(
            Authentication authentication,
            @PathVariable String orderCode,
            @Valid @RequestBody CancelOrderRequest request) {
        orderService.cancelOrder(authentication.getName(), orderCode, request);
        return ApiResponse.success("Order cancelled successfully");
    }

    @PatchMapping("/{orderCode}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update order status (Admin only)")
    public ApiResponse<Void> updateOrderStatus(
            @PathVariable String orderCode,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        orderService.updateOrderStatus(orderCode, request);
        return ApiResponse.success("Order status updated");
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get user orders by status")
    public ApiResponse<PageResponse<OrderResponse>> getUserOrdersByStatus(
            Authentication authentication,
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        OrderStatus orderStatus = OrderStatus.valueOf(status);
        return ApiResponse.success(
                orderService.getUserOrdersByStatus(
                        authentication.getName(), orderStatus, page, size));
    }

    @GetMapping("/book/{bookId}")
    @Operation(summary = "Get user orders containing a book")
    public ApiResponse<List<OrderResponse>> getUserOrdersWithBook(
            Authentication authentication,
            @PathVariable String bookId) {
        return ApiResponse.success(
                orderService.getUserOrdersWithBook(authentication.getName(), bookId));
    }

    @GetMapping("/check-purchase/{bookId}")
    @Operation(summary = "Check if user has purchased a book")
    public ApiResponse<Map<String, Boolean>> checkUserPurchase(
            Authentication authentication,
            @PathVariable String bookId) {
        boolean hasPurchased = orderService.hasUserPurchasedBook(
                authentication.getName(), bookId);
        return ApiResponse.success(Map.of("hasPurchased", hasPurchased));
    }

    @GetMapping("/public/{orderCode}")
    @Operation(summary = "Get order detail by code (public)")
    public ApiResponse<OrderDetailResponse> getOrderByCodePublic(
            @PathVariable String orderCode) {
        return ApiResponse.success(
                orderService.getOrderDetailPublic(orderCode));
    }
}