import { RewardType, RedemptionStatus } from './enum';

export interface RewardItemResponse {
    id: string;
    name: string;
    description: string | null;
    type: RewardType;
    pointsRequired: number;
    imageUrl: string | null;
    bookId: string | null;
    bookTitle: string | null;
    voucherDiscountValue: number | null;
    voucherDiscountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | null;
    stockQuantity: number;
    claimedCount: number;
    isAvailable: boolean;
    startDate: string | null;
    endDate: string | null;
}

export interface UserRewardResponse {
    id: string;
    reward: RewardItemResponse;
    pointsSpent: number;
    status: RedemptionStatus;
    voucherCode: string | null;
    trackingNumber: string | null;
    shippingAddress: string | null;
    note: string | null;
    redeemedAt: string;
    completedAt: string | null;
}

export interface RedeemRewardRequest {
    rewardId: string;
    shippingAddress?: string;
    note?: string;
}

export interface RewardItemRequest {
    name: string;
    description?: string;
    type: string;
    pointsRequired: number;
    stockQuantity: number;
    imageUrl?: string;
    bookId?: string;
    voucherDiscountType?: string;
    voucherDiscountValue?: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}