package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.request.CreateReviewRequest;
import chucnguyen.bookstore.dto.request.ReplyReviewRequest;
import chucnguyen.bookstore.dto.request.ReviewFilterRequest;
import chucnguyen.bookstore.dto.request.UpdateReviewRequest;
import chucnguyen.bookstore.dto.response.*;
import chucnguyen.bookstore.entity.enums.VoteType;
import chucnguyen.bookstore.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Review management APIs")
public class ReviewController {

    private final ReviewService reviewService;

    // ============ PUBLIC ENDPOINTS (không cần @PreAuthorize vì đã permitAll ở config) ============

    @GetMapping("/book/{bookId}")
    @Operation(summary = "Get book reviews - Public")
    public ApiResponse<PageResponse<ReviewResponse>> getBookReviews(
            @PathVariable String bookId,
            @Valid @ModelAttribute ReviewFilterRequest filter) {
        return ApiResponse.success(reviewService.getBookReviews(bookId, filter));
    }

    @GetMapping("/book/{bookId}/summary")
    @Operation(summary = "Get review summary - Public")
    public ApiResponse<ReviewSummaryResponse> getReviewSummary(@PathVariable String bookId) {
        return ApiResponse.success(reviewService.getReviewSummary(bookId));
    }

    @GetMapping("/book/{bookId}/top-helpful")
    @Operation(summary = "Get top helpful reviews - Public")
    public ApiResponse<PageResponse<ReviewResponse>> getTopHelpfulReviews(
            @PathVariable String bookId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(reviewService.getTopHelpfulReviews(bookId, page, size));
    }

    @GetMapping("/{reviewId}/replies")
    @Operation(summary = "Get review replies - Public")
    public ApiResponse<List<ReviewReplyResponse>> getReviewReplies(@PathVariable String reviewId) {
        return ApiResponse.success(reviewService.getReviewReplies(reviewId));
    }

    @GetMapping("/{reviewId}/has-seller-reply")
    @Operation(summary = "Check if has seller reply - Public")
    public ApiResponse<Boolean> hasSellerReply(@PathVariable String reviewId) {
        return ApiResponse.success(reviewService.hasSellerReply(reviewId));
    }

    @GetMapping("/{reviewId}/votes/{type}")
    @Operation(summary = "Count votes by type - Public")
    public ApiResponse<Long> countVotesByType(@PathVariable String reviewId, @PathVariable String type) {
        VoteType voteType = VoteType.valueOf(type.toUpperCase());
        return ApiResponse.success(reviewService.countVotesByType(reviewId, voteType));
    }

    // ============ AUTHENTICATED USER ENDPOINTS ============

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create review - Require login")
    public ApiResponse<ReviewResponse> createReview(
            Authentication authentication,
            @Valid @RequestBody CreateReviewRequest request) {
        return ApiResponse.success(
                reviewService.createReview(authentication.getName(), request),
                "Review created successfully");
    }

    @PutMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update own review - Require login")
    public ApiResponse<ReviewResponse> updateReview(
            Authentication authentication,
            @PathVariable String reviewId,
            @Valid @RequestBody UpdateReviewRequest request) {
        return ApiResponse.success(
                reviewService.updateReview(authentication.getName(), reviewId, request),
                "Review updated successfully");
    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete own review - Require login")
    public ApiResponse<Void> deleteReview(
            Authentication authentication,
            @PathVariable String reviewId) {
        reviewService.deleteReview(authentication.getName(), reviewId);
        return ApiResponse.success("Review deleted successfully");
    }

    @PostMapping("/{reviewId}/vote")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Vote review - Require login")
    public ApiResponse<Void> voteReview(
            Authentication authentication,
            @PathVariable String reviewId,
            @RequestParam String voteType) {
        reviewService.voteReview(authentication.getName(), reviewId, voteType);
        return ApiResponse.success("Vote recorded");
    }

    @DeleteMapping("/{reviewId}/vote")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Remove vote - Require login")
    public ApiResponse<Void> removeVote(Authentication authentication, @PathVariable String reviewId) {
        reviewService.removeVote(authentication.getName(), reviewId);
        return ApiResponse.success("Vote removed");
    }

    @GetMapping("/user-book-review")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get user's own review for book/order - Require login")
    public ApiResponse<ReviewResponse> getUserBookReview(
            Authentication authentication,
            @RequestParam String bookId,
            @RequestParam String orderId) {
        return ApiResponse.success(reviewService.getUserBookReview(authentication.getName(), bookId, orderId));
    }

    @GetMapping("/{reviewId}/my-vote")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<String> getUserVoteForReview(Authentication authentication, @PathVariable String reviewId) {
        return ApiResponse.success(reviewService.getUserVoteForReview(authentication.getName(), reviewId));
    }

    @GetMapping("/{reviewId}/has-voted")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Boolean> hasUserVoted(Authentication authentication, @PathVariable String reviewId) {
        return ApiResponse.success(reviewService.hasUserVoted(authentication.getName(), reviewId));
    }

    // ============ ADMIN ONLY ============

    @PostMapping("/{reviewId}/reply")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Reply to review (Admin only)")
    public ApiResponse<Void> replyToReview(
            Authentication authentication,
            @PathVariable String reviewId,
            @Valid @RequestBody ReplyReviewRequest request) {
        reviewService.replyToReview(authentication.getName(), reviewId, request);
        return ApiResponse.success("Reply added successfully");
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get pending reviews (Admin)")
    public ApiResponse<PageResponse<ReviewResponse>> getPendingReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(reviewService.getPendingReviews(page, size));
    }


    @GetMapping("/global/top-helpful")
    @Operation(summary = "Get top helpful reviews from ALL books (public - for homepage)")
    public ApiResponse<PageResponse<ReviewResponse>> getGlobalTopHelpfulReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        return ApiResponse.success(reviewService.getGlobalTopHelpfulReviews(page, size));
    }

    @GetMapping("/global/featured")
    @Operation(summary = "Get featured reviews with images from ALL books (public - for testimonials)")
    public ApiResponse<PageResponse<ReviewResponse>> getGlobalFeaturedReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        return ApiResponse.success(reviewService.getGlobalFeaturedReviewsWithImages(page, size));
    }

    @GetMapping("/global/recent")
    @Operation(summary = "Get recent high-rated reviews from ALL books (public)")
    public ApiResponse<PageResponse<ReviewResponse>> getGlobalRecentReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(reviewService.getGlobalRecentHighRatedReviews(page, size));
    }
}