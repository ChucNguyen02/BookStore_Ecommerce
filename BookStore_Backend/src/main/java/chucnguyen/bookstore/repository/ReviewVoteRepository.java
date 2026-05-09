package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.ReviewVote;
import chucnguyen.bookstore.entity.enums.VoteType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewVoteRepository extends JpaRepository<ReviewVote, String> {

    // Tìm vote của user cho review
    Optional<ReviewVote> findByReviewIdAndUserId(String reviewId, String userId);

    // Check user đã vote chưa
    boolean existsByReviewIdAndUserId(String reviewId, String userId);

    // Xóa vote
    @Modifying
    @Query("DELETE FROM ReviewVote rv WHERE rv.review.id = :reviewId AND rv.user.id = :userId")
    void deleteByReviewIdAndUserId(@Param("reviewId") String reviewId, @Param("userId") String userId);

    // Đếm helpful votes
    long countByReviewIdAndVote(String reviewId, VoteType vote);
}
