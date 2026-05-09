package chucnguyen.bookstore.service;

import chucnguyen.bookstore.configuration.GeminiConfig;
import chucnguyen.bookstore.dto.response.BookResponse;
import chucnguyen.bookstore.dto.response.ReviewResponse;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {

    private final GeminiConfig geminiConfig;
    private final RestTemplate geminiRestTemplate;
    private final ObjectMapper objectMapper;

    private static final String BOOKSTORE_SYSTEM_PROMPT = """
            Bạn là trợ lý AI của BookStore - một cửa hàng sách trực tuyến tại Việt Nam.
            Vai trò của bạn:
            - Tư vấn và giới thiệu sách cho khách hàng
            - Trả lời câu hỏi liên quan đến sách, tác giả, thể loại
            - Gợi ý sách phù hợp với sở thích của người dùng
            - Hỗ trợ tìm kiếm sách theo chủ đề
            
            Quy tắc:
            - Trả lời bằng tiếng Việt (trừ khi người dùng hỏi bằng tiếng Anh)
            - Câu trả lời ngắn gọn, hữu ích, thân thiện
            - Nếu không liên quan đến sách/đọc sách, lịch sự từ chối và hướng dẫn lại
            - Sử dụng emoji phù hợp để trả lời thêm sinh động
            - Trả lời dưới dạng text thuần, không dùng markdown phức tạp
            """;

    /**
     * Chat với AI - Tư vấn sách
     */
    public String chat(String userMessage, List<Map<String, String>> conversationHistory) {
        validateConfig();

        StringBuilder prompt = new StringBuilder();
        prompt.append(BOOKSTORE_SYSTEM_PROMPT).append("\n\n");

        // Add conversation history
        if (conversationHistory != null && !conversationHistory.isEmpty()) {
            prompt.append("Lịch sử hội thoại:\n");
            for (Map<String, String> msg : conversationHistory) {
                String role = msg.get("role");
                String content = msg.get("content");
                if ("user".equals(role)) {
                    prompt.append("Khách hàng: ").append(content).append("\n");
                } else {
                    prompt.append("Trợ lý: ").append(content).append("\n");
                }
            }
            prompt.append("\n");
        }

        prompt.append("Khách hàng: ").append(userMessage);

        return callGeminiApi(prompt.toString());
    }

    /**
     * Gợi ý sách dựa trên sở thích
     */
    public String recommendBooks(String preferences, List<BookResponse> availableBooks) {
        validateConfig();

        StringBuilder prompt = new StringBuilder();
        prompt.append(BOOKSTORE_SYSTEM_PROMPT).append("\n\n");
        prompt.append("Nhiệm vụ: Gợi ý sách phù hợp cho khách hàng.\n\n");
        prompt.append("Sở thích/yêu cầu của khách hàng: ").append(preferences).append("\n\n");

        if (availableBooks != null && !availableBooks.isEmpty()) {
            prompt.append("Danh sách sách hiện có trong cửa hàng:\n");
            for (BookResponse book : availableBooks) {
                prompt.append("- \"").append(book.getTitle()).append("\"");
                if (book.getAuthors() != null && !book.getAuthors().isEmpty()) {
                    prompt.append(" của ").append(
                            book.getAuthors().stream()
                                    .map(a -> a.getName())
                                    .collect(Collectors.joining(", "))
                    );
                }
                if (book.getCategoryName() != null) {
                    prompt.append(" (").append(book.getCategoryName()).append(")");
                }
                if (book.getAverageRating() != null) {
                    prompt.append(" - ⭐ ").append(book.getAverageRating());
                }
                prompt.append("\n");
            }
            prompt.append("\nHãy gợi ý từ danh sách trên (ưu tiên), và có thể gợi ý thêm sách ngoài danh sách nếu phù hợp.\n");
        } else {
            prompt.append("Không có danh sách sách cụ thể. Hãy gợi ý sách phổ biến phù hợp với sở thích.\n");
        }

        prompt.append("Trả lời dưới dạng danh sách ngắn gọn với lý do cho mỗi gợi ý.");

        return callGeminiApi(prompt.toString());
    }

    /**
     * Tóm tắt reviews của một cuốn sách
     */
    public String summarizeReviews(String bookTitle, List<ReviewResponse> reviews) {
        validateConfig();

        if (reviews == null || reviews.isEmpty()) {
            return "Chưa có đánh giá nào cho cuốn sách này.";
        }

        StringBuilder prompt = new StringBuilder();
        prompt.append("Nhiệm vụ: Tóm tắt đánh giá của khách hàng cho sách \"").append(bookTitle).append("\".\n\n");
        prompt.append("Các đánh giá:\n");

        int count = 0;
        for (ReviewResponse review : reviews) {
            if (count >= 20) break; // Limit to 20 reviews to avoid token limit
            prompt.append("- ⭐ ").append(review.getRating()).append("/5");
            if (review.getComment() != null && !review.getComment().isBlank()) {
                prompt.append(": \"").append(review.getComment()).append("\"");
            }
            prompt.append("\n");
            count++;
        }

        prompt.append("\nHãy tóm tắt các đánh giá trên bao gồm:\n");
        prompt.append("1. Đánh giá chung (positive/negative)\n");
        prompt.append("2. Điểm mạnh được nhắc nhiều\n");
        prompt.append("3. Điểm yếu được nhắc nhiều\n");
        prompt.append("4. Ai nên đọc cuốn sách này\n");
        prompt.append("Trả lời ngắn gọn bằng tiếng Việt.");

        return callGeminiApi(prompt.toString());
    }

    /**
     * Tạo mô tả sách bằng AI (cho Admin)
     */
    public String generateBookDescription(String title, String author, String category, String existingDescription) {
        validateConfig();

        StringBuilder prompt = new StringBuilder();
        prompt.append("Nhiệm vụ: Viết mô tả hấp dẫn cho cuốn sách bán trên cửa hàng online.\n\n");
        prompt.append("Thông tin sách:\n");
        prompt.append("- Tên: ").append(title).append("\n");
        if (author != null) prompt.append("- Tác giả: ").append(author).append("\n");
        if (category != null) prompt.append("- Thể loại: ").append(category).append("\n");
        if (existingDescription != null && !existingDescription.isBlank()) {
            prompt.append("- Mô tả hiện tại: ").append(existingDescription).append("\n");
            prompt.append("\nHãy cải thiện mô tả trên cho hấp dẫn hơn.\n");
        } else {
            prompt.append("\nHãy viết mô tả khoảng 100-200 từ, hấp dẫn, thu hút người đọc.\n");
        }
        prompt.append("Trả lời bằng tiếng Việt, chỉ trả về nội dung mô tả, không thêm tiêu đề hay ghi chú.");

        return callGeminiApi(prompt.toString());
    }

    // ==================== Private Helpers ====================

    private void validateConfig() {
        if (!geminiConfig.isConfigured()) {
            throw new AppException(ErrorCode.SYSTEM_ERROR, "Gemini API key is not configured");
        }
    }

    private String callGeminiApi(String prompt) {
        try {
            String url = geminiConfig.getGenerateContentUrl();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Build Gemini API request body
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt)
                            ))
                    ),
                    "generationConfig", Map.of(
                            "temperature", 0.7,
                            "topP", 0.95,
                            "topK", 40,
                            "maxOutputTokens", 1024
                    )
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = geminiRestTemplate.exchange(
                    url, HttpMethod.POST, request, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return extractTextFromResponse(response.getBody());
            }

            log.error("Gemini API returned non-200 status: {}", response.getStatusCode());
            throw new AppException(ErrorCode.SYSTEM_ERROR, "AI service is temporarily unavailable");

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error calling Gemini API: ", e);
            throw new AppException(ErrorCode.SYSTEM_ERROR, "AI service error: " + e.getMessage());
        }
    }

    private String extractTextFromResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode content = candidates.get(0).path("content");
                JsonNode parts = content.path("parts");
                if (parts.isArray() && !parts.isEmpty()) {
                    return parts.get(0).path("text").asText("");
                }
            }

            log.warn("Unexpected Gemini response structure: {}", responseBody);
            return "Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại sau.";

        } catch (Exception e) {
            log.error("Error parsing Gemini response: ", e);
            return "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.";
        }
    }
}
