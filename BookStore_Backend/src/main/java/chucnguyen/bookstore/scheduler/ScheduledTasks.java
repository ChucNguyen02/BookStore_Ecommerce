package chucnguyen.bookstore.scheduler;

import chucnguyen.bookstore.entity.Order;
import chucnguyen.bookstore.entity.Voucher;
import chucnguyen.bookstore.entity.enums.OrderStatus;
import chucnguyen.bookstore.entity.enums.ReferenceType;
import chucnguyen.bookstore.repository.BookRepository;
import chucnguyen.bookstore.repository.OrderRepository;
import chucnguyen.bookstore.repository.VoucherRepository;
import chucnguyen.bookstore.service.EmailService;
import chucnguyen.bookstore.service.PointsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasks {

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final VoucherRepository voucherRepository;
    private final EmailService emailService;
    private final PointsService pointsService;

    @Value("${order.auto-complete-days:7}")
    private Integer autoCompleteDays;

    @Value("${order.cancel-timeout-hours:24}")
    private Integer cancelTimeoutHours;

    @Value("${order.payment-pending-timeout-hours:1}")  // ← MỚI: Timeout cho PAYMENT_PENDING
    private Integer paymentPendingTimeoutHours;

    /**
     * Auto-complete delivered orders after X days
     * Runs every day at 2 AM
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void autoCompleteDeliveredOrders() {
        log.info("Running auto-complete job for delivered orders");

        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(autoCompleteDays);
        List<Order> ordersToComplete = orderRepository.findOrdersToAutoComplete(cutoffDate);

        int completedCount = 0;
        for (Order order : ordersToComplete) {
            try {
                order.setStatus(OrderStatus.DELIVERED);
                orderRepository.save(order);

                // Award points if not already awarded
                if (!pointsService.hasTransactionForReference(
                        ReferenceType.ORDER, order.getId())) {
                    pointsService.addPoints(
                            order.getUser(),
                            order.getPointsEarned(),
                            ReferenceType.ORDER,
                            order.getId(),
                            "Earned from completed order " + order.getOrderCode()
                    );
                }

                completedCount++;
                log.info("Auto-completed order: {}", order.getOrderCode());

            } catch (Exception e) {
                log.error("Error auto-completing order: {}", order.getOrderCode(), e);
            }
        }

        log.info("Auto-complete job finished. Completed {} orders", completedCount);
    }

    /**
     * ✅ MỚI: Auto-cancel PAYMENT_PENDING orders after 1 hour
     * Runs every 10 minutes
     */
    @Scheduled(cron = "0 */10 * * * ?")  // Chạy mỗi 10 phút
    @Transactional
    public void autoCancelPaymentPendingOrders() {
        log.info("🔍 Running auto-cancel job for PAYMENT_PENDING orders");

        LocalDateTime cutoffDate = LocalDateTime.now().minusHours(paymentPendingTimeoutHours);

        List<Order> ordersToCancel = orderRepository.findExpiredPaymentPendingOrders(cutoffDate);

        int cancelledCount = 0;
        for (Order order : ordersToCancel) {
            try {
                // 1. Hoàn trả voucher
                if (order.getVoucher() != null) {
                    Voucher voucher = order.getVoucher();
                    voucher.setUsedCount(voucher.getUsedCount() - 1);
                    voucherRepository.save(voucher);
                    log.info("✅ Restored voucher {} for order {}",
                            voucher.getCode(), order.getOrderCode());
                }

                // 2. Hoàn trả points (nếu có sử dụng)
                if (order.getPointsUsed() != null && order.getPointsUsed() > 0) {
                    pointsService.addPoints(
                            order.getUser(),
                            order.getPointsUsed(),
                            ReferenceType.ORDER,
                            order.getId(),
                            "Refund points from cancelled order " + order.getOrderCode()
                    );
                    log.info("✅ Refunded {} points for order {}",
                            order.getPointsUsed(), order.getOrderCode());
                }

                // 3. Restore stock (nếu cần)
                order.getOrderItems().forEach(item -> {
                    var book = item.getBook();
                    book.setStockQuantity(book.getStockQuantity() + item.getQuantity());
                    log.info("✅ Restored {} stock for book {}",
                            item.getQuantity(), book.getTitle());
                });

                // 4. Cancel order
                order.setStatus(OrderStatus.CANCELLED);
                order.setCancelledAt(LocalDateTime.now());
                order.setCancelledReason("Auto-cancelled: Payment timeout after " +
                        paymentPendingTimeoutHours + " hour(s)");
                orderRepository.save(order);

                cancelledCount++;
                log.info("❌ Auto-cancelled PAYMENT_PENDING order: {}", order.getOrderCode());


            } catch (Exception e) {
                log.error("❌ Error auto-cancelling PAYMENT_PENDING order: {}",
                        order.getOrderCode(), e);
            }
        }

        log.info("✅ Auto-cancel PAYMENT_PENDING job finished. Cancelled {} orders",
                cancelledCount);
    }

    /**
     * Auto-cancel expired pending orders (Original - giữ lại cho PENDING status)
     * Runs every hour
     */
    @Scheduled(cron = "0 0 * * * ?")
    @Transactional
    public void autoCancelExpiredPendingOrders() {
        log.info("Running auto-cancel job for expired PENDING orders");

        LocalDateTime cutoffDate = LocalDateTime.now().minusHours(cancelTimeoutHours);
        List<Order> ordersToCancel = orderRepository.findExpiredPendingOrders(cutoffDate);

        int cancelledCount = 0;
        for (Order order : ordersToCancel) {
            try {
                // Hoàn trả voucher nếu có
                if (order.getVoucher() != null) {
                    Voucher voucher = order.getVoucher();
                    voucher.setUsedCount(voucher.getUsedCount() - 1);
                    voucherRepository.save(voucher);
                }

                order.setStatus(OrderStatus.CANCELLED);
                order.setCancelledAt(LocalDateTime.now());
                order.setCancelledReason("Auto-cancelled due to no payment after " +
                        cancelTimeoutHours + " hours");
                orderRepository.save(order);

                // Restore stock
                order.getOrderItems().forEach(item -> {
                    bookRepository.incrementStock(item.getBook().getId(), item.getQuantity());
                });

                cancelledCount++;
                log.info("Auto-cancelled expired PENDING order: {}", order.getOrderCode());

            } catch (Exception e) {
                log.error("Error auto-cancelling PENDING order: {}", order.getOrderCode(), e);
            }
        }

        log.info("Auto-cancel PENDING job finished. Cancelled {} orders", cancelledCount);
    }

    /**
     * Send reminder for pending orders
     * Runs every 6 hours
     */
    @Scheduled(cron = "0 0 */6 * * ?")
    public void sendPendingOrderReminders() {
        log.info("Running pending order reminder job");

        LocalDateTime cutoffDate = LocalDateTime.now().minusHours(12);
        List<Order> pendingOrders = orderRepository.findExpiredPendingOrders(cutoffDate);

        int remindersSent = 0;
        for (Order order : pendingOrders) {
            try {
                // Only send if not already cancelled
                if (order.getStatus() == OrderStatus.PENDING ||
                        order.getStatus() == OrderStatus.PAYMENT_PENDING) {
                    // Send reminder email (implement in EmailService)
                    // emailService.sendOrderReminderEmail(order);
                    remindersSent++;
                    log.info("Sent reminder for order: {}", order.getOrderCode());
                }
            } catch (Exception e) {
                log.error("Error sending reminder for order: {}", order.getOrderCode(), e);
            }
        }

        log.info("Reminder job finished. Sent {} reminders", remindersSent);
    }

    /**
     * Clean up old notifications
     * Runs daily at 3 AM
     */
    @Scheduled(cron = "0 0 3 * * ?")
    public void cleanupOldNotifications() {
        log.info("Notification cleanup job triggered");
    }

    /**
     * Update point expiry
     * Runs daily at 1 AM
     */
    @Scheduled(cron = "0 0 1 * * ?")
    @Transactional
    public void expireOldPoints() {
        log.info("Running points expiry job");
        log.info("Points expiry job finished");
    }

    /**
     * Generate daily statistics
     * Runs daily at 00:30 AM
     */
    @Scheduled(cron = "0 30 0 * * ?")
    public void generateDailyStatistics() {
        log.info("Generating daily statistics");

        LocalDateTime startOfYesterday = LocalDateTime.now().minusDays(1)
                .toLocalDate().atStartOfDay();
        LocalDateTime endOfYesterday = startOfYesterday.plusDays(1).minusSeconds(1);

        long ordersCount = orderRepository.findOrdersBetweenDates(
                startOfYesterday, endOfYesterday, null).getTotalElements();

        log.info("Daily statistics: {} orders placed yesterday", ordersCount);
    }

    /**
     * Send delivery confirmation emails
     * Runs every 2 hours
     */
    @Scheduled(cron = "0 0 */2 * * ?")
    public void sendDeliveryConfirmations() {
        log.info("Running delivery confirmation job");

        LocalDateTime twoHoursAgo = LocalDateTime.now().minusHours(2);
        List<Order> deliveredOrders = orderRepository.findRecentlyDeliveredOrders(
                twoHoursAgo, LocalDateTime.now());

        int emailsSent = 0;
        for (Order order : deliveredOrders) {
            if (order.getStatus() == OrderStatus.DELIVERED &&
                    order.getDeliveredAt() != null) {
                try {
                    emailService.sendDeliveryConfirmation(order);
                    emailsSent++;
                } catch (Exception e) {
                    log.error("Error sending delivery confirmation for order: {}",
                            order.getOrderCode(), e);
                }
            }
        }

        log.info("Delivery confirmation job finished. Sent {} emails", emailsSent);
    }
}