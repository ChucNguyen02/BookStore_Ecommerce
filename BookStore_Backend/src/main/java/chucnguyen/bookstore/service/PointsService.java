package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.response.*;
import chucnguyen.bookstore.entity.DailyCheckIn;
import chucnguyen.bookstore.entity.PointTransaction;
import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.entity.UserPoints;
import chucnguyen.bookstore.entity.enums.ReferenceType;
import chucnguyen.bookstore.entity.enums.Tier;
import chucnguyen.bookstore.entity.enums.TransactionType;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.DailyCheckInMapper;
import chucnguyen.bookstore.mapper.PointTransactionMapper;
import chucnguyen.bookstore.mapper.UserPointsMapper;
import chucnguyen.bookstore.repository.DailyCheckInRepository;
import chucnguyen.bookstore.repository.PointTransactionRepository;
import chucnguyen.bookstore.repository.UserPointsRepository;
import chucnguyen.bookstore.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.CacheEvict;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PointsService {

    private final UserRepository userRepository;
    private final UserPointsRepository userPointsRepository;
    private final PointTransactionRepository pointTransactionRepository;
    private final DailyCheckInRepository dailyCheckInRepository;
    private final UserPointsMapper userPointsMapper;
    private final PointTransactionMapper pointTransactionMapper;
    private final DailyCheckInMapper dailyCheckInMapper;

    @Value("${points.check-in-daily:10}")
    private Integer dailyCheckInPoints;

    @Value("${points.check-in-streak-7:50}")
    private Integer streak7Bonus;

    @Value("${points.check-in-streak-14:100}")
    private Integer streak14Bonus;

    @Value("${points.check-in-streak-30:300}")
    private Integer streak30Bonus;

    @Value("${tier.bronze.min:0}")
    private Integer bronzeMin;

    @Value("${tier.silver.min:10000}")
    private Integer silverMin;

    @Value("${tier.gold.min:50000}")
    private Integer goldMin;

    @Value("${tier.platinum.min:100000}")
    private Integer platinumMin;

    public PointsResponse getUserPoints(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserPoints userPoints = userPointsRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        PointsResponse response = userPointsMapper.toPointsResponse(userPoints);

        // Calculate points to next tier
        Tier currentTier = userPoints.getTier();
        Integer pointsToNext = calculatePointsToNextTier(userPoints.getLifetimePoints(), currentTier);
        response.setPointsToNextTier(pointsToNext);
        response.setNextTier(getNextTier(currentTier));

        return response;
    }

    @Transactional
    public CheckInResponse dailyCheckIn(String email) {
        log.info("Processing daily check-in for user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        LocalDate today = LocalDate.now();

        // Check if already checked in today
        if (dailyCheckInRepository.existsByUserIdAndCheckInDate(user.getId(), today)) {
            throw new AppException(ErrorCode.ALREADY_CHECKED_IN);
        }

        // Get user points
        UserPoints userPoints = userPointsRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Calculate consecutive days
        int consecutiveDays = calculateConsecutiveDays(user.getId());

        // Calculate bonus
        int bonusPoints = calculateStreakBonus(consecutiveDays);
        int totalPoints = dailyCheckInPoints + bonusPoints;

        // Create check-in record
        DailyCheckIn checkIn = DailyCheckIn.builder()
                .user(user)
                .checkInDate(today)
                .pointsEarned(dailyCheckInPoints)
                .bonusPoints(bonusPoints)
                .consecutiveDays(consecutiveDays)
                .build();
        dailyCheckInRepository.save(checkIn);

        // Update user points
        addPoints(user, totalPoints, ReferenceType.DAILY_CHECK_IN,
                checkIn.getId(), "Daily check-in");

        // Prepare response
        CheckInResponse response = dailyCheckInMapper.toCheckInResponse(checkIn);
        response.setTotalPoints(userPoints.getTotalPoints());
        response.setMessage(generateCheckInMessage(consecutiveDays, bonusPoints));
        response.setNextBonusAt(getNextBonusMilestone(consecutiveDays));

        log.info("Check-in successful for user: {}, consecutive days: {}", email, consecutiveDays);

        return response;
    }

    public PageResponse<PointTransactionResponse> getPointHistory(
            String email,
            int page,
            int size) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PointTransaction> transactions = pointTransactionRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        Page<PointTransactionResponse> responsePage = transactions
                .map(pointTransactionMapper::toPointTransactionResponse);

        return PageResponse.from(responsePage);
    }

    public PointsSummaryResponse getPointsSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserPoints userPoints = userPointsRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        PointsSummaryResponse summary = userPointsMapper.toPointsSummaryResponse(userPoints);

        // This month points
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);
        LocalDateTime now = LocalDateTime.now();

        summary.setPointsEarnedThisMonth(
                pointTransactionRepository.sumEarnedPointsBetween(user.getId(), startOfMonth, now)
        );

        summary.setPointsRedeemedThisMonth(
                pointTransactionRepository.sumRedeemedPoints(user.getId())
        );

        // Check-in info
        boolean checkedInToday = dailyCheckInRepository
                .existsByUserIdAndCheckInDate(user.getId(), LocalDate.now());
        summary.setCheckedInToday(checkedInToday);

        dailyCheckInRepository.findLatestCheckInByUserId(user.getId())
                .ifPresent(checkIn -> summary.setConsecutiveCheckInDays(checkIn.getConsecutiveDays()));

        summary.setTotalCheckIns(dailyCheckInRepository.countByUserId(user.getId()));

        return summary;
    }

    @Transactional
    @CacheEvict(value = {"userPoints", "userStatistics"}, allEntries = true)
    public void addPoints(User user, Integer points,
                          ReferenceType referenceType,
                          String referenceId, String description) {

        UserPoints userPoints = userPointsRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Update points
        userPoints.addPoints(points);

        // Update tier
        updateUserTier(userPoints);

        userPointsRepository.save(userPoints);

        // Create transaction record
        PointTransaction transaction = PointTransaction.builder()
                .user(user)
                .points(points)
                .type(TransactionType.EARN)
                .referenceType(referenceType)
                .referenceId(referenceId)
                .description(description)
                .balanceAfter(userPoints.getTotalPoints())
                .build();
        pointTransactionRepository.save(transaction);

        log.info("Added {} points to user: {}", points, user.getEmail());
    }

    @Transactional
    @CacheEvict(value = {"userPoints", "userStatistics"}, allEntries = true)
    public void deductPoints(User user, Integer points,
                             ReferenceType referenceType,
                             String referenceId, String description) {

        UserPoints userPoints = userPointsRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Check sufficient points
        if (userPoints.getTotalPoints() < points) {
            throw new AppException(ErrorCode.INSUFFICIENT_POINTS,
                    String.format("Required: %d, Available: %d", points, userPoints.getTotalPoints()));
        }

        // Deduct points
        userPoints.subtractPoints(points);
        userPointsRepository.save(userPoints);

        // Create transaction record
        PointTransaction transaction = PointTransaction.builder()
                .user(user)
                .points(-points) // Negative for deduction
                .type(TransactionType.REDEEM)
                .referenceType(referenceType)
                .referenceId(referenceId)
                .description(description)
                .balanceAfter(userPoints.getTotalPoints())
                .build();
        pointTransactionRepository.save(transaction);

        log.info("Deducted {} points from user: {}", points, user.getEmail());
    }

    // Helper methods

    private int calculateConsecutiveDays(String userId) {
        DailyCheckIn lastCheckIn = dailyCheckInRepository
                .findLatestCheckInByUserId(userId)
                .orElse(null);

        if (lastCheckIn == null) {
            return 1; // First check-in
        }

        LocalDate yesterday = LocalDate.now().minusDays(1);

        if (lastCheckIn.getCheckInDate().equals(yesterday)) {
            return lastCheckIn.getConsecutiveDays() + 1;
        } else {
            return 1; // Streak broken
        }
    }

    private int calculateStreakBonus(int consecutiveDays) {
        if (consecutiveDays >= 30) return streak30Bonus;
        if (consecutiveDays >= 14) return streak14Bonus;
        if (consecutiveDays >= 7) return streak7Bonus;
        return 0;
    }

    private String generateCheckInMessage(int consecutiveDays, int bonusPoints) {
        if (bonusPoints > 0) {
            return String.format("🎉 Congratulations! %d days streak! Bonus: +%d points",
                    consecutiveDays, bonusPoints);
        }
        return String.format("✓ Check-in successful! Day %d", consecutiveDays);
    }

    private Integer getNextBonusMilestone(int consecutiveDays) {
        if (consecutiveDays < 7) return 7;
        if (consecutiveDays < 14) return 14;
        if (consecutiveDays < 30) return 30;
        return null; // Max milestone reached
    }

    private void updateUserTier(UserPoints userPoints) {
        int lifetimePoints = userPoints.getLifetimePoints();
        Tier newTier;

        if (lifetimePoints >= platinumMin) {
            newTier = Tier.PLATINUM;
        } else if (lifetimePoints >= goldMin) {
            newTier = Tier.GOLD;
        } else if (lifetimePoints >= silverMin) {
            newTier = Tier.SILVER;
        } else {
            newTier = Tier.BRONZE;
        }

        if (!newTier.equals(userPoints.getTier())) {
            userPoints.setTier(newTier);
            userPoints.setTierUpdatedAt(LocalDateTime.now());
            log.info("User tier updated to: {}", newTier);
        }
    }

    private Integer calculatePointsToNextTier(int lifetimePoints, Tier currentTier) {
        return switch (currentTier) {
            case BRONZE -> silverMin - lifetimePoints;
            case SILVER -> goldMin - lifetimePoints;
            case GOLD -> platinumMin - lifetimePoints;
            case PLATINUM -> null; // Max tier
        };
    }

    private String getNextTier(Tier currentTier) {
        return switch (currentTier) {
            case BRONZE -> "SILVER";
            case SILVER -> "GOLD";
            case GOLD -> "PLATINUM";
            case PLATINUM -> null;
        };
    }

    public PageResponse<Object[]> getTopCheckInUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Object[]> results = dailyCheckInRepository.findTopCheckInUsers(pageable);
        return PageResponse.from(results);
    }

    public boolean hasCheckedInToday(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return dailyCheckInRepository.existsByUserIdAndCheckInDate(
                user.getId(), LocalDate.now());
    }

    public CheckInResponse getCheckInByDate(String email, LocalDate date) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        DailyCheckIn checkIn = dailyCheckInRepository
                .findByUserIdAndCheckInDate(user.getId(), date)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST,
                        "No check-in found for this date"));

        return dailyCheckInMapper.toCheckInResponse(checkIn);
    }

    public PageResponse<CheckInResponse> getCheckInHistory(
            String email, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PageRequest.of(page, size);
        Page<DailyCheckIn> checkIns = dailyCheckInRepository
                .findByUserIdOrderByCheckInDateDesc(user.getId(), pageable);

        Page<CheckInResponse> responsePage = checkIns
                .map(dailyCheckInMapper::toCheckInResponse);

        return PageResponse.from(responsePage);
    }

    public Integer getTotalPointsFromCheckIns(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return dailyCheckInRepository.sumTotalPointsByUserId(user.getId());
    }

    private List<DailyCheckIn> getRecentCheckIns(String userId, int days) {
        LocalDate fromDate = LocalDate.now().minusDays(days);
        return dailyCheckInRepository.findRecentCheckIns(userId, fromDate);
    }

    public PageResponse<PointTransactionResponse> getPointHistoryByType(
            String email, TransactionType type, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PointTransaction> transactions = pointTransactionRepository
                .findByUserIdAndTypeOrderByCreatedAtDesc(user.getId(), type, pageable);

        Page<PointTransactionResponse> responsePage = transactions
                .map(pointTransactionMapper::toPointTransactionResponse);

        return PageResponse.from(responsePage);
    }

    public List<PointTransactionResponse> getTransactionsByReference(
            ReferenceType referenceType, String referenceId) {
        List<PointTransaction> transactions = pointTransactionRepository
                .findByReferenceTypeAndReferenceId(referenceType, referenceId);

        return pointTransactionMapper.toPointTransactionResponseList(transactions);
    }

    public Integer getTotalEarnedPoints(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return pointTransactionRepository.sumEarnedPoints(user.getId());
    }

    public boolean hasTransactionForReference(
            ReferenceType referenceType, String referenceId) {
        return pointTransactionRepository.existsByReferenceTypeAndReferenceId(
                referenceType, referenceId);
    }
}
