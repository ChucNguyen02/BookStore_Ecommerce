package chucnguyen.bookstore.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "view_history",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "book_id"}),
        indexes = {
                @Index(name = "idx_view_history_user", columnList = "user_id"),
                @Index(name = "idx_view_history_last_viewed", columnList = "last_viewed_at")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ViewHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "view_count")
    private Integer viewCount = 1;

    @Column(name = "last_viewed_at")
    private LocalDateTime lastViewedAt;
}
