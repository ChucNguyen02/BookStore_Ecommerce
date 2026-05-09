package chucnguyen.bookstore.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointTransactionResponse {

    private String id;
    private Integer points; // + for earn, - for redeem
    private String type; // EARN, REDEEM, EXPIRE, REFUND
    private String referenceType; // ORDER, REVIEW, DAILY_CHECK_IN, etc.
    private String referenceId;
    private String description;
    private Integer balanceAfter;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}
