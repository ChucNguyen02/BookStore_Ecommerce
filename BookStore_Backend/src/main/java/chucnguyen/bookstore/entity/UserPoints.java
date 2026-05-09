package chucnguyen.bookstore.entity;

import chucnguyen.bookstore.entity.enums.Tier;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_points")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPoints {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "total_points", nullable = false)
    private Integer totalPoints = 0;

    @Column(name = "lifetime_points", nullable = false)
    private Integer lifetimePoints = 0;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Tier tier = Tier.BRONZE;

    @Column(name = "tier_updated_at")
    private LocalDateTime tierUpdatedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    // Hàm trợ giúp
    public void addPoints(Integer points) {
        this.totalPoints += points;
        this.lifetimePoints += points;
    }

    public boolean subtractPoints(Integer points) {
        if (this.totalPoints < points) {
            return false; // Không đủ điểm
        }
        this.totalPoints -= points;
        return true;
    }
}
