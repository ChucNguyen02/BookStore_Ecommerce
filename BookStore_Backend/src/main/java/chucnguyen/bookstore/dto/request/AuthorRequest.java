package chucnguyen.bookstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorRequest {

    @NotBlank(message = "Author name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;

    private String bio;
    private String avatarUrl;
    private LocalDate birthDate;
    private String nationality;
}
