package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.request.CreateReviewRequest;
import chucnguyen.bookstore.dto.request.ReplyReviewRequest;
import chucnguyen.bookstore.dto.request.ReviewFilterRequest;
import chucnguyen.bookstore.dto.request.UpdateReviewRequest;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.dto.response.ReviewReplyResponse;
import chucnguyen.bookstore.dto.response.ReviewResponse;
import chucnguyen.bookstore.dto.response.ReviewSummaryResponse;
import chucnguyen.bookstore.entity.*;
import chucnguyen.bookstore.entity.enums.ReferenceType;
import chucnguyen.bookstore.entity.enums.Role;
import chucnguyen.bookstore.entity.enums.VoteType;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.ReviewMapper;
import chucnguyen.bookstore.mapper.ReviewReplyMapper;
import chucnguyen.bookstore.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final ReviewVoteRepository reviewVoteRepository;
    private final ReviewReplyRepository reviewReplyRepository;
    private final ReviewMapper reviewMapper;
    private final ReviewReplyMapper reviewReplyMapper;
    private final PointsService pointsService;
    private final FileUploadService fileUploadService;

    @Value("${points.review-text:20}")
    private Integer reviewTextPoints;

    @Value("${points.review-with-image:50}")
    private Integer reviewWithImagePoints;

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "reviews", allEntries = true),
            @CacheEvict(value = "books", allEntries = true)
    })
    public ReviewResponse createReview(String email, CreateReviewRequest request) {
        log.info("Creating review for book {} by user: {}", request.getBookId(), email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // Check if already reviewed
        if (reviewRepository.existsByUserIdAndBookIdAndOrderId(user.getId(), book.getId(), order.getId())) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        // Check if user purchased this book
        if (!orderRepository.hasUserPurchasedBook(user.getId(), book.getId())) {
            throw new AppException(ErrorCode.USER_HAS_NOT_PURCHASED);
        }

        // Create review
        Review review = reviewMapper.toReview(request);
        review.setUser(user);
        review.setBook(book);
        review.setOrder(order);
        review = reviewRepository.save(review);

        // Save images if provided
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ReviewImage image = ReviewImage.builder()
                        .review(review)
                        .imageUrl(request.getImageUrls().get(i))
                        .displayOrder(i)
                        .build();
                reviewImageRepository.save(image);
            }
        }

        // Award points
        int points = request.getImageUrls() != null && !request.getImageUrls().isEmpty()
                ? reviewWithImagePoints
                : reviewTextPoints;

        pointsService.addPoints(user, points, ReferenceType.REVIEW, review.getId(),
                "Review for book: " + book.getTitle());

        // Update book rating
        updateBookRating(book.getId());

        log.info("Review created successfully");

        ReviewResponse response = reviewMapper.toReviewResponse(review);
        if (request.getImageUrls() != null) {
            response.setImageUrls(request.getImageUrls());
        }

        return response;
    }

    @Transactional
    @Cacheable(value = "reviews", key = "'book_' + #bookId + '_' + #filter.page + '_' + #filter.size")
    public PageResponse<ReviewResponse> getBookReviews(String bookId, ReviewFilterRequest filter) {
        Sort sort = Sort.by(
                filter.getSortDirection().equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC,
                filter.getSortBy()
        );

        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);

        Page<Review> reviews;

        if (filter.getRating() != null) {
            reviews = reviewRepository.findByBookIdAndRatingAndIsHiddenFalseOrderByCreatedAtDesc(
                    bookId, filter.getRating(), pageable);
        } else if (Boolean.TRUE.equals(filter.getHasImages())) {
            reviews = reviewRepository.findReviewsWithImages(bookId, pageable);
        } else {
            reviews = reviewRepository.findByBookIdAndIsHiddenFalseOrderByCreatedAtDesc(bookId, pageable);
        }

        Page<ReviewResponse> responsePage = reviews.map(review -> {
            ReviewResponse response = reviewMapper.toReviewResponse(review);

            // Get images
            List<String> imageUrls = reviewImageRepository.findByReviewIdOrderByDisplayOrderAsc(review.getId())
                    .stream().map(ReviewImage::getImageUrl).toList();
            response.setImageUrls(imageUrls);

            return response;
        });

        return PageResponse.from(responsePage);
    }

    @Transactional
    @Cacheable(value = "reviews", key = "'summary_' + #bookId")
    public ReviewSummaryResponse getReviewSummary(String bookId) {
        BigDecimal avgRating = reviewRepository.calculateAverageRating(bookId);
        long totalReviews = reviewRepository.countByBookIdAndIsHiddenFalse(bookId);

        List<Object[]> distribution = reviewRepository.countReviewsByRating(bookId);

        Map<Integer, Integer> ratingDistribution = new HashMap<>();
        Map<Integer, Double> ratingPercentages = new HashMap<>();

        for (Object[] row : distribution) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            ratingDistribution.put(rating, count.intValue());

            double percentage = totalReviews > 0 ? (count * 100.0 / totalReviews) : 0;
            ratingPercentages.put(rating, Math.round(percentage * 10.0) / 10.0);
        }

        return ReviewSummaryResponse.builder()
                .averageRating(avgRating != null ? avgRating : BigDecimal.ZERO)
                .totalReviews((int) totalReviews)
                .ratingDistribution(ratingDistribution)
                .ratingPercentages(ratingPercentages)
                .build();
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "reviews", allEntries = true),
            @CacheEvict(value = "books", allEntries = true)
    })
    public ReviewResponse updateReview(String email, String reviewId, UpdateReviewRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        // Check ownership
        if (!review.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        reviewMapper.updateReviewFromRequest(request, review);
        review = reviewRepository.save(review);

        // Update book rating
        updateBookRating(review.getBook().getId());

        return reviewMapper.toReviewResponse(review);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "reviews", allEntries = true),
            @CacheEvict(value = "books", allEntries = true)
    })
    public void deleteReview(String email, String reviewId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        // Check ownership
        if (!review.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        String bookId = review.getBook().getId();
        reviewRepository.delete(review);

        // Update book rating
        updateBookRating(bookId);
    }

    @Transactional
    @CacheEvict(value = "reviews", allEntries = true)
    public void voteReview(String email, String reviewId, String voteType) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        VoteType vote = VoteType.valueOf(voteType);

        ReviewVote existingVote = reviewVoteRepository.findByReviewIdAndUserId(reviewId, user.getId())
                .orElse(null);

        if (existingVote != null) {
            // Update vote counts
            if (existingVote.getVote() == VoteType.HELPFUL) {
                reviewRepository.decrementHelpfulCount(reviewId);
            } else {
                reviewRepository.decrementUnhelpfulCount(reviewId);
            }

            // Update or delete vote
            if (existingVote.getVote() == vote) {
                reviewVoteRepository.delete(existingVote);
                return;
            } else {
                existingVote.setVote(vote);
                reviewVoteRepository.save(existingVote);
            }
        } else {
            ReviewVote newVote = ReviewVote.builder()
                    .review(review)
                    .user(user)
                    .vote(vote)
                    .build();
            reviewVoteRepository.save(newVote);
        }

        // Update counts
        if (vote == VoteType.HELPFUL) {
            reviewRepository.incrementHelpfulCount(reviewId);
        } else {
            reviewRepository.incrementUnhelpfulCount(reviewId);
        }
    }

    @Transactional
    @CacheEvict(value = "reviews", allEntries = true)
    public void replyToReview(String email, String reviewId, ReplyReviewRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (user.getRole() != Role.ADMIN) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        ReviewReply reply = reviewReplyMapper.toReviewReply(request);
        reply.setReview(review);
        reply.setUser(user);
        reviewReplyRepository.save(reply);
    }

    private void updateBookRating(String bookId) {
        BigDecimal avgRating = reviewRepository.calculateAverageRating(bookId);
        int reviewCount = (int) reviewRepository.countByBookIdAndIsHiddenFalse(bookId);

        if (avgRating != null) {
            avgRating = avgRating.setScale(2, RoundingMode.HALF_UP);
        } else {
            avgRating = BigDecimal.ZERO;
        }

        bookRepository.updateRating(bookId, avgRating, reviewCount);
    }

    public ReviewResponse getUserBookReview(String email, String bookId, String orderId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Review review = reviewRepository.findByUserIdAndBookIdAndOrderId(user.getId(), bookId, orderId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        ReviewResponse response = reviewMapper.toReviewResponse(review);

        List<String> imageUrls = reviewImageRepository
                .findByReviewIdOrderByDisplayOrderAsc(review.getId())
                .stream()
                .map(ReviewImage::getImageUrl)
                .toList();
        response.setImageUrls(imageUrls);

        return response;
    }

    @Transactional
    @Cacheable(value = "reviews", key = "'top_' + #bookId + '_' + #page + '_' + #size")
    public PageResponse<ReviewResponse> getTopHelpfulReviews(String bookId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviews = reviewRepository.findTopHelpfulReviews(bookId, pageable);

        Page<ReviewResponse> responsePage = reviews.map(review -> {
            ReviewResponse response = reviewMapper.toReviewResponse(review);
            List<String> imageUrls = reviewImageRepository
                    .findByReviewIdOrderByDisplayOrderAsc(review.getId())
                    .stream()
                    .map(ReviewImage::getImageUrl)
                    .toList();
            response.setImageUrls(imageUrls);
            return response;
        });

        return PageResponse.from(responsePage);
    }

    public PageResponse<ReviewResponse> getPendingReviews(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviews = reviewRepository.findByIsApprovedFalseOrderByCreatedAtDesc(pageable);

        Page<ReviewResponse> responsePage = reviews.map(reviewMapper::toReviewResponse);
        return PageResponse.from(responsePage);
    }

    public String getUserVoteForReview(String email, String reviewId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return reviewVoteRepository.findByReviewIdAndUserId(reviewId, user.getId())
                .map(vote -> vote.getVote().name())
                .orElse(null);
    }

    public boolean hasUserVoted(String email, String reviewId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return reviewVoteRepository.existsByReviewIdAndUserId(reviewId, user.getId());
    }

    @Transactional
    public void removeVote(String email, String reviewId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        ReviewVote vote = reviewVoteRepository.findByReviewIdAndUserId(reviewId, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST, "No vote found"));

        if (vote.getVote() == VoteType.HELPFUL) {
            reviewRepository.decrementHelpfulCount(reviewId);
        } else {
            reviewRepository.decrementUnhelpfulCount(reviewId);
        }

        reviewVoteRepository.deleteByReviewIdAndUserId(reviewId, user.getId());
    }

    public long countVotesByType(String reviewId, VoteType voteType) {
        return reviewVoteRepository.countByReviewIdAndVote(reviewId, voteType);
    }

    public long countReviewImages(String reviewId) {
        return reviewImageRepository.countByReviewId(reviewId);
    }

    @Transactional
    public void deleteReviewImages(String reviewId) {
        List<ReviewImage> images = reviewImageRepository.findByReviewIdOrderByDisplayOrderAsc(reviewId);
        images.forEach(image -> fileUploadService.deleteImage(image.getImageUrl()));
        reviewImageRepository.deleteByReviewId(reviewId);
    }

    public List<ReviewReplyResponse> getReviewReplies(String reviewId) {
        List<ReviewReply> replies = reviewReplyRepository.findByReviewIdOrderByCreatedAtAsc(reviewId);
        return replies.stream()
                .map(reviewReplyMapper::toReviewReplyResponse)
                .toList();
    }

    public boolean hasSellerReply(String reviewId) {
        return reviewReplyRepository.hasSellerReply(reviewId);
    }

    @Transactional
    public void deleteReviewReplies(String reviewId) {
        reviewReplyRepository.deleteByReviewId(reviewId);
    }

    /**
     * Get top helpful reviews from ALL books (for homepage/testimonials)
     */
    @Transactional
    public PageResponse<ReviewResponse> getGlobalTopHelpfulReviews(int page, int size) {
        log.info("Fetching global top helpful reviews - page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviews = reviewRepository.findGlobalTopHelpfulReviews(pageable);

        Page<ReviewResponse> responsePage = reviews.map(reviewMapper::toReviewResponse);
        return PageResponse.from(responsePage);
    }

    /**
     * Get featured reviews with images from ALL books
     */
    @Transactional
    public PageResponse<ReviewResponse> getGlobalFeaturedReviewsWithImages(int page, int size) {
        log.info("Fetching global featured reviews with images - page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviews = reviewRepository.findGlobalFeaturedReviewsWithImages(pageable);

        Page<ReviewResponse> responsePage = reviews.map(reviewMapper::toReviewResponse);
        return PageResponse.from(responsePage);
    }

    /**
     * Get recent high-rated reviews from ALL books
     */
    @Transactional
    public PageResponse<ReviewResponse> getGlobalRecentHighRatedReviews(int page, int size) {
        log.info("Fetching global recent high-rated reviews - page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviews = reviewRepository.findGlobalRecentHighRatedReviews(pageable);

        Page<ReviewResponse> responsePage = reviews.map(reviewMapper::toReviewResponse);
        return PageResponse.from(responsePage);
    }
}