package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.RewardItem;
import chucnguyen.bookstore.entity.enums.RewardType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardItemRepository extends JpaRepository<RewardItem, String> {

    // Tìm reward active
    List<RewardItem> findByIsActiveTrue();

    // Tìm reward theo type
    List<RewardItem> findByTypeAndIsActiveTrue(RewardType type);

    // Tìm reward trong khoảng điểm
    @Query("SELECT ri FROM RewardItem ri WHERE ri.isActive = true " +
            "AND ri.pointsRequired <= :maxPoints ORDER BY ri.pointsRequired ASC")
    List<RewardItem> findAvailableRewards(@Param("maxPoints") Integer maxPoints);

    // Tìm reward có stock
    @Query("SELECT ri FROM RewardItem ri WHERE ri.isActive = true " +
            "AND ri.stockQuantity > 0 ORDER BY ri.pointsRequired ASC")
    List<RewardItem> findRewardsInStock();

    // Tìm reward theo khoảng điểm
    @Query("SELECT ri FROM RewardItem ri WHERE ri.isActive = true " +
            "AND ri.pointsRequired BETWEEN :minPoints AND :maxPoints")
    List<RewardItem> findRewardsByPointsRange(
            @Param("minPoints") Integer minPoints,
            @Param("maxPoints") Integer maxPoints
    );

    // Top rewards được đổi nhiều nhất
    @Query("SELECT ri FROM RewardItem ri ORDER BY ri.claimedCount DESC")
    Page<RewardItem> findTopClaimedRewards(Pageable pageable);

    // Kiểm tra còn stock không
    @Query("SELECT CASE WHEN ri.stockQuantity > 0 THEN true ELSE false END " +
            "FROM RewardItem ri WHERE ri.id = :rewardId")
    boolean hasStock(@Param("rewardId") String rewardId);

    // Giảm stock (atomic operation)
    @Modifying
    @Query("UPDATE RewardItem ri SET ri.stockQuantity = ri.stockQuantity - 1, " +
            "ri.claimedCount = ri.claimedCount + 1 WHERE ri.id = :rewardId " +
            "AND ri.stockQuantity > 0")
    int decrementStock(@Param("rewardId") String rewardId);
}
