package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.BookResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.service.OrderItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/admin/order-items")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Order Items", description = "Admin order items APIs")
public class OrderItemController {

    private final OrderItemService orderItemService;

    @GetMapping("/best-selling")
    @Operation(summary = "Get best selling books")
    public ApiResponse<PageResponse<BookResponse>> getBestSellingBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                orderItemService.getBestSellingBooks(page, size));
    }

    @GetMapping("/book/{bookId}/revenue")
    @Operation(summary = "Get book revenue")
    public ApiResponse<BigDecimal> getBookRevenue(@PathVariable String bookId) {
        return ApiResponse.success(orderItemService.getBookRevenue(bookId));
    }

    @GetMapping("/book/{bookId}/quantity-sold")
    @Operation(summary = "Get book quantity sold")
    public ApiResponse<Long> getBookQuantitySold(@PathVariable String bookId) {
        return ApiResponse.success(orderItemService.getBookQuantitySold(bookId));
    }
}