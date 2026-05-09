package chucnguyen.bookstore.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RedeemRewardRequest {

    @NotNull(message = "Reward ID is required")
    private String rewardId;

    private String shippingAddress; // For physical gifts
    private String note;
}
