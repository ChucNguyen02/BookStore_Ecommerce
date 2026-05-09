package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.dto.response.UserPointsResponse;
import chucnguyen.bookstore.entity.enums.Tier;
import chucnguyen.bookstore.service.PointsService;
import chucnguyen.bookstore.service.UserPointsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/points")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Points", description = "Admin points management APIs")
public class AdminPointsController {

    private final PointsService pointsService;
    private final UserPointsService userPointsService;

    @GetMapping("/top-users")
    @Operation(summary = "Get top check-in users")
    public ApiResponse<PageResponse<Object[]>> getTopCheckInUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(pointsService.getTopCheckInUsers(page, size));
    }

    @GetMapping("/tier/{tier}")
    @Operation(summary = "Get users by tier")
    public ApiResponse<List<UserPointsResponse>> getUsersByTier(@PathVariable String tier) {
        Tier userTier = Tier.valueOf(tier);
        return ApiResponse.success(userPointsService.getUsersByTier(userTier));
    }

    @GetMapping("/user/{userId}/check-points")
    @Operation(summary = "Check if user has enough points")
    public ApiResponse<Boolean> userHasEnoughPoints(
            @PathVariable String userId,
            @RequestParam Integer points) {
        return ApiResponse.success(
                userPointsService.userHasEnoughPoints(userId, points));
    }
}