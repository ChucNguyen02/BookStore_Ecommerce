package chucnguyen.bookstore.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RewardItemResponse {

    private String id;
    private String name;
    private String description;
    private String type; // BOOK, VOUCHER, GIFT
    private Integer pointsRequired;
    private String imageUrl;

    // For BOOK type
    private String bookId;
    private String bookTitle;

    // For VOUCHER type
    private BigDecimal voucherDiscountValue;
    private String voucherDiscountType;

    private Integer stockQuantity;
    private Integer claimedCount;
    private Boolean isAvailable; // stockQuantity > 0 && isActive

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDate;
}
