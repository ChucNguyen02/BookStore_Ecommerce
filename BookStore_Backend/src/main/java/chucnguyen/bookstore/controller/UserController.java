package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.request.EmailChangeRequest;
import chucnguyen.bookstore.dto.request.UpdateProfileRequest;
import chucnguyen.bookstore.dto.request.VerifyEmailChangeRequest;
import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.UserProfileResponse;
import chucnguyen.bookstore.dto.response.UserResponse;
import chucnguyen.bookstore.dto.response.UserStatisticsResponse;
import chucnguyen.bookstore.service.EmailChangeService;
import chucnguyen.bookstore.service.UserService;
import chucnguyen.bookstore.service.UserStatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management APIs")
public class UserController {

    private final UserService userService;
    private final EmailChangeService emailChangeService;
    private final UserStatisticsService userStatisticsService;

    @GetMapping("/profile")
    @Operation(summary = "Get user profile")
    public ApiResponse<UserProfileResponse> getUserProfile(Authentication authentication) {
        return ApiResponse.success(userService.getUserProfile(authentication.getName()));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile")
    public ApiResponse<UserResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.success(
                userService.updateProfile(authentication.getName(), request),
                "Profile updated successfully");
    }

    @DeleteMapping("/account")
    @Operation(summary = "Delete account")
    public ApiResponse<Void> deleteAccount(Authentication authentication) {
        userService.deleteAccount(authentication.getName());
        return ApiResponse.success("Account deleted successfully");
    }

    // ==================== EMAIL CHANGE ENDPOINTS ====================

    @PostMapping("/request-email-change")
    @Operation(summary = "Request email change (LOCAL users only, before verification)")
    public ApiResponse<Void> requestEmailChange(
            Authentication authentication,
            @Valid @RequestBody EmailChangeRequest request) {
        emailChangeService.requestEmailChange(
                authentication.getName(),
                request.getNewEmail()
        );
        return ApiResponse.success(
                "Verification email sent to new email address. Please check your inbox.");
    }

    @PostMapping("/verify-email-change")
    @Operation(summary = "Verify email change with token")
    public ApiResponse<Void> verifyEmailChange(
            @Valid @RequestBody VerifyEmailChangeRequest request) {
        emailChangeService.verifyEmailChange(request.getToken());
        return ApiResponse.success("Email changed successfully");
    }

    @GetMapping("/validate-email-change-token")
    @Operation(summary = "Validate email change token")
    public ApiResponse<Boolean> validateEmailChangeToken(@RequestParam String token) {
        boolean isValid = emailChangeService.validateToken(token);
        return ApiResponse.success(isValid);
    }

    // ==================== EMAIL VERIFICATION ENDPOINTS ====================

    /**
     * Send verification email - CẦN đăng nhập
     * User đã đăng ký và muốn verify email của mình
     */
    @PostMapping("/send-verification-email")
    @Operation(summary = "Send verification email to current user's email (requires login)")
    public ApiResponse<Void> sendVerificationEmail(Authentication authentication) {
        userService.sendVerificationEmail(authentication.getName());
        return ApiResponse.success("Verification email sent successfully. Please check your inbox.");
    }

    /**
     * Resend verification email - KHÔNG cần đăng nhập
     * User có thể request resend ngay cả khi chưa đăng nhập
     */
    @PostMapping("/resend-verification-email")
    @Operation(summary = "Resend verification email (public - no login required)")
    public ApiResponse<Void> resendVerificationEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isBlank()) {
            return ApiResponse.error(400, "Email is required");
        }

        userService.sendVerificationEmail(email);
        return ApiResponse.success("Verification email sent successfully. Please check your inbox.");
    }

    /**
     * Verify email with token - PUBLIC (không cần đăng nhập)
     * Dùng GET để user có thể click vào link trong email
     */
    @GetMapping("/verify-email")
    @Operation(summary = "Verify email with token via GET (public - for email links)")
    public ApiResponse<Void> verifyEmailViaGet(@RequestParam String token) {
        userService.verifyEmail(token);
        return ApiResponse.success("Email verified successfully! You can now enjoy full access to your account.");
    }

    /**
     * Verify email with token - POST method (alternative)
     * Dùng khi frontend muốn gọi API qua POST
     */
    @PostMapping("/verify-email")
    @Operation(summary = "Verify email with token via POST (public)")
    public ApiResponse<Void> verifyEmailViaPost(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        if (token == null || token.isBlank()) {
            return ApiResponse.error(400, "Token is required");
        }

        userService.verifyEmail(token);
        return ApiResponse.success("Email verified successfully! You can now enjoy full access to your account.");
    }

    /**
     * Validate verification token - PUBLIC (không cần đăng nhập)
     */
    @GetMapping("/validate-verification-token")
    @Operation(summary = "Validate email verification token (public)")
    public ApiResponse<Boolean> validateVerificationToken(@RequestParam String token) {
        boolean isValid = userService.validateVerificationToken(token);
        return ApiResponse.success(isValid);
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get user statistics")
    public ApiResponse<UserStatisticsResponse> getUserStatistics(Authentication authentication) {
        return ApiResponse.success(userStatisticsService.getUserStatistics(authentication.getName()));
    }

    @GetMapping("/statistics/period")
    @Operation(summary = "Get user statistics by period")
    public ApiResponse<UserStatisticsResponse> getUserStatisticsByPeriod(
            Authentication authentication,
            @RequestParam(required = false) Integer months) {

        if (months == null) {
            return ApiResponse.success(userStatisticsService.getUserStatistics(authentication.getName()));
        }

        return ApiResponse.success(
                userStatisticsService.getUserStatisticsByPeriod(authentication.getName(), months)
        );
    }
}