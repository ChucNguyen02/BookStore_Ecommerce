import { PaymentStatus, PaymentMethod, OrderStatus } from './enum';

// ============= ORDER INTERFACES =============

export interface OrderItemResponse {
    id: string;
    bookId: string;
    bookTitle: string;
    bookSlug: string;
    bookImage: string | null;
    price: number;
    quantity: number;
    subtotal: number;
    canReview?: boolean;
    hasReviewed?: boolean;
}

export interface OrderResponse {
    id: string;
    orderCode: string;
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    itemCount: number;
    createdAt: string;
    deliveredAt: string | null;
    canCancel: boolean;
    canReview: boolean;
}

export interface CreateOrderRequest {
    // THÊM MỚI: Danh sách cart item IDs được chọn để checkout
    // Nếu null hoặc empty, sẽ checkout toàn bộ giỏ hàng
    selectedCartItemIds?: string[];
    
    // Shipping info
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    
    // Or use address ID
    addressId?: string;
    
    // Payment (COD, MOMO, VNPAY)
    paymentMethod: string;
    
    // Optional
    voucherCode?: string;
    pointsToUse?: number;
    note?: string;
}

export interface CancelOrderRequest {
    reason: string;
}

export interface UpdateOrderStatusRequest {
    status: string;
    note?: string;
    cancelledReason?: string;
}

export interface Order {
    id: string;
    orderCode: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    createdAt: string;
    deliveredAt: string | null;
}