package chucnguyen.bookstore.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
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
public class BookDetailResponse {

    private String id;
    private String title;
    private String slug;
    private String isbn;
    private String description;

    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer discountPercentage;

    private Integer stockQuantity;
    private Integer pages;
    private String publisher;
    private Integer publishYear;
    private String language;

    private String coverImageUrl;
    private List<String> imageUrls; // Additional images

    // Category
    private CategorySimpleResponse category;

    // Authors
    private List<AuthorResponse> authors;

    // Stats
    private BigDecimal averageRating;
    private Integer reviewCount;
    private Integer soldCount;
    private Integer viewCount;

    private Boolean isFeatured;
    private Boolean isActive;
    private Boolean inStock;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;


}
