import apiClient from './api.client';
import { type StatisticsResponse } from '../types';

class StatisticsService {
    private readonly BASE_URL = '/admin/statistics';

    async getStatistics(): Promise<StatisticsResponse> {
        const response = await apiClient.get<StatisticsResponse>(this.BASE_URL);
        return response.result!;
    }

    async getTotalInventoryValue(): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/inventory-value`
        );
        return response.result!;
    }

    async getTotalBooksSold(): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/books-sold`
        );
        return response.result!;
    }
}

export const statisticsService = new StatisticsService();
export default statisticsService;