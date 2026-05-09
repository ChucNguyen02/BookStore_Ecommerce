package chucnguyen.bookstore.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewFilterRequest {

    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer rating;

    private Boolean hasImages;
    private Boolean hasComment;

    @Builder.Default
    private String sortBy = "createdAt"; // createdAt, helpfulCount

    @Builder.Default
    private String sortDirection = "DESC";

    @Min(value = 0)
    @Builder.Default
    private Integer page = 0;

    @Min(value = 1)
    @Max(value = 100)
    @Builder.Default
    private Integer size = 20;
}
