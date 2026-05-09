package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.NotificationResponse;
import chucnguyen.bookstore.dto.response.NotificationSummaryResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Notification management APIs")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get user notifications")
    public ApiResponse<PageResponse<NotificationResponse>> getUserNotifications(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                notificationService.getUserNotifications(authentication.getName(), page, size));
    }

    @GetMapping("/unread")
    @Operation(summary = "Get unread notifications")
    public ApiResponse<PageResponse<NotificationResponse>> getUnreadNotifications(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                notificationService.getUnreadNotifications(authentication.getName(), page, size));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get notification summary")
    public ApiResponse<NotificationSummaryResponse> getNotificationSummary(
            Authentication authentication) {
        return ApiResponse.success(
                notificationService.getNotificationSummary(authentication.getName()));
    }

    @PatchMapping("/{notificationId}/read")
    @Operation(summary = "Mark notification as read")
    public ApiResponse<Void> markAsRead(
            Authentication authentication,
            @PathVariable String notificationId) {
        notificationService.markAsRead(authentication.getName(), notificationId);
        return ApiResponse.success("Notification marked as read");
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ApiResponse<Void> markAllAsRead(Authentication authentication) {
        notificationService.markAllAsRead(authentication.getName());
        return ApiResponse.success("All notifications marked as read");
    }

    @DeleteMapping("/{notificationId}")
    @Operation(summary = "Delete notification")
    public ApiResponse<Void> deleteNotification(
            Authentication authentication,
            @PathVariable String notificationId) {
        notificationService.deleteNotification(authentication.getName(), notificationId);
        return ApiResponse.success("Notification deleted successfully");
    }

    @DeleteMapping("/all")
    @Operation(summary = "Delete all notifications")
    public ApiResponse<Void> deleteAllNotifications(Authentication authentication) {
        notificationService.deleteAllUserNotifications(authentication.getName());
        return ApiResponse.success("All notifications deleted");
    }
}