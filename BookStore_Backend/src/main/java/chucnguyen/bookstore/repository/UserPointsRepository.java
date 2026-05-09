package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.UserPoints;
import chucnguyen.bookstore.entity.enums.Tier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPointsRepository extends JpaRepository<UserPoints, String> {

    // Tìm điểm của user
    Optional<UserPoints> findByUserId(String userId);

    // Tìm điểm của user (với eager loading)
    @Query("SELECT up FROM UserPoints up JOIN FETCH up.user WHERE up.user.id = :userId")
    Optional<UserPoints> findByUserIdWithUser(@Param("userId") String userId);

    // Tìm user theo tier
    List<UserPoints> findByTier(Tier tier);

    // Top users có nhiều điểm nhất
    @Query(value = "SELECT up FROM UserPoints up JOIN FETCH up.user ORDER BY up.totalPoints DESC",
            countQuery = "SELECT COUNT(up) FROM UserPoints up")
    Page<UserPoints> findTopUsersByPoints(Pageable pageable);

    // Top users có lifetime points cao nhất
    @Query(value = "SELECT up FROM UserPoints up JOIN FETCH up.user ORDER BY up.lifetimePoints DESC",
            countQuery = "SELECT COUNT(up) FROM UserPoints up")
    Page<UserPoints> findTopUsersByLifetimePoints(Pageable pageable);

    // Đếm số user theo tier
    long countByTier(Tier tier);

    // Tổng điểm của tất cả users
    @Query("SELECT SUM(up.totalPoints) FROM UserPoints up")
    Long sumAllPoints();

    // Check user có đủ điểm không
    @Query("SELECT CASE WHEN up.totalPoints >= :points THEN true ELSE false END " +
            "FROM UserPoints up WHERE up.user.id = :userId")
    boolean hasEnoughPoints(@Param("userId") String userId, @Param("points") Integer points);
}
