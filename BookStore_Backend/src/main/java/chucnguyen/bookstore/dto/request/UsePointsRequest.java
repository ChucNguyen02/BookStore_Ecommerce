package chucnguyen.bookstore.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsePointsRequest {

    @NotNull(message = "Points amount is required")
    @Min(value = 1, message = "Points must be at least 1")
    private Integer points;
}
