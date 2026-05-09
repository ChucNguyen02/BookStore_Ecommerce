package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.dto.response.UserPointsResponse;
import chucnguyen.bookstore.entity.UserPoints;
import chucnguyen.bookstore.entity.enums.Tier;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.repository.UserPointsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserPointsService {

    private final UserPointsRepository userPointsRepository;

    @Cacheable(value = "userPoints", key = "'top_' + #page + '_' + #size")
    public PageResponse<UserPointsResponse> getTopUsersByPoints(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserPoints> results = userPointsRepository.findTopUsersByPoints(pageable);
        return PageResponse.from(results.map(UserPointsResponse::from));
    }

    @Cacheable(value = "userPoints", key = "'top_lifetime_' + #page + '_' + #size")
    public PageResponse<UserPointsResponse> getTopUsersByLifetimePoints(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserPoints> results = userPointsRepository.findTopUsersByLifetimePoints(pageable);
        return PageResponse.from(results.map(UserPointsResponse::from));
    }

    @Cacheable(value = "userPoints", key = "'count_tier'")
    public Map<String, Long> getUserCountByTier() {
        Map<String, Long> tierCounts = new HashMap<>();
        for (Tier tier : Tier.values()) {
            tierCounts.put(tier.name(), userPointsRepository.countByTier(tier));
        }
        return tierCounts;
    }

    @Cacheable(value = "userPoints", key = "'total_points'")
    public Long getTotalPoints() {
        return userPointsRepository.sumAllPoints();
    }

    @Cacheable(value = "userPoints", key = "'user_' + #userId")
    public UserPointsResponse getUserPointsWithUser(String userId) {
        UserPoints userPoints = userPointsRepository.findByUserIdWithUser(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return UserPointsResponse.from(userPoints);
    }

    @Cacheable(value = "userPoints", key = "'tier_' + #tier")
    public List<UserPointsResponse> getUsersByTier(Tier tier) {
        return userPointsRepository.findByTier(tier).stream()
                .map(UserPointsResponse::from)
                .collect(Collectors.toList());
    }

    public boolean userHasEnoughPoints(String userId, Integer points) {
        return userPointsRepository.hasEnoughPoints(userId, points);
    }
}