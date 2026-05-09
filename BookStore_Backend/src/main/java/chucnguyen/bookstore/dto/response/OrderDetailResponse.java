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
public class OrderDetailResponse {

    private String id;
    private String orderCode;

    // User info
    private String userId;
    private String userEmail;

    // Shipping info
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;

    // Payment breakdown
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private Integer pointsUsed;
    private BigDecimal pointsDiscount;
    private BigDecimal totalAmount;

    // Voucher
    private String voucherCode;
    private BigDecimal voucherDiscount;

    // Payment
    private String paymentMethod;
    private String paymentStatus;

    // Status
    private String status;
    private String note;
    private String cancelledReason;

    // Items
    private List<OrderItemResponse> items;

    // Points earned
    private Integer pointsEarned;

    // Timestamps
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime confirmedAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime shippedAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime deliveredAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime cancelledAt;

    // Actions
    private Boolean canCancel;
    private Boolean canReview;

    private String transactionId;

    private String trackingNumber;
}
