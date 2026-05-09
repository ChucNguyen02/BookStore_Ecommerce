package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.request.RedeemRewardRequest;
import chucnguyen.bookstore.dto.response.*;
import chucnguyen.bookstore.entity.*;
import chucnguyen.bookstore.entity.enums.DiscountType;
import chucnguyen.bookstore.entity.enums.RedemptionStatus;
import chucnguyen.bookstore.entity.enums.ReferenceType;
import chucnguyen.bookstore.entity.enums.RewardType;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.RewardItemMapper;
import chucnguyen.bookstore.mapper.UserRewardMapper;
import chucnguyen.bookstore.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RewardService {

    private final RewardItemRepository rewardItemRepository;
    private final UserRewardRepository userRewardRepository;
    private final UserRepository userRepository;
    private final UserPointsRepository userPointsRepository;
    private final VoucherRepository voucherRepository;
    private final BookRepository bookRepository;
    private final RewardItemMapper rewardItemMapper;
    private final UserRewardMapper userRewardMapper;
    private final PointsService pointsService;

    @Transactional
    public List<RewardItemResponse> getAvailableRewards(String email) {
        // email có thể null nếu user chưa login (public browse)

        LocalDateTime now = LocalDateTime.now();
        List<RewardItem> rewards = rewardItemRepository.findByIsActiveTrue();

        List<RewardItemResponse> responses = new ArrayList<>();

        for (RewardItem reward : rewards) {
            // Kiểm tra thời gian hợp lệ
            boolean isInDateRange = true;
            if (reward.getStartDate() != null && now.isBefore(reward.getStartDate())) {
                isInDateRange = false;
            }
            if (reward.getEndDate() != null && now.isAfter(reward.getEndDate())) {
                isInDateRange = false;
            }

            // Chỉ tính là available nếu: còn hàng + active + trong thời gian
            // KHÔNG phụ thuộc vào điểm của user
            boolean isAvailable = reward.getIsActive()
                    && reward.getStockQuantity() > 0
                    && isInDateRange;

            RewardItemResponse response = rewardItemMapper.toRewardItemResponse(reward);

            // Thêm tiêu đề sách nếu là BOOK
            if (reward.getType() == RewardType.BOOK && reward.getBookId() != null) {
                bookRepository.findById(reward.getBookId())
                        .ifPresent(book -> response.setBookTitle(book.getTitle()));
            }

            response.setIsAvailable(isAvailable);

            responses.add(response);
        }

        return responses;
    }

    @Transactional
    public RewardItemResponse getRewardDetail(String rewardId) {
        RewardItem reward = rewardItemRepository.findById(rewardId)
                .orElseThrow(() -> new AppException(ErrorCode.REWARD_NOT_FOUND));

        RewardItemResponse response = rewardItemMapper.toRewardItemResponse(reward);

        // Add book title
        if (reward.getType() == RewardType.BOOK && reward.getBookId() != null) {
            bookRepository.findById(reward.getBookId())
                    .ifPresent(book -> response.setBookTitle(book.getTitle()));
        }

        return response;
    }

    @Transactional
    public UserRewardResponse redeemReward(String email, RedeemRewardRequest request) {
        log.info("Processing reward redemption for user: {}", email);

        // Get user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserPoints userPoints = userPointsRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Get reward
        RewardItem reward = rewardItemRepository.findById(request.getRewardId())
                .orElseThrow(() -> new AppException(ErrorCode.REWARD_NOT_FOUND));

        // Validate reward availability
        if (!reward.getIsActive()) {
            throw new AppException(ErrorCode.REWARD_NOT_AVAILABLE, "Reward is not active");
        }

        if (reward.getStockQuantity() <= 0) {
            throw new AppException(ErrorCode.REWARD_OUT_OF_STOCK);
        }

        // Check if in valid date range
        LocalDateTime now = LocalDateTime.now();
        if (reward.getStartDate() != null && now.isBefore(reward.getStartDate())) {
            throw new AppException(ErrorCode.REWARD_NOT_AVAILABLE, "Reward not yet available");
        }
        if (reward.getEndDate() != null && now.isAfter(reward.getEndDate())) {
            throw new AppException(ErrorCode.REWARD_NOT_AVAILABLE, "Reward has expired");
        }

        // Check sufficient points
        if (userPoints.getTotalPoints() < reward.getPointsRequired()) {
            throw new AppException(ErrorCode.INSUFFICIENT_POINTS,
                    String.format("Required: %d, Available: %d",
                            reward.getPointsRequired(), userPoints.getTotalPoints()));
        }

        // Deduct stock (atomic)
        int updated = rewardItemRepository.decrementStock(reward.getId());
        if (updated == 0) {
            throw new AppException(ErrorCode.REWARD_OUT_OF_STOCK);
        }

        // Deduct points
        pointsService.deductPoints(
                user,
                reward.getPointsRequired(),
                ReferenceType.REWARD_REDEMPTION,
                reward.getId(),
                "Redeemed: " + reward.getName()
        );

        // Create voucher if reward is voucher type
        String voucherCode = null;
        if (reward.getType() == RewardType.VOUCHER) {
            voucherCode = generateVoucherCode();

            DiscountType voucherDiscountType = switch (reward.getVoucherDiscountType()) {
                case PERCENTAGE -> DiscountType.PERCENTAGE;
                case FIXED_AMOUNT -> DiscountType.FIXED_AMOUNT;
            };

            Voucher voucher = Voucher.builder()
                    .code(voucherCode)
                    .description(reward.getDescription())
                    .discountType(voucherDiscountType)
                    .discountValue(reward.getVoucherDiscountValue())
                    .minOrderValue(BigDecimal.ZERO)
                    .usageLimit(1)
                    .usedCount(0)
                    .user(user) // Personal voucher
                    .startDate(LocalDateTime.now())
                    .endDate(LocalDateTime.now().plusMonths(3)) // Valid for 3 months
                    .isActive(true)
                    .build();
            voucherRepository.save(voucher);
        }

        // Create user reward record
        UserReward userReward = UserReward.builder()
                .user(user)
                .reward(reward)
                .pointsSpent(reward.getPointsRequired())
                .status(RedemptionStatus.PENDING)
                .voucherCode(voucherCode)
                .shippingAddress(request.getShippingAddress())
                .note(request.getNote())
                .redeemedAt(LocalDateTime.now())
                .build();

        // Auto complete for vouchers
        if (reward.getType() == RewardType.VOUCHER) {
            userReward.setStatus(RedemptionStatus.COMPLETED);
            userReward.setCompletedAt(LocalDateTime.now());
        }

        userReward = userRewardRepository.save(userReward);

        log.info("Reward redeemed successfully: {} by user: {}", reward.getName(), email);

        return userRewardMapper.toUserRewardResponse(userReward);
    }

    @Transactional
    public PageResponse<UserRewardResponse> getRedemptionHistory(
            String email,
            int page,
            int size) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PageRequest.of(page, size);
        Page<UserReward> userRewards = userRewardRepository
                .findByUserIdOrderByRedeemedAtDesc(user.getId(), pageable);

        Page<UserRewardResponse> responsePage = userRewards
                .map(userRewardMapper::toUserRewardResponse);

        return PageResponse.from(responsePage);
    }

    @Transactional
    public UserRewardResponse getRedemptionDetail(String email, String redemptionId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserReward userReward = userRewardRepository.findById(redemptionId)
                .orElseThrow(() -> new AppException(ErrorCode.REWARD_NOT_FOUND));

        // Check ownership
        if (!userReward.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return userRewardMapper.toUserRewardResponse(userReward);
    }

    // Admin methods

    @Transactional
    public void updateRedemptionStatus(
            String redemptionId,
            RedemptionStatus status,
            String trackingNumber) {

        UserReward userReward = userRewardRepository.findById(redemptionId)
                .orElseThrow(() -> new AppException(ErrorCode.REWARD_NOT_FOUND));

        userReward.setStatus(status);

        if (trackingNumber != null) {
            userReward.setTrackingNumber(trackingNumber);
        }

        if (status == RedemptionStatus.COMPLETED) {
            userReward.setCompletedAt(LocalDateTime.now());
        }

        userRewardRepository.save(userReward);

        log.info("Redemption {} status updated to: {}", redemptionId, status);
    }

    // Helper methods

    private String generateVoucherCode() {
        return "REWARD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public List<RewardItemResponse> getRewardsByType(RewardType type) {
        List<RewardItem> rewards = rewardItemRepository.findByTypeAndIsActiveTrue(type);
        return rewardItemMapper.toRewardItemResponseList(rewards);
    }

    public List<RewardItemResponse> getAffordableRewards(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserPoints userPoints = userPointsRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<RewardItem> rewards = rewardItemRepository.findAvailableRewards(userPoints.getTotalPoints());
        return rewardItemMapper.toRewardItemResponseList(rewards);
    }

    public List<RewardItemResponse> getRewardsInStock() {
        return rewardItemMapper.toRewardItemResponseList(rewardItemRepository.findRewardsInStock());
    }

    public List<RewardItemResponse> getRewardsByPointsRange(Integer minPoints, Integer maxPoints) {
        List<RewardItem> rewards = rewardItemRepository.findRewardsByPointsRange(minPoints, maxPoints);
        return rewardItemMapper.toRewardItemResponseList(rewards);
    }

    public PageResponse<RewardItemResponse> getTopClaimedRewards(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RewardItem> rewards = rewardItemRepository.findTopClaimedRewards(pageable);
        Page<RewardItemResponse> responsePage = rewards.map(rewardItemMapper::toRewardItemResponse);
        return PageResponse.from(responsePage);
    }

    public boolean checkRewardStock(String rewardId) {
        return rewardItemRepository.hasStock(rewardId);
    }

    public PageResponse<UserRewardResponse> getRedemptionsByStatus(String email, RedemptionStatus status, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PageRequest.of(page, size);
        Page<UserReward> userRewards = userRewardRepository.findByUserIdAndStatusOrderByRedeemedAtDesc(user.getId(), status, pageable);
        Page<UserRewardResponse> responsePage = userRewards.map(userRewardMapper::toUserRewardResponse);
        return PageResponse.from(responsePage);
    }

    public List<UserRewardResponse> getAllRedemptionsByStatus(RedemptionStatus status) {
        return userRewardMapper.toUserRewardResponseList(userRewardRepository.findByStatus(status));
    }

    public long countRewardRedemptions(String rewardId) {
        return userRewardRepository.countByRewardId(rewardId);
    }

    public long countUserRedemptions(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userRewardRepository.countByUserId(user.getId());
    }

    public Integer getTotalPointsSpent(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userRewardRepository.sumPointsSpentByUserId(user.getId());
    }

    public boolean hasRedeemedReward(String email, String rewardId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userRewardRepository.existsByUserIdAndRewardId(user.getId(), rewardId);
    }

    public List<UserRewardResponse> getUserVouchers(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        List<UserReward> userRewards = userRewardRepository.findUserVouchers(user.getId());
        return userRewardMapper.toUserRewardResponseList(userRewards);
    }
}