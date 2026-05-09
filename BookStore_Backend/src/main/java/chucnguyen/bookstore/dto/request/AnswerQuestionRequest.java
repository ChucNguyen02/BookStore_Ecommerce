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
public class AnswerQuestionRequest {

    @NotBlank(message = "Answer is required")
    @Size(max = 2000, message = "Answer must not exceed 2000 characters")
    private String answer;
}
