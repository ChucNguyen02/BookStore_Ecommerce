package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.ViewHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ViewHistoryRepository extends JpaRepository<ViewHistory, String> {


    @Query("SELECT vh FROM ViewHistory vh " +
            "JOIN FETCH vh.book b " +
            "LEFT JOIN FETCH b.category " +
            "LEFT JOIN FETCH b.authors " +
            "WHERE vh.user.id = :userId " +
            "ORDER BY vh.lastViewedAt DESC")
    Page<ViewHistory> findByUserIdOrderByLastViewedAtDesc(@Param("userId") String userId, Pageable pageable);

    // Tìm record cụ thể
    Optional<ViewHistory> findByUserIdAndBookId(String userId, String bookId);

    // Check đã xem chưa
    boolean existsByUserIdAndBookId(String userId, String bookId);

    // Update view count và last viewed time
    @Modifying
    @Query("UPDATE ViewHistory vh SET vh.viewCount = vh.viewCount + 1, " +
            "vh.lastViewedAt = CURRENT_TIMESTAMP WHERE vh.id = :id")
    void incrementViewCount(@Param("id") String id);


    @Query("SELECT vh FROM ViewHistory vh " +
            "JOIN FETCH vh.book b " +
            "LEFT JOIN FETCH b.category " +
            "LEFT JOIN FETCH b.authors " +
            "WHERE vh.user.id = :userId " +
            "ORDER BY vh.viewCount DESC")
    List<ViewHistory> findMostViewedBooks(@Param("userId") String userId, Pageable pageable);


    @Modifying
    @Query("DELETE FROM ViewHistory vh WHERE vh.lastViewedAt < :beforeDate")
    void deleteOldHistory(@Param("beforeDate") java.time.LocalDateTime beforeDate);
}