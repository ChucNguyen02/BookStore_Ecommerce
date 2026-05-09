package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.request.ChangePasswordRequest;
import chucnguyen.bookstore.dto.request.LoginRequest;
import chucnguyen.bookstore.dto.request.RegisterRequest;
import chucnguyen.bookstore.dto.request.ResetPasswordRequest;
import chucnguyen.bookstore.dto.request.SetPasswordRequest;
import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.AuthResponse;
import chucnguyen.bookstore.dto.response.UserResponse;
import chucnguyen.bookstore.service.AuthService;
import chucnguyen.bookstore.service.PasswordResetService;
import chucnguyen.bookstore.configuration.RateLimit;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import chucnguyen.bookstore.configuration.JwtUtils;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Authentication APIs")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;
    private final JwtUtils jwtUtils;

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        if (refreshToken != null) {
            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(true)
                    .secure(false) // Change to true in production with HTTPS
                    .path("/")
                    .maxAge(jwtUtils.getRefreshExpirationTime())
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        }
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    @PostMapping("/register")
    @Operation(summary = "Register new account")
    @RateLimit(maxRequests = 5, windowSeconds = 60, key = "auth:register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.register(request);
        setRefreshTokenCookie(response, authResponse.getRefreshToken());
        authResponse.setRefreshToken(null);
        return ApiResponse.success(authResponse, "Registration successful");
    }

    @PostMapping("/login")
    @Operation(summary = "Login to account")
    @RateLimit(maxRequests = 10, windowSeconds = 60, key = "auth:login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request);
        setRefreshTokenCookie(response, authResponse.getRefreshToken());
        authResponse.setRefreshToken(null);
        return ApiResponse.success(authResponse, "Login successful");
    }

    @PostMapping("/google")
    @Operation(summary = "Authenticate with Google")
    public ApiResponse<AuthResponse> googleAuth(@RequestBody Map<String, String> request, HttpServletResponse response) {
        String credential = request.get("credential");
        if (credential == null || credential.isEmpty()) {
            return ApiResponse.error(400, "Credential is required");
        }

        AuthResponse authResponse = authService.authenticateWithGoogle(credential);
        setRefreshTokenCookie(response, authResponse.getRefreshToken());
        authResponse.setRefreshToken(null);
        return ApiResponse.success(authResponse, "Google login successful");
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout from account")
    public ApiResponse<Void> logout(
            Authentication authentication,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletResponse response) {

        if (authentication != null && authentication.isAuthenticated()) {
            authService.logout(authentication.getName());

            // Blacklist token nếu có
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                authService.blacklistToken(token);
            }
        }

        clearRefreshTokenCookie(response);

        return ApiResponse.success("Logout successful");
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user info")
    public ApiResponse<UserResponse> getCurrentUser(Authentication authentication) {
        return ApiResponse.success(authService.getCurrentUser(authentication.getName()));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password (works for both LOCAL and GOOGLE users)")
    public ApiResponse<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(authentication.getName(), request);
        return ApiResponse.success("Password changed successfully");
    }

    @PostMapping("/set-password")
    @Operation(summary = "Set password for Google users to enable local login")
    public ApiResponse<Void> setPassword(
            Authentication authentication,
            @Valid @RequestBody SetPasswordRequest request) {
        authService.setPassword(authentication.getName(), request);
        return ApiResponse.success("Password set successfully. You can now login with email and password.");
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset")
    @RateLimit(maxRequests = 3, windowSeconds = 60, key = "auth:forgot-password")
    public ApiResponse<Void> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.isBlank()) {
            return ApiResponse.error(400, "Email is required");
        }

        passwordResetService.sendPasswordResetEmail(email);

        return ApiResponse.success(
                "If the email exists, a password reset link has been sent");
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password with token")
    public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        return ApiResponse.success("Password reset successful");
    }

    @GetMapping("/validate-reset-token")
    @Operation(summary = "Validate reset token")
    public ApiResponse<Boolean> validateResetToken(@RequestParam String token) {
        boolean isValid = passwordResetService.validateResetToken(token);
        return ApiResponse.success(isValid);
    }
}