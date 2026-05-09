package chucnguyen.bookstore.dto.response;

import chucnguyen.bookstore.entity.UserPoints;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPointsResponse {

    private String id;
    private String userId;
    private String fullName;
    private String email;
    private String avatarUrl;
    private Integer totalPoints;
    private Integer lifetimePoints;
    private String tier;
    private LocalDateTime tierUpdatedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserPointsResponse from(UserPoints userPoints) {
        UserPointsResponseBuilder builder = UserPointsResponse.builder()
                .id(userPoints.getId())
                .totalPoints(userPoints.getTotalPoints())
                .lifetimePoints(userPoints.getLifetimePoints())
                .tier(userPoints.getTier() != null ? userPoints.getTier().name() : null)
                .tierUpdatedAt(userPoints.getTierUpdatedAt())
                .createdAt(userPoints.getCreatedAt())
                .updatedAt(userPoints.getUpdatedAt());

        if (userPoints.getUser() != null) {
            builder.userId(userPoints.getUser().getId())
                    .fullName(userPoints.getUser().getFullName())
                    .email(userPoints.getUser().getEmail())
                    .avatarUrl(userPoints.getUser().getAvatarUrl());
        }

        return builder.build();
    }
}
