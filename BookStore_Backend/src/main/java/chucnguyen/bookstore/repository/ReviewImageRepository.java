package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.ReviewImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewImageRepository extends JpaRepository<ReviewImage, String> {

    // Lấy tất cả ảnh của review
    List<ReviewImage> findByReviewIdOrderByDisplayOrderAsc(String reviewId);

    // Xóa tất cả ảnh của review
    @Modifying
    @Query("DELETE FROM ReviewImage ri WHERE ri.review.id = :reviewId")
    void deleteByReviewId(@Param("reviewId") String reviewId);

    // Đếm số ảnh của review
    long countByReviewId(String reviewId);
}
