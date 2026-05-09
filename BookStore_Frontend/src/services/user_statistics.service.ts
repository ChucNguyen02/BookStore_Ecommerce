import apiClient from './api.client';
import { type UserStatisticsResponse } from '../types';

class UserStatisticsService {
    private readonly BASE_URL = '/users/statistics';

    async getUserStatistics(): Promise<UserStatisticsResponse> {
        const response = await apiClient.get<UserStatisticsResponse>(this.BASE_URL);
        return response.result!;
    }

    async getStatisticsByPeriod(months: number): Promise<UserStatisticsResponse> {
        const response = await apiClient.get<UserStatisticsResponse>(
            `${this.BASE_URL}/period`,
            { params: { months } }
        );
        return response.result!;
    }
}

export const userStatisticsService = new UserStatisticsService();
export default userStatisticsService;