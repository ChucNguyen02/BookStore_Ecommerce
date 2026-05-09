package chucnguyen.bookstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTrackingNumberRequest {
    @NotBlank(message = "Tracking number cannot be blank")
    private String trackingNumber;
}
