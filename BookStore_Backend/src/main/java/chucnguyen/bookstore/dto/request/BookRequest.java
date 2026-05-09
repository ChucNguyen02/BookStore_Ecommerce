package chucnguyen.bookstore.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 500, message = "Title must not exceed 500 characters")
    private String title;

    @Size(max = 13, message = "ISBN must not exceed 13 characters")
    private String isbn;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @DecimalMin(value = "0.0", message = "Discount price must be >= 0")
    private BigDecimal discountPrice;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be >= 0")
    private Integer stockQuantity;

    @Min(value = 1, message = "Pages must be at least 1")
    private Integer pages;

    private String publisher;

    @Min(value = 1000, message = "Publish year must be valid")
    @Max(value = 9999, message = "Publish year must be valid")
    private Integer publishYear;

    private String language;

    @NotNull(message = "Category is required")
    private String categoryId;

    @NotEmpty(message = "At least one author is required")
    private List<String> authorIds;

    private Boolean isFeatured;
    private Boolean isActive;

}
