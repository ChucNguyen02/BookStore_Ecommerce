import { Tier, TransactionType, ReferenceType } from './enum';

export interface PointsResponse {
    totalPoints: number;
    lifetimePoints: number;
    tier: Tier;
    pointsToNextTier: number | null;
    nextTier: string | null;
}

export interface PointsSummaryResponse {
    totalPoints: number;
    lifetimePoints: number;
    tier: Tier;
    pointsEarnedThisMonth: number;
    pointsRedeemedThisMonth: number;
    consecutiveCheckInDays: number;
    checkedInToday: boolean;
    totalCheckIns: number;
    totalRedemptions: number;
}

export interface PointTransactionResponse {
    id: string;
    points: number;
    type: TransactionType;
    referenceType: ReferenceType;
    referenceId: string | null;
    description: string | null;
    balanceAfter: number;
    createdAt: string;
}

export interface CheckInResponse {
    checkInDate: string;
    pointsEarned: number;
    bonusPoints: number;
    consecutiveDays: number;
    totalPoints: number;
    message: string | null;
    nextBonusAt: number | null;
}

export interface UsePointsRequest {
    points: number;
}

export interface UserPoints {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
    totalPoints: number;
    lifetimePoints: number;
    tier: Tier;
    tierUpdatedAt: string | null;
    createdAt: string;
    updatedAt: string;
}