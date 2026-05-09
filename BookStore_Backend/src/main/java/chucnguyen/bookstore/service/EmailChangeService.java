package chucnguyen.bookstore.service;

import chucnguyen.bookstore.entity.EmailChangeToken;
import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.entity.enums.AuthProvider;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.repository.EmailChangeTokenRepository;
import chucnguyen.bookstore.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailChangeService {

    private final UserRepository userRepository;
    private final EmailChangeTokenRepository emailChangeTokenRepository;
    private final EmailService emailService;

    private static final int TOKEN_EXPIRY_HOURS = 24;

    /**
     * Request email change - Only for LOCAL users who haven't verified their email
     */
    @Transactional
    public void requestEmailChange(String currentEmail, String newEmail) {
        log.info("Email change request from {} to {}", currentEmail, newEmail);

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));


        if (!user.hasAuthProvider(AuthProvider.LOCAL)) {
            throw new AppException(ErrorCode.INVALID_REQUEST,
                    "Only local account users can change email");
        }


        if (user.getEmailVerified()) {
            throw new AppException(ErrorCode.INVALID_REQUEST,
                    "Cannot change email after verification");
        }

        // Validation 3: New email must be different
        if (currentEmail.equalsIgnoreCase(newEmail)) {
            throw new AppException(ErrorCode.INVALID_INPUT,
                    "New email must be different from current email");
        }

        // Validation 4: New email must not be taken
        if (userRepository.existsByEmail(newEmail)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // Delete any existing tokens for this user
        emailChangeTokenRepository.deleteByUserId(user.getId());

        // Create new token
        String token = UUID.randomUUID().toString();
        EmailChangeToken emailChangeToken = EmailChangeToken.builder()
                .user(user)
                .token(token)
                .newEmail(newEmail)
                .expiryDate(LocalDateTime.now().plusHours(TOKEN_EXPIRY_HOURS))
                .used(false)
                .build();

        emailChangeTokenRepository.save(emailChangeToken);

        // Send verification email to NEW email
        try {
            emailService.sendEmailChangeVerification(newEmail, user.getFullName(), token);
            log.info("Email change verification sent to {}", newEmail);
        } catch (Exception e) {
            log.error("Failed to send email change verification", e);
            throw new AppException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }

    /**
     * Verify and complete email change
     */
    @Transactional
    public void verifyEmailChange(String token) {
        log.info("Verifying email change token: {}", token);

        // Find token
        EmailChangeToken emailChangeToken = emailChangeTokenRepository.findByToken(token)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_TOKEN));

        // Check if token is expired
        if (emailChangeToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.TOKEN_EXPIRED);
        }

        // Check if token is already used
        if (emailChangeToken.getUsed()) {
            throw new AppException(ErrorCode.TOKEN_ALREADY_USED);
        }

        // Get user
        User user = emailChangeToken.getUser();

        // Final validation: new email must still be available
        String newEmail = emailChangeToken.getNewEmail();
        if (userRepository.existsByEmail(newEmail)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // Update user email and mark as verified
        user.setEmail(newEmail);
        user.setEmailVerified(true);
        userRepository.save(user);

        // Mark token as used
        emailChangeToken.setUsed(true);
        emailChangeTokenRepository.save(emailChangeToken);

        log.info("Email changed successfully to {}", newEmail);

        // Send confirmation to new email
        try {
            emailService.sendEmailChangeConfirmation(newEmail, user.getFullName());
        } catch (Exception e) {
            log.error("Failed to send email change confirmation", e);
        }
    }

    /**
     * Validate email change token
     */
    public boolean validateToken(String token) {
        return emailChangeTokenRepository.findByToken(token)
                .map(t -> !t.getUsed() && t.getExpiryDate().isAfter(LocalDateTime.now()))
                .orElse(false);
    }

    /**
     * Clean up expired tokens (scheduled task)
     */
    @Transactional
    public void cleanupExpiredTokens() {
        emailChangeTokenRepository.deleteExpiredTokens(LocalDateTime.now());
        log.info("Expired email change tokens cleaned up");
    }
}