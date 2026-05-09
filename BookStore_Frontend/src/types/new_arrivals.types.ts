export interface NewArrivalBook {
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

export interface NewArrivalFilters {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    language?: string;
    sortBy?: 'newest' | 'price' | 'rating' | 'popular';
    sortDirection?: 'ASC' | 'DESC';
}

export type NewArrivalTimePeriod = 'today' | 'week' | 'month' | 'all';

export interface NewArrivalHighlight {
    id: string;
    title: string;
    slug: string;
    coverImageUrl: string | null;
    price: number;
    discountPrice: number | null;
    categoryName: string;
    authors: string[];
    isNew: boolean;
}