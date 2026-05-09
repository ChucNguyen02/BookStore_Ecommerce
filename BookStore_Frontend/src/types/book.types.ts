import { type AuthorSimpleResponse, type AuthorResponse } from './author.types';
import { type CategorySimpleResponse } from './category.types';

export interface BookResponse {
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
    authors: AuthorSimpleResponse[];
    averageRating: number;
    reviewCount: number;
    soldCount: number;
    isFeatured: boolean;
    isOnSale: boolean;
    inStock: boolean;
    createdAt: string;
    categorySlug: string;
}

export interface BookDetailResponse {
    id: string;
    title: string;
    slug: string;
    isbn: string | null;
    description: string | null;
    price: number;
    discountPrice: number | null;
    discountPercentage: number | null;
    stockQuantity: number;
    pages: number | null;
    publisher: string | null;
    publishYear: number | null;
    language: string;
    coverImageUrl: string | null;
    imageUrls: string[];
    category: CategorySimpleResponse;
    authors: AuthorResponse[];
    averageRating: number;
    reviewCount: number;
    soldCount: number;
    viewCount: number;
    isFeatured: boolean;
    isActive: boolean;
    inStock: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BookRequest {
    title: string;
    isbn?: string | null;
    description?: string | null;
    price: number;
    discountPrice?: number | null;
    stockQuantity: number;
    pages?: number | null;
    publisher?: string | null;
    publishYear?: number | null;
    language?: string;
    categoryId: string;
    authorIds: string[];
    isFeatured?: boolean;
    isActive?: boolean;
}

export interface BookFilterRequest {
    keyword?: string;
    categoryId?: string;
    authorId?: string;
    minPrice?: number;
    maxPrice?: number;
    language?: string;
    isFeatured?: boolean;
    onSale?: boolean;
    minRating?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
}