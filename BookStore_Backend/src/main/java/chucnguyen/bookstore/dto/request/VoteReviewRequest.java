package chucnguyen.bookstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoteReviewRequest {

    @NotBlank(message = "Vote type is required")
    @Pattern(regexp = "HELPFUL|UNHELPFUL", message = "Vote must be HELPFUL or UNHELPFUL")
    private String vote;
}
