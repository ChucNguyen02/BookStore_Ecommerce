export interface ReviewReplyResponse {
    id: string;
    replyText: string;
    replyBy: string;
    createdAt: string;
}

export interface ReviewResponse {
    id: string;
    rating: number;
    comment: string | null;
    userId: string;
    userName: string;
    userAvatar: string | null;
    bookId: string;
    bookTitle: string;
    isVerifiedPurchase: boolean;
    imageUrls: string[] | null;
    helpfulCount: number;
    unhelpfulCount: number;
    currentUserVote: string | null;
    sellerReply: ReviewReplyResponse | null;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewSummaryResponse {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
    ratingPercentages: Record<number, number>;
}

export interface CreateReviewRequest {
    bookId: string;
    orderId: string;
    rating: number;
    comment?: string;
    imageUrls?: string[];
}

export interface UpdateReviewRequest {
    rating: number;
    comment?: string;
}

export interface ReplyReviewRequest {
    replyText: string;
}

export interface ReviewFilterRequest {
    rating?: number;
    hasImages?: boolean;
    hasComment?: boolean;
    sortBy?: string;
    sortDirection?: string;
    page?: number;
    size?: number;
}

export interface VoteReviewRequest {
    vote: string;
}