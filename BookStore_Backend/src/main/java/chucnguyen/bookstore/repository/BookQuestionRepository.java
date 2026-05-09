package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.BookQuestion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookQuestionRepository extends JpaRepository<BookQuestion, String> {
    long countByUserId(String userId);

    // FIXED: Eager fetch User để tránh LazyInitializationException
    @Query("SELECT q FROM BookQuestion q LEFT JOIN FETCH q.user LEFT JOIN FETCH q.book WHERE q.book.id = :bookId ORDER BY q.createdAt DESC")
    Page<BookQuestion> findByBookIdOrderByCreatedAtDesc(@Param("bookId") String bookId, Pageable pageable);

    // FIXED: Eager fetch User để tránh LazyInitializationException
    @Query("SELECT q FROM BookQuestion q LEFT JOIN FETCH q.user LEFT JOIN FETCH q.book WHERE q.user.id = :userId ORDER BY q.createdAt DESC")
    Page<BookQuestion> findByUserIdOrderByCreatedAtDesc(@Param("userId") String userId, Pageable pageable);

    // FIXED: Eager fetch User
    @Query("SELECT q FROM BookQuestion q LEFT JOIN FETCH q.user LEFT JOIN FETCH q.book WHERE q.isAnswered = false ORDER BY q.createdAt DESC")
    Page<BookQuestion> findByIsAnsweredFalseOrderByCreatedAtDesc(Pageable pageable);

    // FIXED: Search với eager fetch
    @Query("SELECT q FROM BookQuestion q LEFT JOIN FETCH q.user LEFT JOIN FETCH q.book " +
            "WHERE q.book.id = :bookId AND LOWER(q.question) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<BookQuestion> searchQuestions(@Param("bookId") String bookId,
                                       @Param("keyword") String keyword,
                                       Pageable pageable);

    long countByBookId(String bookId);
    long countByIsAnsweredFalse();

    @Modifying
    @Query("UPDATE BookQuestion q SET q.answerCount = q.answerCount + 1, q.isAnswered = true " +
            "WHERE q.id = :questionId")
    void incrementAnswerCount(@Param("questionId") String questionId);
}