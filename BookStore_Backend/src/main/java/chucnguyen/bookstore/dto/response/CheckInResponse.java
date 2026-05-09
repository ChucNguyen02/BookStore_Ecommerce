package chucnguyen.bookstore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckInResponse {

    private LocalDate checkInDate;
    private Integer pointsEarned;
    private Integer bonusPoints;
    private Integer consecutiveDays;
    private Integer totalPoints; // After check-in
    private String message;
    private Integer nextBonusAt; // Next streak milestone
}
