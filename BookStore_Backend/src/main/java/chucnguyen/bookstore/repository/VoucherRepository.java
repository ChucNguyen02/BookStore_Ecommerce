package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, String> {

    // Tìm voucher theo code
    Optional<Voucher> findByCode(String code);

    // Tìm voucher active
    @Query("SELECT v FROM Voucher v WHERE " +
            "v.isActive = true " +
            "AND v.startDate <= CURRENT_TIMESTAMP " +
            "AND v.endDate >= CURRENT_TIMESTAMP " +
            "AND (v.usageLimit IS NULL OR v.usedCount < v.usageLimit) " +
            "AND v.user IS NULL " +
            "ORDER BY v.createdAt DESC")
    List<Voucher> findAvailableVouchers();

    // Tìm voucher cho user cụ thể
    @Query("SELECT v FROM Voucher v WHERE " +
            "v.isActive = true " +
            "AND v.startDate <= CURRENT_TIMESTAMP " +
            "AND v.endDate >= CURRENT_TIMESTAMP " +
            "AND (v.usageLimit IS NULL OR v.usedCount < v.usageLimit) " +
            "AND (v.user IS NULL OR v.user.id = :userId) " +
            "ORDER BY v.createdAt DESC")
    List<Voucher> findAvailableVouchersForUser(@Param("userId") String userId);

    // Check voucher còn sử dụng được không
    @Query("SELECT CASE WHEN COUNT(v) > 0 THEN true ELSE false END FROM Voucher v WHERE " +
            "v.code = :code " +
            "AND v.isActive = true " +
            "AND v.startDate <= CURRENT_TIMESTAMP " +
            "AND v.endDate >= CURRENT_TIMESTAMP " +
            "AND (v.usageLimit IS NULL OR v.usedCount < v.usageLimit)")
    boolean isVoucherValid(@Param("code") String code);

    // Tăng usage count (atomic)
    @Modifying
    @Query("UPDATE Voucher v SET v.usedCount = v.usedCount + 1 WHERE v.id = :voucherId")
    void incrementUsedCount(@Param("voucherId") String voucherId);

    // Giảm usage count (khi cancel order)
    @Modifying
    @Query("UPDATE Voucher v SET v.usedCount = v.usedCount - 1 WHERE v.id = :voucherId AND v.usedCount > 0")
    void decrementUsedCount(@Param("voucherId") String voucherId);

    // Voucher sắp hết hạn
    @Query("SELECT v FROM Voucher v WHERE " +
            "v.isActive = true " +
            "AND v.endDate <= :endDate " +
            "AND v.endDate >= CURRENT_TIMESTAMP " +
            "ORDER BY v.endDate ASC")
    List<Voucher> findExpiringVouchers(@Param("endDate") LocalDateTime endDate);

    @Query("SELECT v FROM Voucher v WHERE v.endDate < CURRENT_TIMESTAMP AND v.isActive = true")
    List<Voucher> findExpiredActiveVouchers();
}
