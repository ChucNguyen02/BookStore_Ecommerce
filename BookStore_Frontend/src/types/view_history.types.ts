export interface ViewHistoryResponse {
    bookId: string;
    bookTitle: string;
    bookSlug: string;
    bookImage: string | null;
    viewCount: number;
    lastViewedAt: string;
}