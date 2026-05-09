package chucnguyen.bookstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiRecommendRequest {

    @NotBlank(message = "Preferences is required")
    @Size(max = 500, message = "Preferences must not exceed 500 characters")
    private String preferences;
}
