package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.dto.response.UserPointsResponse;
import chucnguyen.bookstore.service.UserPointsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/user-points")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin User Points", description = "Admin user points management APIs")
public class AdminUserPointsController {

    private final UserPointsService userPointsService;

    @GetMapping("/top-by-points")
    @Operation(summary = "Get top users by current points")
    public ApiResponse<PageResponse<UserPointsResponse>> getTopUsersByPoints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(userPointsService.getTopUsersByPoints(page, size));
    }

    @GetMapping("/top-by-lifetime")
    @Operation(summary = "Get top users by lifetime points")
    public ApiResponse<PageResponse<UserPointsResponse>> getTopUsersByLifetimePoints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                userPointsService.getTopUsersByLifetimePoints(page, size));
    }

    @GetMapping("/tier-distribution")
    @Operation(summary = "Get user count by tier")
    public ApiResponse<Map<String, Long>> getUserCountByTier() {
        return ApiResponse.success(userPointsService.getUserCountByTier());
    }

    @GetMapping("/total-points")
    @Operation(summary = "Get total points in system")
    public ApiResponse<Long> getTotalPoints() {
        return ApiResponse.success(userPointsService.getTotalPoints());
    }
}