package chucnguyen.bookstore.entity;

import chucnguyen.bookstore.entity.enums.RewardType;
import chucnguyen.bookstore.entity.enums.VoucherDiscountType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reward_items", indexes = {
        @Index(name = "idx_reward_type", columnList = "type"),
        @Index(name = "idx_reward_active", columnList = "is_active")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RewardItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RewardType type;

    @Column(name = "points_required", nullable = false)
    private Integer pointsRequired;

    @Column(name = "image_url")
    private String imageUrl;

    // For BOOK type
    @Column(name = "book_id")
    private String bookId;

    // For VOUCHER type
    @Column(name = "voucher_code")
    private String voucherCode;

    @Column(name = "voucher_discount_value", precision = 10, scale = 2)
    private BigDecimal voucherDiscountValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "voucher_discount_type", length = 20)
    private VoucherDiscountType voucherDiscountType;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;

    @Column(name = "claimed_count")
    private Integer claimedCount = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
