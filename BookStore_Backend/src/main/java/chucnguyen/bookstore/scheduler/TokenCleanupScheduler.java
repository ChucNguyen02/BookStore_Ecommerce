package chucnguyen.bookstore.scheduler;

import chucnguyen.bookstore.repository.EmailChangeTokenRepository;
import chucnguyen.bookstore.repository.EmailVerificationTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class TokenCleanupScheduler {

    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final EmailChangeTokenRepository emailChangeTokenRepository;

    /**
     * Clean up expired email verification tokens
     * Runs every day at 2:00 AM
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void cleanupExpiredVerificationTokens() {
        log.info("Starting cleanup of expired email verification tokens");

        try {
            LocalDateTime now = LocalDateTime.now();
            emailVerificationTokenRepository.deleteExpiredTokens(now);
            log.info("Successfully cleaned up expired email verification tokens");
        } catch (Exception e) {
            log.error("Error cleaning up expired email verification tokens", e);
        }
    }

    /**
     * Clean up expired email change tokens
     * Runs every day at 2:00 AM
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void cleanupExpiredEmailChangeTokens() {
        log.info("Starting cleanup of expired email change tokens");

        try {
            LocalDateTime now = LocalDateTime.now();
            emailChangeTokenRepository.deleteExpiredTokens(now);
            log.info("Successfully cleaned up expired email change tokens");
        } catch (Exception e) {
            log.error("Error cleaning up expired email change tokens", e);
        }
    }

    /**
     * Alternative: Clean up every 6 hours
     * Uncomment if you want more frequent cleanup
     */
    // @Scheduled(fixedRate = 21600000) // 6 hours in milliseconds
    // @Transactional
    // public void cleanupExpiredTokensFrequent() {
    //     log.info("Starting frequent cleanup of expired tokens");
    //     LocalDateTime now = LocalDateTime.now();
    //     emailVerificationTokenRepository.deleteExpiredTokens(now);
    //     emailChangeTokenRepository.deleteExpiredTokens(now);
    //     log.info("Frequent cleanup completed");
    // }
}