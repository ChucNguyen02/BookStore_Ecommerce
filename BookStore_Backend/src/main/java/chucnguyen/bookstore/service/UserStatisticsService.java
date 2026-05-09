package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.response.CategorySpendingData;
import chucnguyen.bookstore.dto.response.MonthlySpendingData;
import chucnguyen.bookstore.dto.response.UserStatisticsResponse;
import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.entity.enums.OrderStatus;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.repository.OrderRepository;
import chucnguyen.bookstore.repository.ReviewRepository;
import chucnguyen.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserStatisticsService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;

    @Cacheable(value = "userStatistics", key = "'stats_' + #email")
    public UserStatisticsResponse getUserStatistics(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return getUserStatistics(user.getId(), null);
    }

    @Cacheable(value = "userStatistics", key = "'stats_period_' + #email + '_' + #months")
    public UserStatisticsResponse getUserStatisticsByPeriod(String email, Integer months) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return getUserStatistics(user.getId(), months);
    }

    private UserStatisticsResponse getUserStatistics(String userId, Integer months) {
        log.info("Fetching statistics for user: {}", userId);

        // Calculate start date based on period
        LocalDateTime startDate = months != null
                ? LocalDateTime.now().minusMonths(months)
                : LocalDateTime.of(2000, 1, 1, 0, 0); // All time

        // 1. Total orders (all statuses)
        Integer totalOrders = Math.toIntExact(
                orderRepository.countByUserId(userId)
        );

        // 2. Total spent (only DELIVERED orders)
        BigDecimal totalSpent = orderRepository.calculateTotalSpentByUser(userId);

        // 3. Total books purchased
        Integer totalBooks = orderRepository.getTotalBooksPurchasedByUser(userId);

        // 4. Total reviews
        Integer totalReviews = Math.toIntExact(
                reviewRepository.countByUserId(userId)
        );

        // 5. Monthly spending
        List<MonthlySpendingData> monthlySpending = getMonthlySpending(userId, startDate);

        // 6. Orders by status
        Map<String, Integer> ordersByStatus = getOrdersByStatus(userId);

        // 7. Top categories
        List<CategorySpendingData> topCategories = getTopCategories(userId);

        // 8. Average order value
        BigDecimal averageOrderValue = totalOrders > 0
                ? totalSpent.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // 9. First and last order dates
        LocalDateTime firstOrderDate = orderRepository.findFirstOrderDateByUserId(userId);
        LocalDateTime lastOrderDate = orderRepository.findLastOrderDateByUserId(userId);

        return UserStatisticsResponse.builder()
                .totalOrders(totalOrders)
                .totalSpent(totalSpent)
                .totalBooks(totalBooks)
                .totalReviews(totalReviews)
                .monthlySpending(monthlySpending)
                .ordersByStatus(ordersByStatus)
                .topCategories(topCategories)
                .averageOrderValue(averageOrderValue)
                .firstOrderDate(firstOrderDate)
                .lastOrderDate(lastOrderDate)
                .build();
    }

    private List<MonthlySpendingData> getMonthlySpending(String userId, LocalDateTime startDate) {
        List<Object[]> results = orderRepository.getMonthlySpendingByUser(userId, startDate);

        return results.stream()
                .map(row -> {
                    Integer year = (Integer) row[0];
                    Integer month = (Integer) row[1];
                    BigDecimal totalSpent = (BigDecimal) row[2];
                    Long orderCount = (Long) row[3];

                    String monthStr = String.format("%d-%02d", year, month);

                    return MonthlySpendingData.builder()
                            .month(monthStr)
                            .year(year)
                            .monthNumber(month)
                            .totalSpent(totalSpent)
                            .orderCount(orderCount.intValue())
                            .build();
                })
                .collect(Collectors.toList());
    }

    private Map<String, Integer> getOrdersByStatus(String userId) {
        List<Object[]> results = orderRepository.countOrdersByStatusForUser(userId);

        Map<String, Integer> ordersByStatus = new HashMap<>();
        for (Object[] row : results) {
            OrderStatus status = (OrderStatus) row[0];
            Long count = (Long) row[1];
            ordersByStatus.put(status.name(), count.intValue());
        }

        return ordersByStatus;
    }

    private List<CategorySpendingData> getTopCategories(String userId) {
        Pageable topCategories = PageRequest.of(0, 5);
        List<Object[]> results = orderRepository.getTopCategoriesByUser(userId, topCategories);

        return results.stream()
                .map(row -> CategorySpendingData.builder()
                        .categoryId((String) row[0])
                        .categoryName((String) row[1])
                        .totalSpent((BigDecimal) row[2])
                        .bookCount(((Long) row[3]).intValue())
                        .build())
                .collect(Collectors.toList());
    }
}