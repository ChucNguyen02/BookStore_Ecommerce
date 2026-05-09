package chucnguyen.bookstore.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookFilterRequest {

    private String keyword; // Search in title, description
    private String categoryId;
    private String authorId;

    @DecimalMin(value = "0.0", message = "Min price must be >= 0")
    private BigDecimal minPrice;

    @DecimalMin(value = "0.0", message = "Max price must be >= 0")
    private BigDecimal maxPrice;

    private String language;
    private Boolean isFeatured;
    private Boolean onSale; // Has discount

    @Min(value = 1, message = "Min rating must be between 1 and 5")
    @Max(value = 5, message = "Max rating must be between 1 and 5")
    private Integer minRating;

    // Pagination
    @Min(value = 0, message = "Page must be >= 0")
    @Builder.Default
    private Integer page = 0;

    @Min(value = 1, message = "Size must be >= 1")
    @Max(value = 100, message = "Size must be <= 100")
    @Builder.Default
    private Integer size = 20;

    // Sort
    @Builder.Default
    private String sortBy = "createdAt"; // createdAt, price, soldCount, averageRating

    @Builder.Default
    private String sortDirection = "DESC"; // ASC, DESC
}
