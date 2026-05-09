package chucnguyen.bookstore.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
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
public class OrderResponse {

    private String id;
    private String orderCode;

    private BigDecimal totalAmount;
    private String status; // PENDING, CONFIRMED, SHIPPING, DELIVERED, CANCELLED
    private String paymentStatus; // PENDING, PAID, FAILED
    private String paymentMethod;

    private Integer itemCount;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime deliveredAt;

    // For quick actions
    private Boolean canCancel;
    private Boolean canReview;
}
