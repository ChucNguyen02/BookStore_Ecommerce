package chucnguyen.bookstore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySpendingData {
    private String month;        // Format: "2024-01"
    private Integer year;
    private Integer monthNumber;
    private BigDecimal totalSpent;
    private Integer orderCount;
}