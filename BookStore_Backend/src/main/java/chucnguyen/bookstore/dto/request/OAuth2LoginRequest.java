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
public class OAuth2LoginRequest {

    @NotBlank(message = "Provider is required")
    private String provider; // GOOGLE, FACEBOOK

    @NotBlank(message = "Access token is required")
    private String accessToken;
}
