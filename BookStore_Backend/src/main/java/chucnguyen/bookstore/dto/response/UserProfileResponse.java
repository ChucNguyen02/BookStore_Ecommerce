package chucnguyen.bookstore.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfileResponse {

    private String id;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String role;

    private String authProviders;

    private Boolean isActive;
    private Boolean emailVerified;
    private LocalDateTime createdAt;

    // Points summary
    private Integer totalPoints;
    private Integer lifetimePoints;
    private String tier;

    // Statistics
    private Long totalOrders;
    private Long totalReviews;
    private Integer consecutiveCheckInDays;

    private Long totalQuestions;
}