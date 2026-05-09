package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.request.AiChatRequest;
import chucnguyen.bookstore.dto.request.AiGenerateDescriptionRequest;
import chucnguyen.bookstore.dto.request.AiRecommendRequest;
import chucnguyen.bookstore.dto.request.ReviewFilterRequest;
import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.BookResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.dto.response.ReviewResponse;
import chucnguyen.bookstore.service.BookService;
import chucnguyen.bookstore.service.GeminiService;
import chucnguyen.bookstore.service.ReviewService;
import chucnguyen.bookstore.configuration.RateLimit;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "AI Assistant", description = "AI-powered features using Gemini")
public class AiController {

    private final GeminiService geminiService;
    private final BookService bookService;
    private final ReviewService reviewService;

    /**
     * Chat với AI trợ lý - Tư vấn sách
     */
    @PostMapping("/chat")
    @Operation(summary = "Chat with AI book assistant")
    @RateLimit(maxRequests = 20, windowSeconds = 60, key = "ai:chat")
    public ApiResponse<Map<String, String>> chat(@Valid @RequestBody AiChatRequest request) {
        log.info("AI chat request: {}", request.getMessage());

        String reply = geminiService.chat(request.getMessage(), request.getHistory());

        return ApiResponse.success(
                Map.of("reply", reply),
                "AI response generated"
        );
    }

    /**
     * Gợi ý sách dựa trên sở thích
     */
    @PostMapping("/recommend")
    @Operation(summary = "Get AI book recommendations based on preferences")
    @RateLimit(maxRequests = 10, windowSeconds = 60, key = "ai:recommend")
    public ApiResponse<Map<String, String>> recommend(@Valid @RequestBody AiRecommendRequest request) {
        log.info("AI recommend request: {}", request.getPreferences());

        // Get top books from store for context
        List<BookResponse> topBooks = bookService.getFeaturedBooks(30);

        String recommendations = geminiService.recommendBooks(request.getPreferences(), topBooks);

        return ApiResponse.success(
                Map.of("recommendations", recommendations),
                "Recommendations generated"
        );
    }

    /**
     * Tóm tắt reviews của một cuốn sách
     */
    @GetMapping("/summarize-reviews/{bookId}")
    @Operation(summary = "Get AI summary of book reviews")
    @RateLimit(maxRequests = 10, windowSeconds = 60, key = "ai:summarize")
    public ApiResponse<Map<String, String>> summarizeReviews(@PathVariable String bookId) {
        log.info("AI review summary for book: {}", bookId);

        // Get book info
        var bookDetail = bookService.getBookById(bookId);
        String bookTitle = bookDetail.getTitle();

        // Get reviews using filter request
        ReviewFilterRequest filter = new ReviewFilterRequest();
        filter.setPage(0);
        filter.setSize(20);
        filter.setSortBy("createdAt");
        filter.setSortDirection("DESC");

        PageResponse<ReviewResponse> reviewPage = reviewService.getBookReviews(bookId, filter);
        List<ReviewResponse> reviews = reviewPage.getContent();

        String summary = geminiService.summarizeReviews(bookTitle, reviews);

        return ApiResponse.success(
                Map.of("summary", summary, "reviewCount", String.valueOf(reviews.size())),
                "Review summary generated"
        );
    }

    /**
     * Tạo mô tả sách bằng AI (Admin only)
     */
    @PostMapping("/generate-description")
    @Operation(summary = "Generate book description using AI (Admin)")
    @RateLimit(maxRequests = 10, windowSeconds = 60, key = "ai:generate")
    public ApiResponse<Map<String, String>> generateDescription(
            @RequestBody AiGenerateDescriptionRequest request) {
        log.info("AI generate description for: {}", request.getTitle());

        String description = geminiService.generateBookDescription(
                request.getTitle(),
                request.getAuthor(),
                request.getCategory(),
                request.getExistingDescription()
        );

        return ApiResponse.success(
                Map.of("description", description),
                "Description generated"
        );
    }
}
