package chucnguyen.bookstore.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_check_ins",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "check_in_date"}),
        indexes = {
                @Index(name = "idx_check_in_user", columnList = "user_id"),
                @Index(name = "idx_check_in_date", columnList = "check_in_date")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyCheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "points_earned")
    private Integer pointsEarned = 10;

    @Column(name = "consecutive_days")
    private Integer consecutiveDays = 1;

    @Column(name = "bonus_points")
    private Integer bonusPoints = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
