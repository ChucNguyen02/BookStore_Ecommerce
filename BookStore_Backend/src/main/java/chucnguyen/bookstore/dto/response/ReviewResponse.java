package chucnguyen.bookstore.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReviewResponse {

    private String id;
    private Integer rating;
    private String comment;

    // User info
    private String userId;
    private String userName;
    private String userAvatar;

    // Book info
    private String bookId;
    private String bookTitle;

    // Verification
    private Boolean isVerifiedPurchase;

    // Images
    private List<String> imageUrls;

    // Votes
    private Integer helpfulCount;
    private Integer unhelpfulCount;
    private String currentUserVote; // HELPFUL, UNHELPFUL, or null

    // Reply from seller
    private ReviewReplyResponse sellerReply;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
