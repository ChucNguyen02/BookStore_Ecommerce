import apiClient from './api.client';
import { type PageResponse } from '../types';
import {
    type ReviewResponse,
    type ReviewSummaryResponse,
    type CreateReviewRequest,
    type UpdateReviewRequest,
    type ReplyReviewRequest,
    type ReviewFilterRequest,
    type ReviewReplyResponse,
} from '../types/review.types';

class ReviewService {
    private readonly BASE_URL = '/reviews';

    async createReview(data: CreateReviewRequest): Promise<ReviewResponse> {
        const response = await apiClient.post<ReviewResponse>(this.BASE_URL, data);
        return response.result!;
    }

    async getBookReviews(
        bookId: string,
        filter?: ReviewFilterRequest
    ): Promise<PageResponse<ReviewResponse>> {
        const response = await apiClient.get<PageResponse<ReviewResponse>>(
            `${this.BASE_URL}/book/${bookId}`,
            filter ? { params: filter } : undefined
        );
        return response.result!;
    }

    async getReviewSummary(bookId: string): Promise<ReviewSummaryResponse> {
        const response = await apiClient.get<ReviewSummaryResponse>(
            `${this.BASE_URL}/book/${bookId}/summary`
        );
        return response.result!;
    }

    async updateReview(
        reviewId: string,
        data: UpdateReviewRequest
    ): Promise<ReviewResponse> {
        const response = await apiClient.put<ReviewResponse>(
            `${this.BASE_URL}/${reviewId}`,
            data
        );
        return response.result!;
    }

    async deleteReview(reviewId: string): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/${reviewId}`);
    }

    async voteReview(reviewId: string, voteType: string): Promise<void> {
        await apiClient.post<void>(
            `${this.BASE_URL}/${reviewId}/vote`,
            undefined,
            { params: { voteType } }
        );
    }

    async getUserBookReview(bookId: string, orderId: string): Promise<ReviewResponse> {
        const response = await apiClient.get<ReviewResponse>(
            `${this.BASE_URL}/user-book-review`,
            { params: { bookId, orderId } }
        );
        return response.result!;
    }

    async getTopHelpfulReviews(
        bookId: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<ReviewResponse>> {
        const response = await apiClient.get<PageResponse<ReviewResponse>>(
            `${this.BASE_URL}/book/${bookId}/top-helpful`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getUserVoteForReview(reviewId: string): Promise<string | null> {
        const response = await apiClient.get<string | null>(
            `${this.BASE_URL}/${reviewId}/my-vote`
        );
        return response.result ?? null;
    }

    async hasUserVoted(reviewId: string): Promise<boolean> {
        const response = await apiClient.get<boolean>(
            `${this.BASE_URL}/${reviewId}/has-voted`
        );
        return response.result!;
    }

    async removeVote(reviewId: string): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/${reviewId}/vote`);
    }

    async countVotesByType(reviewId: string, type: string): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/${reviewId}/votes/${type}`
        );
        return response.result!;
    }

    async getReviewReplies(reviewId: string): Promise<ReviewReplyResponse[]> {
        const response = await apiClient.get<ReviewReplyResponse[]>(
            `${this.BASE_URL}/${reviewId}/replies`
        );
        return response.result!;
    }

    async hasSellerReply(reviewId: string): Promise<boolean> {
        const response = await apiClient.get<boolean>(
            `${this.BASE_URL}/${reviewId}/has-seller-reply`
        );
        return response.result!;
    }

    async replyToReview(reviewId: string, data: ReplyReviewRequest): Promise<void> {
        await apiClient.post<void>(`${this.BASE_URL}/${reviewId}/reply`, data);
    }

    async getPendingReviews(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<ReviewResponse>> {
        const response = await apiClient.get<PageResponse<ReviewResponse>>(
            `${this.BASE_URL}/pending`,
            { params: { page, size } }
        );
        return response.result!;
    }

    /**
 * Get top helpful reviews from ALL books (for homepage)
 */
    async getGlobalTopHelpfulReviews(
        page: number = 0,
        size: number = 6
    ): Promise<PageResponse<ReviewResponse>> {
        const response = await apiClient.get<PageResponse<ReviewResponse>>(
            `${this.BASE_URL}/global/top-helpful`,
            { params: { page, size } }
        );
        return response.result!;
    }

    /**
     * Get featured reviews with images from ALL books (for testimonials)
     */
    async getGlobalFeaturedReviews(
        page: number = 0,
        size: number = 3
    ): Promise<PageResponse<ReviewResponse>> {
        const response = await apiClient.get<PageResponse<ReviewResponse>>(
            `${this.BASE_URL}/global/featured`,
            { params: { page, size } }
        );
        return response.result!;
    }

    /**
     * Get recent high-rated reviews from ALL books
     */
    async getGlobalRecentReviews(
        page: number = 0,
        size: number = 10
    ): Promise<PageResponse<ReviewResponse>> {
        const response = await apiClient.get<PageResponse<ReviewResponse>>(
            `${this.BASE_URL}/global/recent`,
            { params: { page, size } }
        );
        return response.result!;
    }
}

export const reviewService = new ReviewService();
export default reviewService;