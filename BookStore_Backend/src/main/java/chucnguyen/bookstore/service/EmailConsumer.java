package chucnguyen.bookstore.service;

import chucnguyen.bookstore.configuration.RabbitMQConfig;
import chucnguyen.bookstore.dto.event.EmailEvent;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

/**
 * Consumes email events from RabbitMQ and sends actual emails via SMTP.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailConsumer {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.mail.from-name}")
    private String fromName;

    @RabbitListener(queues = RabbitMQConfig.EMAIL_QUEUE, concurrency = "2-5")
    public void handleEmailEvent(EmailEvent event) {
        log.info("Received email event from RabbitMQ - to: {}, template: {}", event.getTo(), event.getTemplate());

        try {
            // Build Thymeleaf context from variables
            Context context = new Context();
            if (event.getVariables() != null) {
                event.getVariables().forEach(context::setVariable);
            }

            // Process template
            String htmlContent = templateEngine.process(event.getTemplate(), context);

            // Send email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(event.getTo());
            helper.setSubject(event.getSubject());
            helper.setText(htmlContent, true);

            mailSender.send(message);

            log.info("Email sent successfully via RabbitMQ consumer - to: {}, subject: {}", event.getTo(), event.getSubject());

        } catch (MessagingException e) {
            log.error("Failed to send email - to: {}, error: {}", event.getTo(), e.getMessage(), e);
            throw new RuntimeException("Email sending failed, message will be retried or sent to DLQ", e);
        } catch (Exception e) {
            log.error("Unexpected error processing email event - to: {}, error: {}", event.getTo(), e.getMessage(), e);
            throw new RuntimeException("Email processing failed", e);
        }
    }
}
