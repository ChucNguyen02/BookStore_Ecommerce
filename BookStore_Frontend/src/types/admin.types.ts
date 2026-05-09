import { type RedemptionStatus } from './enum';

export interface UpdateRedemptionStatusRequest {
    status: RedemptionStatus;
    trackingNumber?: string;
    note?: string;
}

export interface RewardStatistics {
    totalRewards: number;
    totalRedemptions: number;
    totalPointsSpent: number;
    pendingRedemptions: number;
    completedRedemptions: number;
}

export interface VoucherStatistics {
    totalVouchers: number;
    activeVouchers: number;
    totalUsed: number;
    expiringVouchers: number;
}