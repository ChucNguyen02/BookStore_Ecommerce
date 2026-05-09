package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.request.RewardItemRequest;
import chucnguyen.bookstore.dto.request.UpdateRedemptionStatusRequest;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.dto.response.RewardItemResponse;
import chucnguyen.bookstore.dto.response.UserRewardResponse;
import chucnguyen.bookstore.entity.RewardItem;
import chucnguyen.bookstore.entity.UserReward;
import chucnguyen.bookstore.entity.enums.RedemptionStatus;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.RewardItemMapper;
import chucnguyen.bookstore.mapper.UserRewardMapper;
import chucnguyen.bookstore.repository.RewardItemRepository;
import chucnguyen.bookstore.repository.UserRewardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminRewardService {

    private final RewardItemRepository rewardItemRepository;
    private final UserRewardRepository userRewardRepository;
    private final RewardItemMapper rewardItemMapper;
    private final UserRewardMapper userRewardMapper;

    @Transactional
    @CacheEvict(value = "rewards", allEntries = true)
    public RewardItemResponse createReward(RewardItemRequest request) {
        log.info("Creating reward: {}", request.getName());

        RewardItem reward = rewardItemMapper.toRewardItem(request);
        reward.setClaimedCount(0);
        reward = rewardItemRepository.save(reward);

        log.info("Reward created successfully: {}", reward.getId());
        return rewardItemMapper.toRewardItemResponse(reward);
    }

    @Transactional
    @CacheEvict(value = "rewards", allEntries = true)
    public RewardItemResponse updateReward(String rewardId, RewardItemRequest request) {
        log.info("Updating reward: {}", rewardId);

        RewardItem reward = rewardItemRepository.findById(rewardId)
                .orElseThrow(() -> new AppException(ErrorCode.REWARD_NOT_FOUND));

        rewardItemMapper.updateRewardItemFromRequest(request, reward);
        reward = rewardItemRepository.save(reward);

        log.info("Reward updated successfully: {}", rewardId);
        return rewardItemMapper.toRewardItemResponse(reward);
    }

    @Transactional
    @CacheEvict(value = "rewards", allEntries = true)
    public void deleteReward(String rewardId) {
        log.info("Deleting reward: {}", rewardId);

        RewardItem reward = rewardItemRepository.findById(rewardId)
                .orElseThrow(() -> new AppException(ErrorCode.REWARD_NOT_FOUND));

        // Check if any pending redemptions
        long pendingCount = userRewardRepository.countByRewardId(rewardId);
        if (pendingCount > 0) {
            throw new AppException(ErrorCode.INVALID_REQUEST,
                    "Cannot delete reward with existing redemptions");
        }

        rewardItemRepository.delete(reward);
        log.info("Reward deleted successfully: {}", rewardId);
    }

    @Transactional
    @Cacheable(value = "rewards", key = "'all_' + #page + '_' + #size")
    public PageResponse<RewardItemResponse> getAllRewards(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<RewardItem> rewards = rewardItemRepository.findAll(pageable);
        Page<RewardItemResponse> responsePage = rewards.map(rewardItemMapper::toRewardItemResponse);
        return PageResponse.from(responsePage);
    }

    public RewardItemResponse getRewardById(String rewardId) {
        RewardItem reward = rewardItemRepository.findById(rewardId)
                .orElseThrow(() -> new AppException(ErrorCode.REWARD_NOT_FOUND));
        return rewardItemMapper.toRewardItemResponse(reward);
    }

    @Transactional
    @CacheEvict(value = "rewards", allEntries = true)
    public RewardItemResponse toggleRewardActive(String rewardId) {
        RewardItem reward = rewardItemRepository.findById(rewardId)
                .orElseThrow(() -> new AppException(ErrorCode.REWARD_NOT_FOUND));

        reward.setIsActive(!reward.getIsActive());
        reward = rewardItemRepository.save(reward);

        log.info("Reward {} active status: {}", rewardId, reward.getIsActive());
        return rewardItemMapper.toRewardItemResponse(reward);
    }

    @Transactional
    @CacheEvict(value = "rewards", allEntries = true)
    public RewardItemResponse updateStock(String rewardId, Integer quantity) {
        RewardItem reward = rewardItemRepository.findById(rewardId)
                .orElseThrow(() -> new AppException(ErrorCode.REWARD_NOT_FOUND));

        reward.setStockQuantity(quantity);
        reward = rewardItemRepository.save(reward);

        log.info("Reward {} stock updated to: {}", rewardId, quantity);
        return rewardItemMapper.toRewardItemResponse(reward);
    }

    @Transactional
    @Cacheable(value = "rewards", key = "'all_redemptions_' + #page + '_' + #size")
    public PageResponse<UserRewardResponse> getAllRedemptions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("redeemedAt").descending());
        Page<UserReward> redemptions = userRewardRepository.findAll(pageable);
        Page<UserRewardResponse> responsePage = redemptions.map(userRewardMapper::toUserRewardResponse);
        return PageResponse.from(responsePage);
    }

    public List<UserRewardResponse> getRedemptionsByStatus(RedemptionStatus status) {
        List<UserReward> redemptions = userRewardRepository.findByStatus(status);
        return userRewardMapper.toUserRewardResponseList(redemptions);
    }

    @Transactional
    @CacheEvict(value = "rewards", allEntries = true)
    public UserRewardResponse updateRedemptionStatus(
            String redemptionId,
            UpdateRedemptionStatusRequest request) {

        log.info("Updating redemption {} status to: {}", redemptionId, request.getStatus());

        UserReward redemption = userRewardRepository.findById(redemptionId)
                .orElseThrow(() -> new AppException(ErrorCode.REWARD_NOT_FOUND));

        RedemptionStatus newStatus = RedemptionStatus.valueOf(request.getStatus());
        redemption.setStatus(newStatus);

        if (request.getTrackingNumber() != null) {
            redemption.setTrackingNumber(request.getTrackingNumber());
        }

        if (newStatus == RedemptionStatus.COMPLETED) {
            redemption.setCompletedAt(LocalDateTime.now());
        }

        redemption = userRewardRepository.save(redemption);

        log.info("Redemption status updated successfully: {}", redemptionId);
        return userRewardMapper.toUserRewardResponse(redemption);
    }

    @Cacheable(value = "rewards", key = "'stats'")
    public Map<String, Object> getRewardStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Total rewards
        stats.put("totalRewards", rewardItemRepository.count());
        stats.put("activeRewards", rewardItemRepository.findByIsActiveTrue().size());

        // Total redemptions
        stats.put("totalRedemptions", userRewardRepository.count());
        stats.put("pendingRedemptions",
                userRewardRepository.findByStatus(RedemptionStatus.PENDING).size());
        stats.put("completedRedemptions",
                userRewardRepository.findByStatus(RedemptionStatus.COMPLETED).size());

        // Most redeemed reward
        Pageable topOne = PageRequest.of(0, 1);
        Page<RewardItem> topRewards = rewardItemRepository.findTopClaimedRewards(topOne);
        if (!topRewards.isEmpty()) {
            RewardItem topReward = topRewards.getContent().get(0);
            Map<String, Object> topRewardInfo = new HashMap<>();
            topRewardInfo.put("name", topReward.getName());
            topRewardInfo.put("claimedCount", topReward.getClaimedCount());
            stats.put("mostRedeemedReward", topRewardInfo);
        }

        log.info("Reward statistics generated");
        return stats;
    }
}