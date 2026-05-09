package chucnguyen.bookstore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointsResponse {

    private Integer totalPoints;
    private Integer lifetimePoints;
    private String tier;
    private Integer pointsToNextTier;
    private String nextTier;
}
