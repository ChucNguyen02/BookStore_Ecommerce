package chucnguyen.bookstore.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {

    private String id;
    private String question;

    // User who asked
    private String userId;
    private String userName;
    private String userAvatar;

    // Book
    private String bookId;
    private String bookTitle;

    private Boolean isAnswered;
    private Integer answerCount;

    // Answers
    private List<AnswerResponse> answers;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    private String bookSlug;
}
