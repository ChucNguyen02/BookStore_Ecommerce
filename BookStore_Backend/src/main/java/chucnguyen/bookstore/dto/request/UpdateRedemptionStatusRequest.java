package chucnguyen.bookstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRedemptionStatusRequest {

    @NotBlank(message = "Status is required")
    private String status; // PENDING, PROCESSING, COMPLETED, CANCELLED

    private String trackingNumber;

    private String note;
}