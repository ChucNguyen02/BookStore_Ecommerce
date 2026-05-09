package chucnguyen.bookstore.service;

import chucnguyen.bookstore.configuration.JwtUtils;
import chucnguyen.bookstore.dto.request.ChangePasswordRequest;
import chucnguyen.bookstore.dto.request.LoginRequest;
import chucnguyen.bookstore.dto.request.RegisterRequest;
import chucnguyen.bookstore.dto.request.SetPasswordRequest;
import chucnguyen.bookstore.dto.response.AuthResponse;
import chucnguyen.bookstore.dto.response.UserResponse;
import chucnguyen.bookstore.entity.EmailVerificationToken;
import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.entity.UserPoints;
import chucnguyen.bookstore.entity.enums.AuthProvider;
import chucnguyen.bookstore.entity.enums.Role;
import chucnguyen.bookstore.entity.enums.Tier;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.UserMapper;
import chucnguyen.bookstore.repository.EmailVerificationTokenRepository;
import chucnguyen.bookstore.repository.UserPointsRepository;
import chucnguyen.bookstore.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final UserPointsRepository userPointsRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user: {}", request.getEmail());

        // Check email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // Create user with LOCAL provider
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.addAuthProvider(AuthProvider.LOCAL);
        user.setEmailVerified(false);
        user = userRepository.save(user);

        // Initialize points
        UserPoints userPoints = UserPoints.builder()
                .user(user)
                .totalPoints(0)
                .lifetimePoints(0)
                .tier(Tier.BRONZE)
                .build();
        userPointsRepository.save(userPoints);

        // Send verification email
        sendVerificationEmailForNewUser(user);

        // Send welcome email
        try {
            emailService.sendWelcomeEmail(user);
        } catch (Exception e) {
            log.error("Error sending welcome email", e);
        }

        // Generate JWT
        String token = jwtUtils.generateToken(user.getEmail());
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail());

        log.info("User registered successfully: {}", user.getEmail());

        return AuthResponse.builder()
                .accessToken(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtils.getExpirationTime())
                .user(userMapper.toUserResponse(user))
                .role(user.getRole().name())
                .build();
    }


    public AuthResponse login(LoginRequest request) {
        log.info("User login attempt: {}", request.getEmail());

        // Find user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Check if user has password
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS,
                    "This account was created with Google. Please login with Google or set a password first.");
        }

        // Authenticate
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS, "Invalid email or password");
        }

        // Check if user is active
        if (!user.getIsActive()) {
            throw new AppException(ErrorCode.USER_INACTIVE);
        }

        // Generate token
        String token = jwtUtils.generateToken(user.getEmail());
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail());

        log.info("User logged in successfully: {}", user.getEmail());

        return AuthResponse.builder()
                .accessToken(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtils.getExpirationTime())
                .user(userMapper.toUserResponse(user))
                .role(user.getRole().name())
                .build();
    }


    @Transactional
    public AuthResponse authenticateWithGoogle(String credential) {
        try {
            log.info("Processing Google authentication");

            // Verify Google token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(credential);
            if (idToken == null) {
                throw new AppException(ErrorCode.INVALID_CREDENTIALS, "Invalid Google token");
            }

            // Extract user info
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");
            String googleId = payload.getSubject();
            Boolean emailVerified = payload.getEmailVerified();

            log.info("Google user - Email: {}, Name: {}, Verified: {}", email, name, emailVerified);

            // Find existing user by email
            User user = userRepository.findByEmail(email).orElse(null);

            if (user != null) {
                // ==================== EXISTING USER ====================

                if (user.hasAuthProvider(AuthProvider.LOCAL)) {
                    // Case 1: LOCAL user logging in with Google → Link accounts
                    log.info("Linking Google to existing LOCAL account: {}", email);

                    user.addAuthProvider(AuthProvider.GOOGLE);
                    user.setProviderId(googleId);

                    // Auto-verify email if Google says it's verified
                    if (emailVerified && !user.getEmailVerified()) {
                        user.setEmailVerified(true);
                        log.info("Email auto-verified via Google for LOCAL user: {}", email);
                    }

                    if (user.getAvatarUrl() == null || user.getAvatarUrl().isEmpty()) {
                        user.setAvatarUrl(picture);
                        log.info("Set initial avatar from Google for LOCAL user");
                    }

                } else if (user.hasAuthProvider(AuthProvider.GOOGLE)) {
                    // Case 2: GOOGLE user logging in again
                    log.info("Existing Google user logging in: {}", email);


                    if (googleId != null && !googleId.equals(user.getProviderId())) {
                        user.setProviderId(googleId);
                        log.info("Updated Google Provider ID");
                    }


                    log.info("Skipping name/avatar update - user may have customized profile");
                }

                user = userRepository.save(user);

            } else {
                // ==================== NEW USER ====================
                log.info("Creating new Google user: {}", email);

                user = User.builder()
                        .email(email)
                        .fullName(name)
                        .avatarUrl(picture)
                        .providerId(googleId)
                        .role(Role.USER)
                        .isActive(true)
                        .emailVerified(emailVerified != null ? emailVerified : true)

                        .build();

                user.addAuthProvider(AuthProvider.GOOGLE);
                user = userRepository.save(user);

                // Initialize points
                UserPoints userPoints = UserPoints.builder()
                        .user(user)
                        .totalPoints(0)
                        .lifetimePoints(0)
                        .tier(Tier.BRONZE)
                        .build();
                userPointsRepository.save(userPoints);

                // Send welcome email
                try {
                    emailService.sendWelcomeEmail(user);
                } catch (Exception e) {
                    log.error("Error sending welcome email", e);
                }
            }

            // Generate JWT
            String token = jwtUtils.generateToken(user.getEmail());
            String refreshToken = jwtUtils.generateRefreshToken(user.getEmail());

            log.info("Google authentication successful for: {}", email);
            log.info("User auth providers: {}", user.getAuthProviders());

            return AuthResponse.builder()
                    .accessToken(token)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtUtils.getExpirationTime())
                    .user(userMapper.toUserResponse(user))
                    .role(user.getRole().name())
                    .build();

        } catch (Exception e) {
            log.error("Google authentication error", e);
            throw new AppException(ErrorCode.INVALID_CREDENTIALS,
                    "Google authentication failed: " + e.getMessage());
        }
    }


    @Transactional
    public void setPassword(String email, SetPasswordRequest request) {
        log.info("Setting password for user: {}", email);

        // Validate passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Passwords do not match");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));


        if (user.hasAuthProvider(AuthProvider.LOCAL) && user.getPassword() != null && !user.getPassword().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_REQUEST,
                    "Password already set. Use change password instead");
        }


        user.setPassword(passwordEncoder.encode(request.getNewPassword()));


        if (!user.hasAuthProvider(AuthProvider.LOCAL)) {
            user.addAuthProvider(AuthProvider.LOCAL);
            log.info("Added LOCAL auth provider for user: {}", email);
        }

        userRepository.save(user);

        log.info("Password set successfully. User can now login with: {}", user.getAuthProviders());

        // Send notification
        try {
            emailService.sendPasswordSetNotification(user);
        } catch (Exception e) {
            log.error("Failed to send password set notification", e);
        }
    }


    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        log.info("Changing password for user: {}", email);

        // Validate passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Passwords do not match");
        }

        // Get user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Check if user has password
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_REQUEST,
                    "No password set. Use set password instead");
        }

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS,
                    "Current password is incorrect");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed successfully for user: {}", email);
    }

    public void logout(String email) {
        log.info("User logout: {}", email);
    }

    public void blacklistToken(String token) {
        jwtUtils.blacklistToken(token);
        log.info("Token has been blacklisted");
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }


    private void sendVerificationEmailForNewUser(User user) {
        try {
            String token = UUID.randomUUID().toString();
            EmailVerificationToken emailToken = EmailVerificationToken.builder()
                    .user(user)
                    .token(token)
                    .expiryDate(LocalDateTime.now().plusHours(24))
                    .used(false)
                    .build();
            emailVerificationTokenRepository.save(emailToken);

            emailService.sendEmailVerification(user.getEmail(), user.getFullName(), token);
            log.info("Verification email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Error sending verification email", e);
        }
    }
}