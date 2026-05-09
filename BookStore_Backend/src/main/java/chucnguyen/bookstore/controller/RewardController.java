package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.request.RedeemRewardRequest;
import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.dto.response.RewardItemResponse;
import chucnguyen.bookstore.dto.response.UserRewardResponse;
import chucnguyen.bookstore.entity.enums.RedemptionStatus;
import chucnguyen.bookstore.entity.enums.RewardType;
import chucnguyen.bookstore.service.RewardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rewards")
@RequiredArgsConstructor
@Tag(name = "Rewards", description = "Rewards redemption APIs")
public class RewardController {

    private final RewardService rewardService;

    @GetMapping
    @Operation(summary = "Get available rewards (public)")
    public ApiResponse<List<RewardItemResponse>> getAvailableRewards(Authentication authentication) {
        // Authentication có thể null nếu user chưa login
        String email = authentication != null ? authentication.getName() : null;
        return ApiResponse.success(rewardService.getAvailableRewards(email));
    }

    @GetMapping("/{rewardId}")
    @Operation(summary = "Get reward detail (public)")
    public ApiResponse<RewardItemResponse> getRewardDetail(@PathVariable String rewardId) {
        return ApiResponse.success(rewardService.getRewardDetail(rewardId));
    }

    @PostMapping("/redeem")
    @Operation(summary = "Redeem a reward (requires login)")
    public ApiResponse<UserRewardResponse> redeemReward(
            Authentication authentication,
            @Valid @RequestBody RedeemRewardRequest request) {
        return ApiResponse.success(
                rewardService.redeemReward(authentication.getName(), request),
                "Reward redeemed successfully");
    }

    @GetMapping("/history")
    @Operation(summary = "Get redemption history (requires login)")
    public ApiResponse<PageResponse<UserRewardResponse>> getRedemptionHistory(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                rewardService.getRedemptionHistory(authentication.getName(), page, size));
    }

    @GetMapping("/history/{redemptionId}")
    @Operation(summary = "Get redemption detail (requires login)")
    public ApiResponse<UserRewardResponse> getRedemptionDetail(
            Authentication authentication,
            @PathVariable String redemptionId) {
        return ApiResponse.success(
                rewardService.getRedemptionDetail(authentication.getName(), redemptionId));
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get rewards by type (public)")
    public ApiResponse<List<RewardItemResponse>> getRewardsByType(
            @PathVariable String type) {
        RewardType rewardType = RewardType.valueOf(type);
        return ApiResponse.success(rewardService.getRewardsByType(rewardType));
    }

    @GetMapping("/affordable")
    @Operation(summary = "Get affordable rewards for user (requires login)")
    public ApiResponse<List<RewardItemResponse>> getAffordableRewards(
            Authentication authentication) {
        return ApiResponse.success(
                rewardService.getAffordableRewards(authentication.getName()));
    }

    @GetMapping("/in-stock")
    @Operation(summary = "Get rewards in stock (public)")
    public ApiResponse<List<RewardItemResponse>> getRewardsInStock() {
        return ApiResponse.success(rewardService.getRewardsInStock());
    }

    @GetMapping("/points-range")
    @Operation(summary = "Get rewards by points range (public)")
    public ApiResponse<List<RewardItemResponse>> getRewardsByPointsRange(
            @RequestParam Integer minPoints,
            @RequestParam Integer maxPoints) {
        return ApiResponse.success(
                rewardService.getRewardsByPointsRange(minPoints, maxPoints));
    }

    @GetMapping("/top-claimed")
    @Operation(summary = "Get top claimed rewards (public)")
    public ApiResponse<PageResponse<RewardItemResponse>> getTopClaimedRewards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(rewardService.getTopClaimedRewards(page, size));
    }

    @GetMapping("/{rewardId}/check-stock")
    @Operation(summary = "Check reward stock (public)")
    public ApiResponse<Boolean> checkRewardStock(@PathVariable String rewardId) {
        return ApiResponse.success(rewardService.checkRewardStock(rewardId));
    }

    @GetMapping("/history/status/{status}")
    @Operation(summary = "Get redemptions by status (requires login)")
    public ApiResponse<PageResponse<UserRewardResponse>> getRedemptionsByStatus(
            Authentication authentication,
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        RedemptionStatus redemptionStatus = RedemptionStatus.valueOf(status);
        return ApiResponse.success(
                rewardService.getRedemptionsByStatus(
                        authentication.getName(), redemptionStatus, page, size));
    }

    @GetMapping("/{rewardId}/redemption-count")
    @Operation(summary = "Count reward redemptions (public)")
    public ApiResponse<Long> countRewardRedemptions(@PathVariable String rewardId) {
        return ApiResponse.success(rewardService.countRewardRedemptions(rewardId));
    }

    @GetMapping("/my-redemptions/count")
    @Operation(summary = "Count user redemptions (requires login)")
    public ApiResponse<Long> countUserRedemptions(Authentication authentication) {
        return ApiResponse.success(
                rewardService.countUserRedemptions(authentication.getName()));
    }

    @GetMapping("/total-spent")
    @Operation(summary = "Get total points spent (requires login)")
    public ApiResponse<Integer> getTotalPointsSpent(Authentication authentication) {
        return ApiResponse.success(
                rewardService.getTotalPointsSpent(authentication.getName()));
    }

    @GetMapping("/{rewardId}/has-redeemed")
    @Operation(summary = "Check if user has redeemed reward (requires login)")
    public ApiResponse<Boolean> hasRedeemedReward(
            Authentication authentication,
            @PathVariable String rewardId) {
        return ApiResponse.success(
                rewardService.hasRedeemedReward(authentication.getName(), rewardId));
    }

    @GetMapping("/vouchers")
    @Operation(summary = "Get user's vouchers from rewards (requires login)")
    public ApiResponse<List<UserRewardResponse>> getUserVouchers(
            Authentication authentication) {
        return ApiResponse.success(
                rewardService.getUserVouchers(authentication.getName()));
    }
}