export interface BestsellerBook {
    id: string;
    title: string;
    slug: string;
    isbn: string | null;
    price: number;
    discountPrice: number | null;
    discountPercentage: number | null;
    stockQuantity: number;
    coverImageUrl: string | null;
    categoryId: number;
    categoryName: string;
    authors: {
        id: string;
        name: string;
        avatarUrl: string | null;
    }[];
    averageRating: number;
    reviewCount: number;
    soldCount: number;
    isFeatured: boolean;
    isOnSale: boolean;
    inStock: boolean;
    createdAt: string;
}

export interface BestsellerFilters {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: 'soldCount' | 'price' | 'rating' | 'newest';
    sortDirection?: 'ASC' | 'DESC';
}

export type BestsellerPeriod = 'week' | 'month' | 'year' | 'all';

export interface BestsellerStats {
    period: BestsellerPeriod;
    totalSold: number;
    totalRevenue: number;
    topCategory: string;
}