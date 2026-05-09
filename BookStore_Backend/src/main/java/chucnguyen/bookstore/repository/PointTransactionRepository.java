package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.PointTransaction;
import chucnguyen.bookstore.entity.enums.ReferenceType;
import chucnguyen.bookstore.entity.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PointTransactionRepository extends JpaRepository<PointTransaction, String> {

    // Lịch sử giao dịch của user
    Page<PointTransaction> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    // Lịch sử theo type
    Page<PointTransaction> findByUserIdAndTypeOrderByCreatedAtDesc(
            String userId,
            TransactionType type,
            Pageable pageable
    );

    // Lịch sử theo reference type
    List<PointTransaction> findByReferenceTypeAndReferenceId(
            ReferenceType referenceType,
            String referenceId
    );

    // Tổng điểm earn của user
    @Query("SELECT COALESCE(SUM(pt.points), 0) FROM PointTransaction pt " +
            "WHERE pt.user.id = :userId AND pt.type = 'EARN'")
    Integer sumEarnedPoints(@Param("userId") String userId);

    // Tổng điểm redeem của user
    @Query("SELECT COALESCE(SUM(ABS(pt.points)), 0) FROM PointTransaction pt " +
            "WHERE pt.user.id = :userId AND pt.type = 'REDEEM'")
    Integer sumRedeemedPoints(@Param("userId") String userId);

    // Điểm earn trong khoảng thời gian
    @Query("SELECT COALESCE(SUM(pt.points), 0) FROM PointTransaction pt " +
            "WHERE pt.user.id = :userId AND pt.type = 'EARN' " +
            "AND pt.createdAt BETWEEN :startDate AND :endDate")
    Integer sumEarnedPointsBetween(
            @Param("userId") String userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // Transactions theo reference
    boolean existsByReferenceTypeAndReferenceId(
            ReferenceType referenceType,
            String referenceId
    );
}
