package chucnguyen.bookstore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsResponse {

    // Overview
    private Long totalUsers;
    private Long totalBooks;
    private Long totalOrders;
    private BigDecimal totalRevenue;

    // Today
    private Long todayOrders;
    private BigDecimal todayRevenue;

    // This month
    private Long monthlyOrders;
    private BigDecimal monthlyRevenue;

    // Orders by status
    private Map<String, Long> ordersByStatus;

    // Revenue chart data (last 30 days)
    private Map<String, BigDecimal> dailyRevenue;

    // Top selling books
    private java.util.List<BookResponse> topSellingBooks;

    // Top customers
    private java.util.List<UserResponse> topCustomers;
}