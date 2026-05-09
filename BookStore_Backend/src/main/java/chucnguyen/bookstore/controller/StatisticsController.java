package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.StatisticsResponse;
import chucnguyen.bookstore.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/admin/statistics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Statistics", description = "Statistics APIs (Admin only)")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping
    @Operation(summary = "Get overall statistics")
    public ApiResponse<StatisticsResponse> getStatistics() {
        return ApiResponse.success(statisticsService.getStatistics());
    }

    @GetMapping("/inventory-value")
    @Operation(summary = "Get total inventory value")
    public ApiResponse<BigDecimal> getTotalInventoryValue() {
        return ApiResponse.success(statisticsService.getTotalInventoryValue());
    }

    @GetMapping("/books-sold")
    @Operation(summary = "Get total books sold")
    public ApiResponse<Long> getTotalBooksSold() {
        return ApiResponse.success(statisticsService.getTotalBooksSold());
    }
}