export const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type Role = typeof Role[keyof typeof Role];


export const AuthProvider = {
  LOCAL: 'LOCAL',
  GOOGLE: 'GOOGLE',
} as const;

export type AuthProvider = typeof AuthProvider[keyof typeof AuthProvider];


export const OrderStatus = {
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];


export const PaymentMethod = {
  COD: 'COD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  MOMO: 'MOMO',
  VNPAY: 'VNPAY',
  PAYOS: 'PAYOS',
  LOCAL: 'LOCAL',
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];


export const PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];


export const NotificationType = {
  ORDER: 'ORDER',
  PROMOTION: 'PROMOTION',
  SYSTEM: 'SYSTEM',
  REVIEW: 'REVIEW',
  WISHLIST: 'WISHLIST',
  POINTS: 'POINTS',
  QUESTION: 'QUESTION',
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];


export const Tier = {
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
} as const;

export type Tier = typeof Tier[keyof typeof Tier];


export const RewardType = {
  BOOK: 'BOOK',
  VOUCHER: 'VOUCHER',
  GIFT: 'GIFT',
} as const;

export type RewardType = typeof RewardType[keyof typeof RewardType];


export const RedemptionStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type RedemptionStatus = typeof RedemptionStatus[keyof typeof RedemptionStatus];


export const DiscountType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT',
} as const;

export type DiscountType = typeof DiscountType[keyof typeof DiscountType];


export const TransactionType = {
  EARN: 'EARN',
  REDEEM: 'REDEEM',
  EXPIRE: 'EXPIRE',
  REFUND: 'REFUND',
  BONUS: 'BONUS',
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];


export const ReferenceType = {
  ORDER: 'ORDER',
  REVIEW: 'REVIEW',
  DAILY_CHECK_IN: 'DAILY_CHECK_IN',
  REFERRAL: 'REFERRAL',
  REWARD_REDEMPTION: 'REWARD_REDEMPTION',
  ADMIN_ADJUSTMENT: 'ADMIN_ADJUSTMENT',
} as const;

export type ReferenceType = typeof ReferenceType[keyof typeof ReferenceType];


export const VoteType = {
  HELPFUL: 'HELPFUL',
  UNHELPFUL: 'UNHELPFUL',
} as const;

export type VoteType = typeof VoteType[keyof typeof VoteType];

export const VoucherDiscountType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT',
} as const;

export type VoucherDiscountType = typeof VoucherDiscountType[keyof typeof VoucherDiscountType];