package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.ReviewReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewReplyRepository extends JpaRepository<ReviewReply, String> {

    // Lấy replies của review
    List<ReviewReply> findByReviewIdOrderByCreatedAtAsc(String reviewId);

    // Check đã có reply từ seller chưa
    @Query("SELECT COUNT(rr) > 0 FROM ReviewReply rr JOIN rr.user u " +
            "WHERE rr.review.id = :reviewId AND u.role = 'ADMIN'")
    boolean hasSellerReply(@Param("reviewId") String reviewId);

    // Xóa tất cả replies của review
    @Modifying
    @Query("DELETE FROM ReviewReply rr WHERE rr.review.id = :reviewId")
    void deleteByReviewId(@Param("reviewId") String reviewId);
}
