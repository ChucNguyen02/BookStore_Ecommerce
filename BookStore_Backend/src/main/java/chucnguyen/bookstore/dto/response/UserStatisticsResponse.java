package chucnguyen.bookstore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatisticsResponse {
    private Integer totalOrders;
    private BigDecimal totalSpent;
    private Integer totalBooks;
    private Integer totalReviews;

    private List<MonthlySpendingData> monthlySpending;
    private Map<String, Integer> ordersByStatus;
    private List<CategorySpendingData> topCategories;

    private BigDecimal averageOrderValue;
    private LocalDateTime firstOrderDate;
    private LocalDateTime lastOrderDate;
}