import { type PaymentMethod } from './enum';
import { type AddressResponse } from './address.types';
import { type VoucherResponse } from './voucher.types';

export interface CheckoutFormData {
    addressId?: string;
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    paymentMethod: PaymentMethod;
    voucherCode?: string;
    pointsToUse: number;
    note?: string;
}

export interface CheckoutSummary {
    subtotal: number;
    shippingFee: number;
    voucherDiscount: number;
    pointsDiscount: number;
    totalAmount: number;
    pointsToEarn: number;
}

export interface CheckoutState {
    selectedAddress: AddressResponse | null;
    appliedVoucher: VoucherResponse | null;
    pointsToUse: number;
    paymentMethod: PaymentMethod;
    note: string;
}