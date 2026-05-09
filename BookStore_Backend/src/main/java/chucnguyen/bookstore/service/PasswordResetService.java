package chucnguyen.bookstore.service;

import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final PasswordEncoder passwordEncoder;

    private static final String RESET_TOKEN_PREFIX = "password_reset:";
    private static final long TOKEN_EXPIRY_MINUTES = 30;

    @Transactional
    public void sendPasswordResetEmail(String email) {
        log.info("Processing password reset request for: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Generate reset token
        String resetToken = UUID.randomUUID().toString();

        // Store token in Redis with expiry
        String redisKey = RESET_TOKEN_PREFIX + resetToken;
        redisTemplate.opsForValue().set(
                redisKey,
                user.getEmail(),
                TOKEN_EXPIRY_MINUTES,
                TimeUnit.MINUTES
        );

        // Send email
        emailService.sendPasswordResetEmail(user, resetToken);

        log.info("Password reset email sent to: {}", email);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        log.info("Processing password reset with token");

        // Verify token
        String redisKey = RESET_TOKEN_PREFIX + token;
        String email = (String) redisTemplate.opsForValue().get(redisKey);

        if (email == null) {
            throw new AppException(ErrorCode.TOKEN_INVALID,
                    "Reset token is invalid or has expired");
        }

        // Get user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Delete token
        redisTemplate.delete(redisKey);

        log.info("Password reset successful for: {}", email);
    }

    public boolean validateResetToken(String token) {
        String redisKey = RESET_TOKEN_PREFIX + token;
        String email = (String) redisTemplate.opsForValue().get(redisKey);
        return email != null;
    }
}