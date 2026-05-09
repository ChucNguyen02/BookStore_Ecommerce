import { DiscountType } from './enum';

export interface VoucherResponse {
    id: string;
    code: string;
    description: string | null;
    discountType: DiscountType;
    discountValue: number;
    minOrderValue: number;
    maxDiscountAmount: number | null;
    usageLimit: number | null;
    usedCount: number;
    remainingUses: number | null;
    startDate: string;
    endDate: string;
    isValid: boolean;
    isPersonal: boolean;
}

export interface VoucherRequest {
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    minOrderValue: number;
    maxDiscountAmount?: number;
    usageLimit?: number;
    userId?: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
}