package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.event.EmailEvent;
import chucnguyen.bookstore.entity.Order;
import chucnguyen.bookstore.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final EmailProducer emailProducer;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // ==================== ORDER EMAILS ====================

    public void sendOrderConfirmation(Order order) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("customerName", order.getUser().getFullName());
        variables.put("orderCode", order.getOrderCode());
        variables.put("orderDate", order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
        variables.put("totalAmount", order.getTotalAmount());
        variables.put("shippingAddress", order.getShippingAddress());
        variables.put("orderLink", frontendUrl + "/orders/" + order.getOrderCode());

        emailProducer.sendEmailEvent(EmailEvent.builder()
                .to(order.getUser().getEmail())
                .subject("Xác nhận đơn hàng #" + order.getOrderCode())
                .template("email/order-confirmation")
                .variables(variables)
                .build());

        log.info("Order confirmation email queued for: {}", order.getUser().getEmail());
    }

    public void sendShippingNotification(Order order) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("customerName", order.getUser().getFullName());
        variables.put("orderCode", order.getOrderCode());
        variables.put("trackingNumber", order.getTrackingNumber());
        variables.put("estimatedDelivery", "3-5 ngày");
        variables.put("orderLink", frontendUrl + "/orders/" + order.getOrderCode());

        emailProducer.sendEmailEvent(EmailEvent.builder()
                .to(order.getUser().getEmail())
                .subject("Đơn hàng #" + order.getOrderCode() + " đang được giao")
                .template("email/shipping-notification")
                .variables(variables)
                .build());

        log.info("Shipping notification email queued for: {}", order.getUser().getEmail());
    }

    public void sendDeliveryConfirmation(Order order) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("customerName", order.getUser().getFullName());
        variables.put("orderCode", order.getOrderCode());
        variables.put("deliveryDate", order.getDeliveredAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
        variables.put("reviewLink", frontendUrl + "/orders/" + order.getOrderCode() + "/review");

        emailProducer.sendEmailEvent(EmailEvent.builder()
                .to(order.getUser().getEmail())
                .subject("Đơn hàng #" + order.getOrderCode() + " đã được giao")
                .template("email/delivery-confirmation")
                .variables(variables)
                .build());

        log.info("Delivery confirmation email queued for: {}", order.getUser().getEmail());
    }

    // ==================== AUTH EMAILS ====================

    public void sendPasswordResetEmail(User user, String resetToken) {
        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

        Map<String, Object> variables = new HashMap<>();
        variables.put("userName", user.getFullName());
        variables.put("resetLink", resetLink);
        variables.put("expiryTime", "30 phút");

        emailProducer.sendEmailEvent(EmailEvent.builder()
                .to(user.getEmail())
                .subject("Đặt lại mật khẩu - BookStore")
                .template("email/password-reset")
                .variables(variables)
                .build());

        log.info("Password reset email queued for: {}", user.getEmail());
    }

    public void sendWelcomeEmail(User user) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("userName", user.getFullName());
        variables.put("homeLink", frontendUrl);

        emailProducer.sendEmailEvent(EmailEvent.builder()
                .to(user.getEmail())
                .subject("Chào mừng đến với BookStore!")
                .template("email/welcome")
                .variables(variables)
                .build());

        log.info("Welcome email queued for: {}", user.getEmail());
    }

    // ==================== EMAIL CHANGE EMAILS ====================

    public void sendEmailChangeVerification(String toEmail, String userName, String token) {
        String verificationUrl = frontendUrl + "/verify-email-change?token=" + token;

        Map<String, Object> variables = new HashMap<>();
        variables.put("userName", userName);
        variables.put("verificationUrl", verificationUrl);

        emailProducer.sendEmailEvent(EmailEvent.builder()
                .to(toEmail)
                .subject("Verify Your New Email Address - BookStore")
                .template("email/email-change-verification")
                .variables(variables)
                .build());

        log.info("Email change verification queued for: {}", toEmail);
    }

    public void sendEmailChangeConfirmation(String toEmail, String userName) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("userName", userName);

        emailProducer.sendEmailEvent(EmailEvent.builder()
                .to(toEmail)
                .subject("Email Address Changed Successfully - BookStore")
                .template("email/email-change-confirmation")
                .variables(variables)
                .build());

        log.info("Email change confirmation queued for: {}", toEmail);
    }

    public void sendPasswordSetNotification(User user) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("userName", user.getFullName());

        emailProducer.sendEmailEvent(EmailEvent.builder()
                .to(user.getEmail())
                .subject("Password Set for Your Account - BookStore")
                .template("email/password-set-notification")
                .variables(variables)
                .build());

        log.info("Password set notification queued for: {}", user.getEmail());
    }

    // ==================== ACCOUNT DELETION EMAIL ====================

    public void sendAccountDeletionConfirmation(String toEmail, String userName) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("userName", userName);
        variables.put("homeLink", frontendUrl);
        variables.put("supportEmail", fromEmail);

        emailProducer.sendEmailEvent(EmailEvent.builder()
                .to(toEmail)
                .subject("Account Deleted Successfully - BookStore")
                .template("email/account-deletion")
                .variables(variables)
                .build());

        log.info("Account deletion confirmation queued for: {}", toEmail);
    }

    // ==================== MARKETING EMAILS ====================

    public void sendPromotionEmail(User user, String promotionTitle, String promotionContent) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("userName", user.getFullName());
        variables.put("promotionTitle", promotionTitle);
        variables.put("promotionContent", promotionContent);
        variables.put("shopLink", frontendUrl);

        emailProducer.sendEmailEvent(EmailEvent.builder()
                .to(user.getEmail())
                .subject(promotionTitle)
                .template("email/promotion")
                .variables(variables)
                .build());

        log.info("Promotion email queued for: {}", user.getEmail());
    }

    // ==================== EMAIL VERIFICATION ====================

    public void sendEmailVerification(String toEmail, String userName, String token) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + token;

        Map<String, Object> variables = new HashMap<>();
        variables.put("userName", userName);
        variables.put("verificationUrl", verificationUrl);
        variables.put("expiryTime", "24 giờ");

        emailProducer.sendEmailEvent(EmailEvent.builder()
                .to(toEmail)
                .subject("Xác thực địa chỉ Email - BookStore")
                .template("email/email-verification")
                .variables(variables)
                .build());

        log.info("Email verification queued for: {}", toEmail);
    }
}