package chucnguyen.bookstore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {

    private String id;
    private String bookId;
    private String bookTitle;
    private String bookSlug;
    private String bookImage;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;

    // For review
    private Boolean canReview;
    private Boolean hasReviewed;
}
