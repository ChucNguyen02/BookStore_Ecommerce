package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.dto.response.UserResponse;
import chucnguyen.bookstore.entity.enums.Role;
import chucnguyen.bookstore.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Users", description = "Admin user management APIs")
public class AdminUserController {

    private final UserService userService;

    @GetMapping("/search")
    @Operation(summary = "Search users")
    public ApiResponse<PageResponse<UserResponse>> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(userService.searchUsers(keyword, page, size));
    }

    @GetMapping("/new-users-count")
    @Operation(summary = "Count new users in date range")
    public ApiResponse<Long> countNewUsers(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endDate) {
        return ApiResponse.success(userService.countNewUsers(startDate, endDate));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active users")
    public ApiResponse<List<UserResponse>> getActiveUsers() {
        return ApiResponse.success(userService.getActiveUsers());
    }

    @GetMapping("/role/{role}")
    @Operation(summary = "Get users by role")
    public ApiResponse<List<UserResponse>> getUsersByRole(@PathVariable String role) {
        Role userRole = Role.valueOf(role);
        return ApiResponse.success(userService.getUsersByRole(userRole));
    }

    @GetMapping("/role/{role}/count")
    @Operation(summary = "Count users by role")
    public ApiResponse<Long> countUsersByRole(@PathVariable String role) {
        Role userRole = Role.valueOf(role);
        return ApiResponse.success(userService.countUsersByRole(userRole));
    }
}