package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {

    // Lấy reviews của sách
    Page<Review> findByBookIdAndIsHiddenFalseOrderByCreatedAtDesc(String bookId, Pageable pageable);

    // Lấy reviews theo rating
    Page<Review> findByBookIdAndRatingAndIsHiddenFalseOrderByCreatedAtDesc(
            String bookId,
            Integer rating,
            Pageable pageable
    );

    // Lấy reviews có ảnh
    @Query("SELECT DISTINCT r FROM Review r " +
            "LEFT JOIN ReviewImage ri ON ri.review.id = r.id " +
            "WHERE r.book.id = :bookId AND r.isHidden = false AND ri.id IS NOT NULL " +
            "ORDER BY r.createdAt DESC")
    Page<Review> findReviewsWithImages(@Param("bookId") String bookId, Pageable pageable);

    // Lấy reviews của user
    Page<Review> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    // Check user đã review sách này trong order này chưa
    @Query("""
        SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END 
        FROM Review r 
        WHERE r.user.id = :userId 
        AND r.book.id = :bookId 
        AND r.order.id = :orderId
        """)
    boolean existsByUserIdAndBookIdAndOrderId(
            @Param("userId") String userId,
            @Param("bookId") String bookId,
            @Param("orderId") String orderId
    );

    // Tìm review cụ thể
    Optional<Review> findByUserIdAndBookIdAndOrderId(String userId, String bookId, String orderId);

    // Tính average rating của sách
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.book.id = :bookId AND r.isHidden = false")
    BigDecimal calculateAverageRating(@Param("bookId") String bookId);

    // Đếm reviews theo rating
    @Query("SELECT r.rating, COUNT(r) FROM Review r " +
            "WHERE r.book.id = :bookId AND r.isHidden = false " +
            "GROUP BY r.rating ORDER BY r.rating DESC")
    List<Object[]> countReviewsByRating(@Param("bookId") String bookId);

    // Top helpful reviews
    @Query("SELECT r FROM Review r WHERE r.book.id = :bookId AND r.isHidden = false " +
            "ORDER BY r.helpfulCount DESC")
    Page<Review> findTopHelpfulReviews(@Param("bookId") String bookId, Pageable pageable);

    // Reviews pending approval
    Page<Review> findByIsApprovedFalseOrderByCreatedAtDesc(Pageable pageable);

    // Đếm số reviews của sách
    long countByBookIdAndIsHiddenFalse(String bookId);

    // Tăng helpful count (atomic)
    @Modifying
    @Query("UPDATE Review r SET r.helpfulCount = r.helpfulCount + 1 WHERE r.id = :reviewId")
    void incrementHelpfulCount(@Param("reviewId") String reviewId);

    // Giảm helpful count (atomic)
    @Modifying
    @Query("UPDATE Review r SET r.helpfulCount = r.helpfulCount - 1 WHERE r.id = :reviewId AND r.helpfulCount > 0")
    void decrementHelpfulCount(@Param("reviewId") String reviewId);

    // Tăng unhelpful count (atomic)
    @Modifying
    @Query("UPDATE Review r SET r.unhelpfulCount = r.unhelpfulCount + 1 WHERE r.id = :reviewId")
    void incrementUnhelpfulCount(@Param("reviewId") String reviewId);

    // Giảm unhelpful count (atomic)
    @Modifying
    @Query("UPDATE Review r SET r.unhelpfulCount = r.unhelpfulCount - 1 WHERE r.id = :reviewId AND r.unhelpfulCount > 0")
    void decrementUnhelpfulCount(@Param("reviewId") String reviewId);

    Long countByUserId(String id);


    /**
     * Get top helpful reviews from ALL books (for homepage testimonials)
     */
    @Query("""
    SELECT DISTINCT r FROM Review r
    LEFT JOIN FETCH r.book
    LEFT JOIN FETCH r.user
    WHERE r.isApproved = true
    AND r.isHidden = false
    AND r.rating >= 4
    ORDER BY r.helpfulCount DESC, r.createdAt DESC
    """)
    Page<Review> findGlobalTopHelpfulReviews(Pageable pageable);

    /**
     * Get featured reviews from ALL books (for testimonials)
     * Prioritizes reviews with high helpful count
     */
    @Query("""
    SELECT DISTINCT r FROM Review r
    LEFT JOIN FETCH r.book
    LEFT JOIN FETCH r.user
    WHERE r.isApproved = true
    AND r.isHidden = false
    AND r.rating >= 4
    AND r.helpfulCount > 0
    ORDER BY r.helpfulCount DESC, r.createdAt DESC
    """)
    Page<Review> findGlobalFeaturedReviewsWithImages(Pageable pageable);

    /**
     * Get recent high-rated reviews from ALL books
     */
    @Query("""
    SELECT DISTINCT r FROM Review r
    LEFT JOIN FETCH r.book
    LEFT JOIN FETCH r.user
    WHERE r.isApproved = true
    AND r.isHidden = false
    AND r.rating >= 4
    ORDER BY r.createdAt DESC
    """)
    Page<Review> findGlobalRecentHighRatedReviews(Pageable pageable);
}
