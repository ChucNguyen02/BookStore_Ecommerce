package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.request.RewardItemRequest;
import chucnguyen.bookstore.dto.request.UpdateRedemptionStatusRequest;
import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.dto.response.RewardItemResponse;
import chucnguyen.bookstore.dto.response.UserRewardResponse;
import chucnguyen.bookstore.entity.enums.RedemptionStatus;
import chucnguyen.bookstore.service.AdminRewardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/rewards")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Rewards", description = "Admin reward management APIs")
public class AdminRewardController {

    private final AdminRewardService adminRewardService;

    @PostMapping
    @Operation(summary = "Create reward item")
    public ApiResponse<RewardItemResponse> createReward(
            @Valid @RequestBody RewardItemRequest request) {
        return ApiResponse.success(
                adminRewardService.createReward(request),
                "Reward created successfully");
    }

    @PutMapping("/{rewardId}")
    @Operation(summary = "Update reward item")
    public ApiResponse<RewardItemResponse> updateReward(
            @PathVariable String rewardId,
            @Valid @RequestBody RewardItemRequest request) {
        return ApiResponse.success(
                adminRewardService.updateReward(rewardId, request),
                "Reward updated successfully");
    }

    @DeleteMapping("/{rewardId}")
    @Operation(summary = "Delete reward item")
    public ApiResponse<Void> deleteReward(@PathVariable String rewardId) {
        adminRewardService.deleteReward(rewardId);
        return ApiResponse.success("Reward deleted successfully");
    }

    @GetMapping
    @Operation(summary = "Get all rewards")
    public ApiResponse<PageResponse<RewardItemResponse>> getAllRewards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(adminRewardService.getAllRewards(page, size));
    }

    @GetMapping("/{rewardId}")
    @Operation(summary = "Get reward detail")
    public ApiResponse<RewardItemResponse> getRewardById(@PathVariable String rewardId) {
        return ApiResponse.success(adminRewardService.getRewardById(rewardId));
    }

    @PatchMapping("/{rewardId}/toggle-active")
    @Operation(summary = "Toggle reward active status")
    public ApiResponse<RewardItemResponse> toggleRewardActive(@PathVariable String rewardId) {
        return ApiResponse.success(
                adminRewardService.toggleRewardActive(rewardId),
                "Reward status updated");
    }

    @PatchMapping("/{rewardId}/stock")
    @Operation(summary = "Update reward stock")
    public ApiResponse<RewardItemResponse> updateStock(
            @PathVariable String rewardId,
            @RequestParam Integer quantity) {
        return ApiResponse.success(
                adminRewardService.updateStock(rewardId, quantity),
                "Stock updated successfully");
    }

    // Redemption Management
    @GetMapping("/redemptions")
    @Operation(summary = "Get all redemptions")
    public ApiResponse<PageResponse<UserRewardResponse>> getAllRedemptions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                adminRewardService.getAllRedemptions(page, size));
    }

    @GetMapping("/redemptions/status/{status}")
    @Operation(summary = "Get redemptions by status")
    public ApiResponse<List<UserRewardResponse>> getRedemptionsByStatus(
            @PathVariable String status) {
        RedemptionStatus redemptionStatus = RedemptionStatus.valueOf(status);
        return ApiResponse.success(
                adminRewardService.getRedemptionsByStatus(redemptionStatus));
    }

    @PatchMapping("/redemptions/{redemptionId}/status")
    @Operation(summary = "Update redemption status")
    public ApiResponse<UserRewardResponse> updateRedemptionStatus(
            @PathVariable String redemptionId,
            @Valid @RequestBody UpdateRedemptionStatusRequest request) {
        return ApiResponse.success(
                adminRewardService.updateRedemptionStatus(redemptionId, request),
                "Redemption status updated");
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get reward statistics")
    public ApiResponse<Object> getRewardStatistics() {
        return ApiResponse.success(adminRewardService.getRewardStatistics());
    }
}