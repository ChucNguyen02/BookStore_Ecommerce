import apiClient from './api.client';
import { type PageResponse } from '../types';
import { type BookResponse } from '../types';

class ViewHistoryService {
    private readonly BASE_URL = '/view-history';

    async recordView(bookId: string): Promise<number | undefined> {
        try {
            const response = await apiClient.post<number>(
                `${this.BASE_URL}/record/${bookId}`
            );
            return response.result;
        } catch (err) {
            console.error('Record view error:', err);
            return undefined;
        }
    }

    async getViewHistory(page: number = 0, size: number = 20): Promise<PageResponse<BookResponse>> {
        const response = await apiClient.get<PageResponse<BookResponse>>(
            this.BASE_URL,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getMostViewedBooks(limit: number = 10): Promise<BookResponse[]> {
        const response = await apiClient.get<BookResponse[]>(
            `${this.BASE_URL}/most-viewed`,
            { params: { limit } }
        );
        return response.result!;
    }

    async clearViewHistory(): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/clear`);
    }
}

export const viewHistoryService = new ViewHistoryService();
export default viewHistoryService;