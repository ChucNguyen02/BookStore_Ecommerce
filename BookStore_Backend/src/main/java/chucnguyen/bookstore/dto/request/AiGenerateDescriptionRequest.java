package chucnguyen.bookstore.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiGenerateDescriptionRequest {

    private String title;
    private String author;
    private String category;
    private String existingDescription;
}
