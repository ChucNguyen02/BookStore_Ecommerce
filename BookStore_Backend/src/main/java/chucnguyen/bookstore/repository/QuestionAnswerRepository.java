package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.QuestionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionAnswerRepository extends JpaRepository<QuestionAnswer, String> {

    long countByUserId(String userId);

    // FIXED: Eager fetch User để tránh LazyInitializationException
    @Query("SELECT qa FROM QuestionAnswer qa LEFT JOIN FETCH qa.user WHERE qa.question.id = :questionId ORDER BY qa.createdAt ASC")
    List<QuestionAnswer> findByQuestionIdOrderByCreatedAtAsc(@Param("questionId") String questionId);

    // FIXED: Eager fetch User
    @Query("SELECT qa FROM QuestionAnswer qa LEFT JOIN FETCH qa.user " +
            "WHERE qa.question.id = :questionId AND qa.isSellerAnswer = true")
    Optional<QuestionAnswer> findSellerAnswer(@Param("questionId") String questionId);

    boolean existsByQuestionIdAndIsSellerAnswerTrue(String questionId);

    @Modifying
    @Query("DELETE FROM QuestionAnswer qa WHERE qa.question.id = :questionId")
    void deleteByQuestionId(@Param("questionId") String questionId);

    long countByQuestionId(String questionId);
}