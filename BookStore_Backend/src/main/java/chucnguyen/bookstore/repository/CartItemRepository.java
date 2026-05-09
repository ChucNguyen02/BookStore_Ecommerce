package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, String> {

    // Lấy giỏ hàng của user
    List<CartItem> findByUserIdOrderByCreatedAtDesc(String userId);

    // Tìm item cụ thể trong giỏ
    Optional<CartItem> findByUserIdAndBookId(String userId, String bookId);

    // Check sách đã có trong giỏ chưa
    boolean existsByUserIdAndBookId(String userId, String bookId);

    // Đếm số items trong giỏ
    long countByUserId(String userId);

    // Tính tổng giá trị giỏ hàng
    @Query("SELECT COALESCE(SUM(CASE WHEN b.discountPrice IS NOT NULL " +
            "THEN b.discountPrice * ci.quantity ELSE b.price * ci.quantity END), 0) " +
            "FROM CartItem ci JOIN ci.book b WHERE ci.user.id = :userId")
    BigDecimal calculateCartTotal(@Param("userId") String userId);

    // Xóa tất cả items trong giỏ
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.user.id = :userId")
    void clearCart(@Param("userId") String userId);

    // Xóa items của sách không còn active
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.book.isActive = false")
    void removeInactiveBookItems();

    // Xóa items của sách hết stock
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.book.stockQuantity = 0")
    void removeOutOfStockItems();

    // ==================== THÊM MỚI CHO SELECTIVE CHECKOUT ====================

    /**
     * Lấy nhiều cart items theo danh sách IDs
     * Method này có sẵn từ JpaRepository nhưng khai báo rõ ràng để dễ sử dụng
     */
    @Query("SELECT ci FROM CartItem ci WHERE ci.id IN :ids")
    List<CartItem> findAllByIds(@Param("ids") List<String> ids);

    /**
     * Xóa nhiều cart items theo danh sách IDs
     * Dùng cho việc xóa chỉ các items đã checkout
     */
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.id IN :ids")
    void deleteAllByIds(@Param("ids") List<String> ids);

    /**
     * Verify ownership: Check xem tất cả cart items có thuộc về user không
     * Trả về số lượng items thuộc về user
     */
    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.id IN :ids AND ci.user.id = :userId")
    long countByIdsAndUserId(@Param("ids") List<String> ids, @Param("userId") String userId);
}