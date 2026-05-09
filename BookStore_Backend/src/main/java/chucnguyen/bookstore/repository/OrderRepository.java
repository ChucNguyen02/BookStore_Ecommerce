package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.Order;
import chucnguyen.bookstore.entity.enums.OrderStatus;
import chucnguyen.bookstore.entity.enums.PaymentMethod;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    Optional<Order> findByOrderCode(String orderCode);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.orderCode = :orderCode")
    Optional<Order> findByOrderCodeWithLock(@Param("orderCode") String orderCode);

    @Query("SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.user " +
            "LEFT JOIN FETCH o.orderItems oi " +
            "LEFT JOIN FETCH oi.book " +
            "LEFT JOIN FETCH o.voucher " +
            "WHERE o.orderCode = :orderCode")
    Optional<Order> findByOrderCodeWithDetails(@Param("orderCode") String orderCode);


    @Query("SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.orderItems oi " +
            "LEFT JOIN FETCH oi.book " +
            "WHERE o.user.id = :userId " +
            "ORDER BY o.createdAt DESC")
    Page<Order> findByUserIdOrderByCreatedAtDesc(
            @Param("userId") String userId,
            Pageable pageable);

    @Query("SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.orderItems oi " +
            "LEFT JOIN FETCH oi.book " +
            "WHERE o.user.id = :userId AND o.status = :status " +
            "ORDER BY o.createdAt DESC")
    Page<Order> findByUserIdAndStatusOrderByCreatedAtDesc(
            @Param("userId") String userId,
            @Param("status") OrderStatus status,
            Pageable pageable);


    @Query("SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.orderItems oi " +
            "LEFT JOIN FETCH oi.book " +
            "WHERE o.status = :status " +
            "ORDER BY o.createdAt DESC")
    Page<Order> findByStatusOrderByCreatedAtDesc(
            @Param("status") OrderStatus status,
            Pageable pageable);


    @Query("SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.orderItems oi " +
            "LEFT JOIN FETCH oi.book " +
            "WHERE o.createdAt BETWEEN :startDate AND :endDate " +
            "ORDER BY o.createdAt DESC")
    Page<Order> findOrdersBetweenDates(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o " +
            "WHERE o.status = 'DELIVERED' " +
            "AND o.deliveredAt BETWEEN :startDate AND :endDate")
    BigDecimal calculateRevenueBetweenDates(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    long countByStatus(OrderStatus status);

    long countByUserId(String userId);

    @Query("SELECT o FROM Order o WHERE o.status = 'DELIVERED' " +
            "AND o.deliveredAt <= :beforeDate")
    List<Order> findOrdersToAutoComplete(@Param("beforeDate") LocalDateTime beforeDate);

    @Query("SELECT o FROM Order o WHERE o.status = 'PENDING' " +
            "AND o.createdAt <= :beforeDate")
    List<Order> findExpiredPendingOrders(@Param("beforeDate") LocalDateTime beforeDate);

    @Query("SELECT o FROM Order o " +
            "LEFT JOIN FETCH o.voucher " +
            "LEFT JOIN FETCH o.orderItems oi " +
            "LEFT JOIN FETCH oi.book " +
            "WHERE o.status = 'PAYMENT_PENDING' " +
            "AND o.updatedAt <= :beforeDate")
    List<Order> findExpiredPaymentPendingOrders(@Param("beforeDate") LocalDateTime beforeDate);

    @Query("SELECT o.user, SUM(o.totalAmount) as totalSpent FROM Order o " +
            "WHERE o.status = 'DELIVERED' " +
            "GROUP BY o.user ORDER BY totalSpent DESC")
    Page<Object[]> findTopCustomers(Pageable pageable);

    @Query("SELECT DATE(o.createdAt), COUNT(o) FROM Order o " +
            "WHERE o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY DATE(o.createdAt) ORDER BY DATE(o.createdAt)")
    List<Object[]> getOrderStatsByDate(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT CASE WHEN COUNT(oi) > 0 THEN true ELSE false END " +
            "FROM Order o JOIN o.orderItems oi " +
            "WHERE o.user.id = :userId AND oi.book.id = :bookId " +
            "AND o.status = 'DELIVERED'")
    boolean hasUserPurchasedBook(@Param("userId") String userId, @Param("bookId") String bookId);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.orderItems oi " +
            "WHERE o.user.id = :userId AND oi.book.id = :bookId " +
            "AND o.status = 'DELIVERED' ORDER BY o.deliveredAt DESC")
    List<Order> findUserOrdersWithBook(@Param("userId") String userId, @Param("bookId") String bookId);

    @Query("""
        SELECT DISTINCT o FROM Order o
        JOIN o.orderItems oi
        WHERE o.user.id = :userId
        AND oi.book.id = :bookId
        AND o.status = :status
        """)
    List<Order> findUserOrdersWithBookAndStatus(
            @Param("userId") String userId,
            @Param("bookId") String bookId,
            @Param("status") OrderStatus status);

    @Query("""
        SELECT COUNT(o) > 0 FROM Order o
        JOIN o.orderItems oi
        WHERE o.user.id = :userId
        AND oi.book.id = :bookId
        AND o.status = :status
        """)
    boolean existsUserOrderWithBookAndStatus(
            @Param("userId") String userId,
            @Param("bookId") String bookId,
            @Param("status") OrderStatus status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId AND o.status IN :statuses")
    long countByUserIdAndStatusIn(
            @Param("userId") String userId,
            @Param("statuses") List<OrderStatus> statuses);

    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.status IN :statuses")
    List<Order> findPendingOrdersByUserId(
            @Param("userId") String userId,
            @Param("statuses") List<OrderStatus> statuses);

    @Query("""
    SELECT DISTINCT o FROM Order o
    LEFT JOIN FETCH o.orderItems oi
    LEFT JOIN FETCH oi.book
    ORDER BY o.createdAt DESC
    """)
    Page<Order> findAllOrders(Pageable pageable);

    @Query("""
    SELECT DISTINCT o FROM Order o
    LEFT JOIN FETCH o.orderItems oi
    LEFT JOIN FETCH oi.book
    WHERE LOWER(o.orderCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
    OR LOWER(o.shippingName) LIKE LOWER(CONCAT('%', :keyword, '%'))
    OR LOWER(o.shippingPhone) LIKE LOWER(CONCAT('%', :keyword, '%'))
    OR LOWER(o.shippingAddress) LIKE LOWER(CONCAT('%', :keyword, '%'))
    ORDER BY o.createdAt DESC
    """)
    Page<Order> searchOrders(@Param("keyword") String keyword, Pageable pageable);

    @Query("""
    SELECT DISTINCT o FROM Order o
    LEFT JOIN FETCH o.orderItems oi
    LEFT JOIN FETCH oi.book
    WHERE LOWER(o.shippingPhone) = LOWER(:phone)
    ORDER BY o.createdAt DESC
    """)
    Page<Order> findByShippingPhone(@Param("phone") String phone, Pageable pageable);

    @Query("""
    SELECT DISTINCT o FROM Order o
    LEFT JOIN FETCH o.orderItems oi
    LEFT JOIN FETCH oi.book
    WHERE LOWER(o.user.email) = LOWER(:email)
    ORDER BY o.createdAt DESC
    """)
    Page<Order> findByUserEmail(@Param("email") String email, Pageable pageable);

    @Query("""
    SELECT DISTINCT o FROM Order o
    LEFT JOIN FETCH o.orderItems oi
    LEFT JOIN FETCH oi.book
    WHERE o.paymentMethod = :paymentMethod
    ORDER BY o.createdAt DESC
    """)
    Page<Order> findByPaymentMethod(
            @Param("paymentMethod") PaymentMethod paymentMethod,
            Pageable pageable);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED'")
    BigDecimal calculateTotalRevenue();



    @Query("SELECT MIN(o.createdAt) FROM Order o WHERE o.user.id = :userId AND o.status = 'DELIVERED'")
    LocalDateTime findFirstOrderDateByUserId(@Param("userId") String userId);

    // Get user's last order date
    @Query("SELECT MAX(o.createdAt) FROM Order o WHERE o.user.id = :userId AND o.status = 'DELIVERED'")
    LocalDateTime findLastOrderDateByUserId(@Param("userId") String userId);

    // Get total spent by user
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.user.id = :userId AND o.status = 'DELIVERED'")
    BigDecimal calculateTotalSpentByUser(@Param("userId") String userId);

    // Get orders count by status for user
    @Query("""
    SELECT o.status, COUNT(o) 
    FROM Order o 
    WHERE o.user.id = :userId 
    GROUP BY o.status
    """)
    List<Object[]> countOrdersByStatusForUser(@Param("userId") String userId);

    // Get monthly spending for user
    @Query("""
    SELECT 
        YEAR(o.deliveredAt) as year,
        MONTH(o.deliveredAt) as month,
        SUM(o.totalAmount) as totalSpent,
        COUNT(o) as orderCount
    FROM Order o
    WHERE o.user.id = :userId 
    AND o.status = 'DELIVERED'
    AND o.deliveredAt >= :startDate
    GROUP BY YEAR(o.deliveredAt), MONTH(o.deliveredAt)
    ORDER BY year DESC, month DESC
    """)
    List<Object[]> getMonthlySpendingByUser(
            @Param("userId") String userId,
            @Param("startDate") LocalDateTime startDate
    );

    // Get top categories by spending for user
    @Query("""
    SELECT 
        b.category.id,
        b.category.name,
        SUM(oi.subtotal) as totalSpent,
        SUM(oi.quantity) as bookCount
    FROM Order o
    JOIN o.orderItems oi
    JOIN oi.book b
    WHERE o.user.id = :userId 
    AND o.status = 'DELIVERED'
    GROUP BY b.category.id, b.category.name
    ORDER BY totalSpent DESC
    """)
    List<Object[]> getTopCategoriesByUser(@Param("userId") String userId, Pageable pageable);

    // Get total books purchased by user
    @Query("""
    SELECT COALESCE(SUM(oi.quantity), 0) 
    FROM Order o 
    JOIN o.orderItems oi 
    WHERE o.user.id = :userId 
    AND o.status = 'DELIVERED'
    """)
    Integer getTotalBooksPurchasedByUser(@Param("userId") String userId);

    // Find recently delivered orders (for scheduled delivery confirmation emails)
    @Query("""
    SELECT o FROM Order o
    WHERE o.status = 'DELIVERED'
    AND o.deliveredAt BETWEEN :startDate AND :endDate
    ORDER BY o.deliveredAt DESC
    """)
    List<Order> findRecentlyDeliveredOrders(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}