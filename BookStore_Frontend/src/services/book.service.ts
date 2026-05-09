import apiClient from './api.client';
import { type PageResponse, } from '../types/base.types';

import {
    type BookResponse,
    type BookDetailResponse,
    type BookRequest,
    type BookFilterRequest,
} from '../types/book.types';

class BookService {
    private readonly BASE_URL = '/books';

    private unwrapResult<T>(result: T | null | undefined, endpoint: string): T {
        if (result === null || result === undefined) {
            throw new Error(`Invalid API response from ${endpoint}: missing result`);
        }
        return result;
    }

    private normalizePageResponse<T>(
        page: Partial<PageResponse<T>> | null | undefined,
        endpoint: string
    ): PageResponse<T> {
        if (!page || !Array.isArray(page.content)) {
            throw new Error(`Invalid page response from ${endpoint}: missing content array`);
        }

        return {
            content: page.content,
            pageNumber: page.pageNumber ?? 0,
            pageSize: page.pageSize ?? page.content.length,
            totalElements: page.totalElements ?? page.content.length,
            totalPages: page.totalPages ?? 1,
            first: page.first ?? true,
            last: page.last ?? true,
            empty: page.empty ?? false,
            hasNext: page.hasNext ?? false,
            hasPrevious: page.hasPrevious ?? false,
        };
    }

    async getAllBooks(page: number = 0, size: number = 20): Promise<PageResponse<BookResponse>> {
        const response = await apiClient.get<PageResponse<BookResponse>>(
            this.BASE_URL,
            { params: { page, size } }
        );
        return this.normalizePageResponse(this.unwrapResult(response.result, this.BASE_URL), this.BASE_URL);
    }

    async getBookById(id: string): Promise<BookDetailResponse> {
        const response = await apiClient.get<BookDetailResponse>(
            `${this.BASE_URL}/id/${id}`
        );
        return response.result!;
    }

    async getBookDetail(slug: string): Promise<BookDetailResponse> {
        const response = await apiClient.get<BookDetailResponse>(
            `${this.BASE_URL}/${slug}`
        );
        return response.result!;
    }

    async searchBooks(
        keyword: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<BookResponse>> {
        const response = await apiClient.get<PageResponse<BookResponse>>(
            `${this.BASE_URL}/search`,
            { params: { keyword, page, size } }
        );
        return response.result!;
    }

    async filterBooks(filter: BookFilterRequest): Promise<PageResponse<BookResponse>> {
        const response = await apiClient.post<PageResponse<BookResponse>>(
            `${this.BASE_URL}/filter`,
            filter
        );
        const endpoint = `${this.BASE_URL}/filter`;
        return this.normalizePageResponse(this.unwrapResult(response.result, endpoint), endpoint);
    }

    async getFeaturedBooks(limit: number = 10): Promise<BookResponse[]> {
        const response = await apiClient.get<BookResponse[]>(
            `${this.BASE_URL}/featured`,
            { params: { limit } }
        );
        return this.unwrapResult(response.result, `${this.BASE_URL}/featured`);
    }

    async getBestSellers(page: number = 0, size: number = 20): Promise<PageResponse<BookResponse>> {
        const response = await apiClient.get<PageResponse<BookResponse>>(
            `${this.BASE_URL}/bestsellers`,
            { params: { page, size } }
        );
        const endpoint = `${this.BASE_URL}/bestsellers`;
        return this.normalizePageResponse(this.unwrapResult(response.result, endpoint), endpoint);
    }

    async getNewArrivals(page: number = 0, size: number = 20): Promise<PageResponse<BookResponse>> {
        const response = await apiClient.get<PageResponse<BookResponse>>(
            `${this.BASE_URL}/new-arrivals`,
            { params: { page, size } }
        );
        const endpoint = `${this.BASE_URL}/new-arrivals`;
        return this.normalizePageResponse(this.unwrapResult(response.result, endpoint), endpoint);
    }

    async getBooksOnSale(page: number = 0, size: number = 20): Promise<PageResponse<BookResponse>> {
        const response = await apiClient.get<PageResponse<BookResponse>>(
            `${this.BASE_URL}/on-sale`,
            { params: { page, size } }
        );
        const endpoint = `${this.BASE_URL}/on-sale`;
        return this.normalizePageResponse(this.unwrapResult(response.result, endpoint), endpoint);
    }

    async getBooksByCategory(
        categoryId: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<BookResponse>> {
        const response = await apiClient.get<PageResponse<BookResponse>>(
            `${this.BASE_URL}/category/${categoryId}`,
            { params: { page, size } }
        );
        const endpoint = `${this.BASE_URL}/category/${categoryId}`;
        return this.normalizePageResponse(this.unwrapResult(response.result, endpoint), endpoint);
    }

    async getBooksByAuthor(
        authorId: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<BookResponse>> {
        const response = await apiClient.get<PageResponse<BookResponse>>(
            `${this.BASE_URL}/author/${authorId}`,
            { params: { page, size } }
        );
        const endpoint = `${this.BASE_URL}/author/${authorId}`;
        return this.normalizePageResponse(this.unwrapResult(response.result, endpoint), endpoint);
    }

    async getRelatedBooks(bookId: string, limit: number = 10): Promise<BookResponse[]> {
        const response = await apiClient.get<BookResponse[]>(
            `${this.BASE_URL}/${bookId}/related`,
            { params: { limit } }
        );
        return response.result!;
    }

    async getTopRatedBooks(limit: number = 10): Promise<BookResponse[]> {
        const response = await apiClient.get<BookResponse[]>(
            `${this.BASE_URL}/top-rated`,
            { params: { limit } }
        );
        return response.result!;
    }

    async getBookByIsbn(isbn: string): Promise<BookResponse> {
        const response = await apiClient.get<BookResponse>(
            `${this.BASE_URL}/isbn/${isbn}`
        );
        return response.result!;
    }

    async checkStockAvailability(bookId: string, quantity: number): Promise<boolean> {
        const response = await apiClient.get<boolean>(
            `${this.BASE_URL}/${bookId}/check-stock`,
            { params: { quantity } }
        );
        return response.result!;
    }

    async getAvailableLanguages(): Promise<string[]> {
        const response = await apiClient.get<string[]>(
            `${this.BASE_URL}/languages`
        );
        return response.result!;
    }

    async createBook(
        data: BookRequest,
        coverImage?: File,
        additionalImages?: File[]
    ): Promise<BookResponse> {
        const formData = new FormData();

        // Append book data as JSON fields
        formData.append('title', data.title);
        if (data.isbn) formData.append('isbn', data.isbn);
        if (data.description) formData.append('description', data.description);
        formData.append('price', data.price.toString());
        if (data.discountPrice) formData.append('discountPrice', data.discountPrice.toString());
        formData.append('stockQuantity', data.stockQuantity.toString());
        if (data.pages) formData.append('pages', data.pages.toString());
        if (data.publisher) formData.append('publisher', data.publisher);
        if (data.publishYear) formData.append('publishYear', data.publishYear.toString());
        if (data.language) formData.append('language', data.language);
        formData.append('categoryId', data.categoryId.toString());

        // Append author IDs
        data.authorIds.forEach(id => formData.append('authorIds', id));

        formData.append('isFeatured', (data.isFeatured ?? false).toString());
        formData.append('isActive', (data.isActive ?? true).toString());

        // Append cover image
        if (coverImage) {
            formData.append('coverImage', coverImage);
        }

        // Append additional images
        if (additionalImages && additionalImages.length > 0) {
            additionalImages.forEach(file => {
                formData.append('additionalImages', file);
            });
        }

        const response = await apiClient.post<BookResponse>(
            this.BASE_URL,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.result!;
    }

    async updateBook(
        bookId: string,
        data: BookRequest,
        coverImage?: File,
        additionalImages?: File[],
        keepExistingImages: boolean = true
    ): Promise<BookResponse> {
        const formData = new FormData();

        // Append book data
        formData.append('title', data.title);
        if (data.isbn) formData.append('isbn', data.isbn);
        if (data.description) formData.append('description', data.description);
        formData.append('price', data.price.toString());
        if (data.discountPrice) formData.append('discountPrice', data.discountPrice.toString());
        formData.append('stockQuantity', data.stockQuantity.toString());
        if (data.pages) formData.append('pages', data.pages.toString());
        if (data.publisher) formData.append('publisher', data.publisher);
        if (data.publishYear) formData.append('publishYear', data.publishYear.toString());
        if (data.language) formData.append('language', data.language);
        formData.append('categoryId', data.categoryId.toString());

        data.authorIds.forEach(id => formData.append('authorIds', id));

        formData.append('isFeatured', (data.isFeatured ?? false).toString());
        formData.append('isActive', (data.isActive ?? true).toString());
        formData.append('keepExistingImages', keepExistingImages.toString());

        // Append images
        if (coverImage) {
            formData.append('coverImage', coverImage);
        }

        if (additionalImages && additionalImages.length > 0) {
            additionalImages.forEach(file => {
                formData.append('additionalImages', file);
            });
        }

        const response = await apiClient.put<BookResponse>(
            `${this.BASE_URL}/${bookId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.result!;
    }

    async addBookImages(bookId: string, images: File[]): Promise<string[]> {
        const formData = new FormData();
        images.forEach(file => {
            formData.append('images', file);
        });

        const response = await apiClient.post<string[]>(
            `${this.BASE_URL}/${bookId}/images`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.result!;
    }

    async deleteBookImage(bookId: string, imageUrl: string): Promise<void> {
        await apiClient.delete<void>(
            `${this.BASE_URL}/${bookId}/images`,
            { params: { imageUrl } }
        );
    }

    async hardDeleteBook(bookId: string): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/${bookId}/hard-delete`);
    }

    async deleteBook(bookId: string): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/${bookId}`);
    }
}

export const bookService = new BookService();
export default bookService;