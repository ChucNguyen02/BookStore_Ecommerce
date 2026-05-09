package chucnguyen.bookstore.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryResponse {

    private String id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private Integer displayOrder;

    private String parentId;
    private String parentName;

    private List<CategorySimpleResponse> children; // Sub-categories

    private Long bookCount;
    private Boolean isActive;
}
