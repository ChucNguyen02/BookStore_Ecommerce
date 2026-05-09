import { PaymentStatus, PaymentMethod, OrderStatus } from './enum';
import { type OrderItemResponse } from './order.types';

export interface OrderDetailResponse {
    id: string;
    orderCode: string;
    userId: string;
    userEmail: string;
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    pointsUsed: number;
    pointsDiscount: number;
    totalAmount: number;
    voucherCode: string | null;
    voucherDiscount: number | null;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    status: OrderStatus;
    note: string | null;
    cancelledReason: string | null;
    items: OrderItemResponse[];
    pointsEarned: number;
    transactionId: string | null;
    trackingNumber: string | null;
    createdAt: string;
    confirmedAt: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
    cancelledAt: string | null;
    canCancel: boolean;
    canReview: boolean;
}