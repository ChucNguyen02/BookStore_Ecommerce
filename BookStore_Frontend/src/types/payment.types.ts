export interface PaymentRequest {
    orderCode: string;
    ipAddress?: string;
}

export interface PaymentResponse {
    paymentUrl: string;
    orderCode: string;
    amount: number;
    message?: string;
}