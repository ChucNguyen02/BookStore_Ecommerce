package chucnguyen.bookstore.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookResponse {

    private String id;
    private String title;
    private String slug;
    private String isbn;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer discountPercentage; // Calculated
    private Integer stockQuantity;
    private String coverImageUrl;

    // Category
    private String categoryId;
    private String categoryName;

    // Authors
    private List<AuthorSimpleResponse> authors;

    // Stats
    private BigDecimal averageRating;
    private Integer reviewCount;
    private Integer soldCount;
    private Boolean isFeatured;
    private Boolean isOnSale;
    private Boolean inStock;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    String categorySlug;
}
