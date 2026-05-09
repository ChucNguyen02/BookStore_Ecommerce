package chucnguyen.bookstore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointsSummaryResponse {

    private Integer totalPoints;
    private Integer lifetimePoints;
    private String tier;

    // This month
    private Integer pointsEarnedThisMonth;
    private Integer pointsRedeemedThisMonth;

    // Check-in streak
    private Integer consecutiveCheckInDays;
    private Boolean checkedInToday;

    // Statistics
    private Integer totalCheckIns;
    private Integer totalRedemptions;
}
