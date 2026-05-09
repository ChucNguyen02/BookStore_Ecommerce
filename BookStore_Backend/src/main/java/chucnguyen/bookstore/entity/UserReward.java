package chucnguyen.bookstore.entity;

import chucnguyen.bookstore.entity.enums.RedemptionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_rewards", indexes = {
        @Index(name = "idx_user_rewards_user", columnList = "user_id"),
        @Index(name = "idx_user_rewards_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserReward {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reward_id", nullable = false)
    private RewardItem reward;

    @Column(name = "points_spent", nullable = false)
    private Integer pointsSpent;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RedemptionStatus status = RedemptionStatus.PENDING;

    @Column(name = "voucher_code")
    private String voucherCode;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "redeemed_at")
    private LocalDateTime redeemedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

}
