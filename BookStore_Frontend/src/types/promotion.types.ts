import type { BookResponse } from './book.types';

export type PromotionTab = 'all' | 'sale' | 'bestseller' | 'new';

export interface PromotionFiltersType {
    minDiscount?: number;
    maxPrice?: number;
    categoryId?: string;
    sortBy?: 'discount' | 'newest' | 'popular';
}

export interface FeaturedDeal {
    id: string;
    title: string;
    slug: string;
    originalPrice: number;
    discountPrice: number;
    discountPercentage: number;
    imageUrl: string;
    stockQuantity: number;
    soldCount: number;
    badge?: string;
}

export interface FlashSaleData {
    title: string;
    endTime: string;
    books: BookResponse[];
    description?: string;
}