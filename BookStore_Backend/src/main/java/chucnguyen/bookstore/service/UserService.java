package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.request.UpdateProfileRequest;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.dto.response.UserProfileResponse;
import chucnguyen.bookstore.dto.response.UserResponse;
import chucnguyen.bookstore.entity.EmailVerificationToken;
import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.entity.UserPoints;
import chucnguyen.bookstore.entity.enums.AuthProvider;
import chucnguyen.bookstore.entity.enums.OrderStatus;
import chucnguyen.bookstore.entity.enums.Role;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.UserMapper;
import chucnguyen.bookstore.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserPointsRepository userPointsRepository;
    private final UserMapper userMapper;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final DailyCheckInRepository dailyCheckInRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final EmailService emailService;
    private final BookQuestionRepository bookQuestionRepository;
    private final FileUploadService fileUploadService;

    @Cacheable(value = "users", key = "'profile_' + #email")
    public UserProfileResponse getUserProfile(String email) {
        log.info("Getting profile for user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserProfileResponse profile = userMapper.toUserProfileResponse(user);

        // Get points info
        UserPoints userPoints = userPointsRepository.findByUserId(user.getId())
                .orElse(null);

        if (userPoints != null) {
            profile.setTotalPoints(userPoints.getTotalPoints());
            profile.setLifetimePoints(userPoints.getLifetimePoints());
            profile.setTier(userPoints.getTier().name());
        }

        // Get statistics
        profile.setTotalOrders(orderRepository.countByUserId(user.getId()));
        profile.setTotalReviews(reviewRepository.countByUserId(user.getId()));
        profile.setTotalQuestions(bookQuestionRepository.countByUserId(user.getId()));

        // Get check-in streak
        dailyCheckInRepository.findLatestCheckInByUserId(user.getId())
                .ifPresent(checkIn -> profile.setConsecutiveCheckInDays(checkIn.getConsecutiveDays()));

        return profile;
    }

    /**
     * Delete old avatar asynchronously (non-blocking)
     */
    @Async("taskExecutor")
    public void deleteOldAvatarAsync(String avatarUrl) {
        if (avatarUrl == null || avatarUrl.trim().isEmpty()) {
            return;
        }

        try {
            log.info("Deleting old avatar asynchronously: {}", avatarUrl);
            fileUploadService.deleteImage(avatarUrl);
            log.info("Old avatar deleted successfully: {}", avatarUrl);
        } catch (Exception e) {
            log.error("Failed to delete old avatar: {}", avatarUrl, e);
            // Don't throw - this is async and non-critical
        }
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        log.info("Updating profile for user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Save old avatar URL before updating
        String oldAvatarUrl = user.getAvatarUrl();

        // Update fields
        userMapper.updateUserFromRequest(request, user);
        user = userRepository.save(user);

        log.info("Profile updated successfully for user: {}", email);

        // Delete old avatar asynchronously if new avatar is different
        if (request.getAvatarUrl() != null && oldAvatarUrl != null
                && !oldAvatarUrl.equals(request.getAvatarUrl())) {
            deleteOldAvatarAsync(oldAvatarUrl);
        }

        return userMapper.toUserResponse(user);
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public void deleteAccount(String email) {
        log.info("Attempting to delete account for user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<OrderStatus> pendingStatuses = Arrays.asList(
                OrderStatus.PENDING,
                OrderStatus.CONFIRMED,
                OrderStatus.SHIPPING,
                OrderStatus.PAYMENT_PENDING
        );

        long pendingOrdersCount = orderRepository.countByUserIdAndStatusIn(
                user.getId(),
                pendingStatuses
        );

        if (pendingOrdersCount > 0) {
            String message = String.format(
                    "Cannot delete account. You have %d pending order(s). " +
                            "Please wait until all orders are completed or cancelled.",
                    pendingOrdersCount
            );

            log.warn("Cannot delete account for user {}: {}", email, message);
            throw new AppException(ErrorCode.CANNOT_DELETE_ACCOUNT_WITH_PENDING_ORDERS, message);
        }

        String originalEmail = user.getEmail();
        String avatarUrl = user.getAvatarUrl();

        user.setIsActive(false);
        user.setEmail(originalEmail + "_deleted_" + System.currentTimeMillis());
        userRepository.save(user);

        log.info("Account soft-deleted successfully for user: {}", originalEmail);

        // Delete avatar asynchronously
        if (avatarUrl != null) {
            deleteOldAvatarAsync(avatarUrl);
        }

        // Send confirmation email
        try {
            emailService.sendAccountDeletionConfirmation(originalEmail, user.getFullName());
        } catch (Exception e) {
            log.error("Failed to send account deletion confirmation email to: {}", originalEmail, e);
        }
    }

    @Cacheable(value = "users", key = "'search_' + #keyword + '_' + #page + '_' + #size")
    public PageResponse<UserResponse> searchUsers(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.searchUsers(keyword, pageable);
        Page<UserResponse> responsePage = users.map(userMapper::toUserResponse);
        return PageResponse.from(responsePage);
    }

    public long countNewUsers(LocalDateTime startDate, LocalDateTime endDate) {
        return userRepository.countNewUsers(startDate, endDate);
    }

    @Cacheable(value = "users", key = "'email_provider_' + #email + '_' + #authProvider")
    public UserResponse getUserByEmailAndProvider(String email, AuthProvider authProvider) {
        User user = userRepository.findByEmailAndAuthProvider(email, authProvider)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    @Cacheable(value = "users", key = "'provider_id_' + #providerId")
    public UserResponse getUserByProviderId(String providerId) {
        User user = userRepository.findByProviderId(providerId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    @Cacheable(value = "users", key = "'active'")
    public List<UserResponse> getActiveUsers() {
        List<User> users = userRepository.findByIsActiveTrue();
        return userMapper.toUserResponseList(users);
    }

    @Cacheable(value = "users", key = "'role_' + #role")
    public List<UserResponse> getUsersByRole(Role role) {
        List<User> users = userRepository.findByRole(role);
        return userMapper.toUserResponseList(users);
    }

    @Cacheable(value = "users", key = "'count_role_' + #role")
    public long countUsersByRole(Role role) {
        return userRepository.countByRole(role);
    }

    @Transactional
    public void sendVerificationEmail(String email) {
        log.info("Sending verification email to: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!user.hasAuthProvider(AuthProvider.LOCAL)) {
            throw new AppException(ErrorCode.INVALID_REQUEST,
                    "Only local account users can verify email. Your account was created with "
                            + user.getPrimaryAuthProvider().name());
        }

        if (user.getEmailVerified()) {
            throw new AppException(ErrorCode.INVALID_REQUEST,
                    "Email is already verified");
        }

        emailVerificationTokenRepository.deleteByUserId(user.getId());

        String token = UUID.randomUUID().toString();

        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .user(user)
                .token(token)
                .expiryDate(LocalDateTime.now().plusHours(24))
                .used(false)
                .build();

        emailVerificationTokenRepository.save(verificationToken);

        try {
            emailService.sendEmailVerification(user.getEmail(), user.getFullName(), token);
            log.info("Verification email sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send verification email", e);
            throw new AppException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public void verifyEmail(String token) {
        log.info("Verifying email with token: {}", token);

        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_TOKEN));

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.TOKEN_EXPIRED);
        }

        if (verificationToken.getUsed()) {
            throw new AppException(ErrorCode.TOKEN_ALREADY_USED);
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        verificationToken.setUsed(true);
        emailVerificationTokenRepository.save(verificationToken);

        log.info("Email verified successfully for user: {}", user.getEmail());
    }

    public boolean validateVerificationToken(String token) {
        return emailVerificationTokenRepository.findByToken(token)
                .map(t -> !t.getUsed() && t.getExpiryDate().isAfter(LocalDateTime.now()))
                .orElse(false);
    }
}