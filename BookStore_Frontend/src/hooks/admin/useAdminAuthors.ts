import { useState, useEffect } from 'react';
import { authorService } from '../../services';
import { type AuthorResponse, type AuthorRequest, type PageResponse } from '../../types';

export function useAuthors() {
    const [authors, setAuthors] = useState<PageResponse<AuthorResponse> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadAuthors = async (page: number = 0, size: number = 20) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await authorService.getAllAuthors(page, size);
            setAuthors(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load authors');
        } finally {
            setIsLoading(false);
        }
    };

    const searchAuthors = async (keyword: string, page: number = 0, size: number = 20) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await authorService.searchAuthors(keyword, page, size);
            setAuthors(data);
        } catch (err: any) {
            setError(err.message || 'Failed to search authors');
        } finally {
            setIsLoading(false);
        }
    };

    const createAuthor = async (data: AuthorRequest): Promise<AuthorResponse> => {
        setError(null);
        try {
            const newAuthor = await authorService.createAuthor(data);
            await loadAuthors();
            return newAuthor;
        } catch (err: any) {
            setError(err.message || 'Failed to create author');
            throw err;
        }
    };

    const updateAuthor = async (authorId: string, data: AuthorRequest): Promise<AuthorResponse> => {
        setError(null);
        try {
            const updatedAuthor = await authorService.updateAuthor(authorId, data);
            await loadAuthors();
            return updatedAuthor;
        } catch (err: any) {
            setError(err.message || 'Failed to update author');
            throw err;
        }
    };

    const deleteAuthor = async (authorId: string): Promise<void> => {
        setError(null);
        try {
            await authorService.deleteAuthor(authorId);
            await loadAuthors();
        } catch (err: any) {
            setError(err.message || 'Failed to delete author');
            throw err;
        }
    };

    const getAuthorById = async (authorId: string): Promise<AuthorResponse> => {
        setError(null);
        try {
            return await authorService.getAuthorById(authorId);
        } catch (err: any) {
            setError(err.message || 'Failed to get author');
            throw err;
        }
    };

    useEffect(() => {
        loadAuthors();
    }, []);

    return {
        authors,
        isLoading,
        error,
        loadAuthors,
        searchAuthors,
        createAuthor,
        updateAuthor,
        deleteAuthor,
        getAuthorById,
    };
}