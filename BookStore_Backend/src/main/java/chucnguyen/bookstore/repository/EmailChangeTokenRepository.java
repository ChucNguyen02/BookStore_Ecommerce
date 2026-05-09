package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.EmailChangeToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface EmailChangeTokenRepository extends JpaRepository<EmailChangeToken, String> {

    Optional<EmailChangeToken> findByToken(String token);

    Optional<EmailChangeToken> findByUserIdAndUsedFalse(String userId);

    @Modifying
    @Query("DELETE FROM EmailChangeToken t WHERE t.expiryDate < :now")
    void deleteExpiredTokens(LocalDateTime now);

    @Modifying
    @Query("DELETE FROM EmailChangeToken t WHERE t.user.id = :userId")
    void deleteByUserId(String userId);
}