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
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;

    private String description;
    private String parentId;
    private String imageUrl;
    private Integer displayOrder;
    private Boolean isActive;
}
