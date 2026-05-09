package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.response.StatisticsResponse;
import chucnguyen.bookstore.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.cache.annotation.Cacheable;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatisticsService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Cacheable(value = "statistics", key = "'admin_dashboard'")
    public StatisticsResponse getStatistics() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0);

        // Basic counts
        long totalUsers = userRepository.count();
        long totalBooks = bookRepository.countByIsActive(true);
        long totalOrders = orderRepository.count();

        // Revenue
        BigDecimal totalRevenue = orderRepository.calculateRevenueBetweenDates(
                LocalDateTime.of(2000, 1, 1, 0, 0), now);
        BigDecimal todayRevenue = orderRepository.calculateRevenueBetweenDates(
                startOfDay, now);
        BigDecimal monthlyRevenue = orderRepository.calculateRevenueBetweenDates(
                startOfMonth, now);

        // Orders by status
        Map<String, Long> ordersByStatus = new HashMap<>();
        for (var status : chucnguyen.bookstore.entity.enums.OrderStatus.values()) {
            ordersByStatus.put(status.name(), orderRepository.countByStatus(status));
        }

        // Daily revenue (last 30 days)
        LocalDateTime thirtyDaysAgo = now.minusDays(30);
        List<Object[]> dailyStats = orderRepository.getOrderStatsByDate(thirtyDaysAgo, now);
        Map<String, BigDecimal> dailyRevenue = new HashMap<>();
        for (Object[] stat : dailyStats) {
            String date = stat[0].toString();
            BigDecimal revenue = orderRepository.calculateRevenueBetweenDates(
                    LocalDateTime.parse(date + "T00:00:00"),
                    LocalDateTime.parse(date + "T23:59:59")
            );
            dailyRevenue.put(date, revenue);
        }

        return StatisticsResponse.builder()
                .totalUsers(totalUsers)
                .totalBooks(totalBooks)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .todayRevenue(todayRevenue)
                .monthlyRevenue(monthlyRevenue)
                .ordersByStatus(ordersByStatus)
                .dailyRevenue(dailyRevenue)
                .build();
    }

    @Cacheable(value = "statistics", key = "'inventory_value'")
    public BigDecimal getTotalInventoryValue() {
        return bookRepository.calculateTotalInventoryValue();
    }

    @Cacheable(value = "statistics", key = "'books_sold'")
    public Long getTotalBooksSold() {
        return orderItemRepository.getTotalBooksSold();
    }
}