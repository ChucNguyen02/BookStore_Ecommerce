package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.response.NotificationResponse;
import chucnguyen.bookstore.dto.response.NotificationSummaryResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.entity.Notification;
import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.entity.enums.NotificationType;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.NotificationMapper;
import chucnguyen.bookstore.repository.NotificationRepository;
import chucnguyen.bookstore.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    public PageResponse<NotificationResponse> getUserNotifications(
            String email,
            int page,
            int size) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Notification> notifications = notificationRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        Page<NotificationResponse> responsePage = notifications
                .map(notificationMapper::toNotificationResponse);

        return PageResponse.from(responsePage);
    }

    public PageResponse<NotificationResponse> getUnreadNotifications(
            String email,
            int page,
            int size) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Notification> notifications = notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId(), pageable);

        Page<NotificationResponse> responsePage = notifications
                .map(notificationMapper::toNotificationResponse);

        return PageResponse.from(responsePage);
    }

    public NotificationSummaryResponse getNotificationSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        long unreadCount = notificationRepository.countByUserIdAndIsReadFalse(user.getId());
        long totalCount = notificationRepository.count();

        return NotificationSummaryResponse.builder()
                .unreadCount(unreadCount)
                .totalCount(totalCount)
                .build();
    }

    @Transactional
    public void markAsRead(String email, String notificationId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST, "Notification not found"));

        // Check ownership
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        notificationRepository.markAsRead(notificationId);
    }

    @Transactional
    public void markAllAsRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        notificationRepository.markAllAsRead(user.getId());
    }

    @Transactional
    public void deleteNotification(String email, String notificationId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST, "Notification not found"));

        // Check ownership
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        notificationRepository.delete(notification);
    }

    @Transactional
    public void createNotification(
            User user,
            NotificationType type,
            String title,
            String message,
            String link,
            String imageUrl) {

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .link(link)
                .imageUrl(imageUrl)
                .isRead(false)
                .build();

        notificationRepository.save(notification);

        log.info("Notification created for user: {}, type: {}", user.getEmail(), type);
    }

    @Transactional
    public void deleteAllUserNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        notificationRepository.deleteByUserId(user.getId());
    }
}