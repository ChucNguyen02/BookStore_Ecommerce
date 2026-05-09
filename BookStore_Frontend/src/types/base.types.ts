export interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
}

export interface PageResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    empty: boolean;
    hasNext?: boolean;
    hasPrevious?: boolean;
}

export interface PaginationRequest {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
}