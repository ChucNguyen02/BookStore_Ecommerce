import { useQuery } from '@tanstack/react-query';
import { authorService } from '../../services';
import type { AuthorResponse } from '../../types';
import type { PageResponse } from '../../types';

export const useAuthors = () => {
    const { data: topAuthorsData, isLoading: topLoading, error: topError } = useQuery({
        queryKey: ['authors', 'top'],
        queryFn: async () => {
            const data = await authorService.getTopAuthors(0, 8);
            return data;
        },
        staleTime: 10 * 60 * 1000,
    });

    const { data: allAuthorsData, isLoading: allLoading, error: allError } = useQuery({
        queryKey: ['authors', 'all'],
        queryFn: async () => {
            const data = await authorService.getAllAuthors(0, 8);
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 phút
    });

    const loading = topLoading || allLoading;
    const error = topError || allError;

    return {
        topAuthors: topAuthorsData?.content || [],
        allAuthors: allAuthorsData?.content || [],
        loading,
        error: error ? (error as Error).message : null
    };
};

// Hook để lấy tất cả tác giả với phân trang (dùng cho trang Authors)
export const useAuthorsPaginated = (page: number = 0, size: number = 20) => {
    return useQuery<PageResponse<AuthorResponse>>({
        queryKey: ['authors', 'paginated', page, size],
        queryFn: () => authorService.getAllAuthors(page, size),
        staleTime: 5 * 60 * 1000,
    });
};

// Hook để lấy chi tiết tác giả
export const useAuthorDetail = (authorId: string | undefined) => {
    return useQuery<AuthorResponse>({
        queryKey: ['authors', 'detail', authorId],
        queryFn: () => authorService.getAuthorById(authorId!),
        enabled: !!authorId,
        staleTime: 5 * 60 * 1000,
    });
};

// Hook để tìm kiếm tác giả
export const useSearchAuthors = (keyword: string, page: number = 0, size: number = 20) => {
    return useQuery<PageResponse<AuthorResponse>>({
        queryKey: ['authors', 'search', keyword, page, size],
        queryFn: () => authorService.searchAuthors(keyword, page, size),
        enabled: keyword.length > 0,
        staleTime: 2 * 60 * 1000,
    });
};

// Hook để lấy top tác giả với phân trang
export const useTopAuthorsPaginated = (page: number = 0, size: number = 20) => {
    return useQuery<PageResponse<AuthorResponse>>({
        queryKey: ['authors', 'top-paginated', page, size],
        queryFn: () => authorService.getTopAuthors(page, size),
        staleTime: 10 * 60 * 1000,
    });
};

// Hook để lấy tác giả theo tên
export const useAuthorByName = (name: string | undefined) => {
    return useQuery<AuthorResponse>({
        queryKey: ['authors', 'name', name],
        queryFn: () => authorService.getAuthorByName(name!),
        enabled: !!name && name.length > 0,
        staleTime: 5 * 60 * 1000,
    });
};