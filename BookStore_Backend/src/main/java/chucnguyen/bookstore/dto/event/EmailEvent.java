package chucnguyen.bookstore.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Map;

/**
 * Email message event sent to RabbitMQ for async processing.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailEvent implements Serializable {

    private String to;
    private String subject;
    private String template;
    private Map<String, Object> variables;
}
