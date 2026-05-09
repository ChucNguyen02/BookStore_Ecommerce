package chucnguyen.bookstore.dto.request;

import chucnguyen.bookstore.entity.enums.DiscountType;
import chucnguyen.bookstore.entity.enums.RewardType;
import jakarta.validation.constraints.*;
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
public class RewardItemRequest {

    @NotBlank(message = "Reward name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Reward type is required")
    private RewardType type;

    @NotNull(message = "Points required is required")
    @Min(value = 1, message = "Points must be at least 1")
    private Integer pointsRequired;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stockQuantity;

    private String imageUrl;

    // For BOOK type
    private String bookId;

    // For VOUCHER type
    private DiscountType voucherDiscountType;
    private BigDecimal voucherDiscountValue;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Boolean isActive = true;
}