package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.UserReward;
import chucnguyen.bookstore.entity.enums.RedemptionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRewardRepository extends JpaRepository<UserReward, String> {

    // Lịch sử đổi quà của user
    Page<UserReward> findByUserIdOrderByRedeemedAtDesc(String userId, Pageable pageable);

    // Lịch sử theo status
    Page<UserReward> findByUserIdAndStatusOrderByRedeemedAtDesc(
            String userId,
            RedemptionStatus status,
            Pageable pageable
    );

    // Tất cả redemptions pending (cho admin)
    List<UserReward> findByStatus(RedemptionStatus status);

    // Đếm số lần đổi reward cụ thể
    long countByRewardId(String rewardId);

    // Đếm số lần user đổi quà
    long countByUserId(String userId);

    // Tổng điểm đã spend
    @Query("SELECT COALESCE(SUM(ur.pointsSpent), 0) FROM UserReward ur " +
            "WHERE ur.user.id = :userId")
    Integer sumPointsSpentByUserId(@Param("userId") String userId);

    // Check user đã đổi reward này chưa
    boolean existsByUserIdAndRewardId(String userId, String rewardId);

    // Lấy voucher codes của user
    @Query("SELECT ur FROM UserReward ur WHERE ur.user.id = :userId " +
            "AND ur.voucherCode IS NOT NULL AND ur.status = 'COMPLETED'")
    List<UserReward> findUserVouchers(@Param("userId") String userId);
}
