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
public class ReviewSummaryResponse {

    private BigDecimal averageRating;
    private Integer totalReviews;

    // Rating distribution: {5: 100, 4: 50, 3: 20, 2: 10, 1: 5}
    private Map<Integer, Integer> ratingDistribution;

    // Percentages
    private Map<Integer, Double> ratingPercentages;
}
