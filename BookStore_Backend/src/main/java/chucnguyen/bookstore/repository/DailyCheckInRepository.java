package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.DailyCheckIn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyCheckInRepository extends JpaRepository<DailyCheckIn, String> {

    // Check user đã check-in hôm nay chưa
    boolean existsByUserIdAndCheckInDate(String userId, LocalDate checkInDate);

    // Lấy check-in hôm nay của user
    Optional<DailyCheckIn> findByUserIdAndCheckInDate(String userId, LocalDate checkInDate);

    // Lấy check-in gần nhất của user
    @Query("SELECT d FROM DailyCheckIn d WHERE d.user.id = :userId " +
            "ORDER BY d.checkInDate DESC LIMIT 1")
    Optional<DailyCheckIn> findLatestCheckInByUserId(@Param("userId") String userId);

    // Lịch sử check-in của user
    Page<DailyCheckIn> findByUserIdOrderByCheckInDateDesc(String userId, Pageable pageable);

    // Lấy streak hiện tại (số ngày liên tiếp)
    @Query("SELECT dci FROM DailyCheckIn dci WHERE dci.user.id = :userId " +
            "AND dci.checkInDate >= :fromDate ORDER BY dci.checkInDate DESC")
    List<DailyCheckIn> findRecentCheckIns(
            @Param("userId") String userId,
            @Param("fromDate") LocalDate fromDate
    );

    // Đếm tổng số ngày đã check-in
    int countByUserId(String userId);

    // Tổng điểm earned từ check-in
    @Query("SELECT COALESCE(SUM(dci.pointsEarned + dci.bonusPoints), 0) " +
            "FROM DailyCheckIn dci WHERE dci.user.id = :userId")
    Integer sumTotalPointsByUserId(@Param("userId") String userId);

    // Top users check-in nhiều nhất
    @Query("SELECT dci.user.id, COUNT(dci) as checkInCount FROM DailyCheckIn dci " +
            "GROUP BY dci.user.id ORDER BY checkInCount DESC")
    Page<Object[]> findTopCheckInUsers(Pageable pageable);
}
