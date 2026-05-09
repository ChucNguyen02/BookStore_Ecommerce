package chucnguyen.bookstore.service;

import chucnguyen.bookstore.configuration.RabbitMQConfig;
import chucnguyen.bookstore.dto.event.EmailEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

/**
 * Publishes email events to RabbitMQ for async processing.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailProducer {

    private final RabbitTemplate rabbitTemplate;

    public void sendEmailEvent(EmailEvent event) {
        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EMAIL_EXCHANGE,
                    RabbitMQConfig.EMAIL_ROUTING_KEY,
                    event
            );
            log.info("Email event published to RabbitMQ - to: {}, subject: {}", event.getTo(), event.getSubject());
        } catch (Exception e) {
            log.error("Failed to publish email event to RabbitMQ - to: {}, error: {}", event.getTo(), e.getMessage(), e);
            // Fallback: don't throw, the caller can handle retry or log
        }
    }
}
