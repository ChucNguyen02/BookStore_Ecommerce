// hooks/admin/useAdminBooks.ts
import { useState, useEffect, useCallback } from 'react';
import { bookService } from '../../services/book.service';
import type { BookResponse, BookDetailResponse, BookRequest } from '../../types/book.types';
import type { PageResponse } from '../../types/base.types';

export const useAdminBooks = () => {
    const [books, setBooks] = useState<PageResponse<BookResponse> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBooks = useCallback(async (page: number = 0, size: number = 20) => {
        try {
            setIsLoading(true);
            const data = await bookService.getAllBooks(page, size);
            setBooks(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch books');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const searchBooks = useCallback(async (keyword: string, page: number = 0, size: number = 20) => {
        try {
            setIsLoading(true);
            const data = await bookService.searchBooks(keyword, page, size);
            setBooks(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to search books');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createBook = async (
        data: BookRequest,
        coverImage?: File,
        additionalImages?: File[]
    ): Promise<BookResponse> => {
        try {
            const result = await bookService.createBook(data, coverImage, additionalImages);
            return result;
        } catch (err: any) {
            throw new Error(err.message || 'Failed to create book');
        }
    };

    const updateBook = async (
        bookId: string,
        data: BookRequest,
        coverImage?: File,
        additionalImages?: File[],
        keepExistingImages: boolean = true
    ): Promise<BookResponse> => {
        try {
            const result = await bookService.updateBook(
                bookId,
                data,
                coverImage,
                additionalImages,
                keepExistingImages
            );
            return result;
        } catch (err: any) {
            throw new Error(err.message || 'Failed to update book');
        }
    };

    const deleteBook = async (bookId: string): Promise<void> => {
        try {
            await bookService.deleteBook(bookId);
        } catch (err: any) {
            throw new Error(err.message || 'Failed to delete book');
        }
    };

    const hardDeleteBook = async (bookId: string): Promise<void> => {
        try {
            await bookService.hardDeleteBook(bookId);
        } catch (err: any) {
            throw new Error(err.message || 'Failed to permanently delete book');
        }
    };

    const getBookById = async (id: string): Promise<BookDetailResponse> => {
        try {
            const result = await bookService.getBookById(id);
            return result;
        } catch (err: any) {
            throw new Error(err.message || 'Failed to get book detail');
        }
    };

    const addBookImages = async (bookId: string, images: File[]): Promise<string[]> => {
        try {
            const urls = await bookService.addBookImages(bookId, images);
            return urls;
        } catch (err: any) {
            throw new Error(err.message || 'Failed to add images');
        }
    };

    const deleteBookImage = async (bookId: string, imageUrl: string): Promise<void> => {
        try {
            await bookService.deleteBookImage(bookId, imageUrl);
        } catch (err: any) {
            throw new Error(err.message || 'Failed to delete image');
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    return {
        books,
        isLoading,
        error,
        fetchBooks,
        searchBooks,
        createBook,
        updateBook,
        deleteBook,
        hardDeleteBook,
        getBookById,
        addBookImages,
        deleteBookImage,
    };
};