import apiClient from './api.client';
import { type PageResponse } from '../types';
import { TransactionType, ReferenceType } from '../types';
import {
    type PointsResponse,
    type PointsSummaryResponse,
    type PointTransactionResponse,
    type CheckInResponse,
} from '../types/points.types';

class PointsService {
    private readonly BASE_URL = '/points';

    async getUserPoints(): Promise<PointsResponse> {
        const response = await apiClient.get<PointsResponse>(this.BASE_URL);
        return response.result!;
    }

    async dailyCheckIn(): Promise<CheckInResponse> {
        const response = await apiClient.post<CheckInResponse>(`${this.BASE_URL}/check-in`);
        return response.result!;
    }

    async getPointHistory(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<PointTransactionResponse>> {
        const response = await apiClient.get<PageResponse<PointTransactionResponse>>(
            `${this.BASE_URL}/history`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getPointsSummary(): Promise<PointsSummaryResponse> {
        const response = await apiClient.get<PointsSummaryResponse>(
            `${this.BASE_URL}/summary`
        );
        return response.result!;
    }

    async hasCheckedInToday(): Promise<boolean> {
        const response = await apiClient.get<boolean>(
            `${this.BASE_URL}/checked-in-today`
        );
        return response.result!;
    }

    async getCheckInByDate(date: string): Promise<CheckInResponse> {
        const response = await apiClient.get<CheckInResponse>(
            `${this.BASE_URL}/check-in-by-date`,
            { params: { date } }
        );
        return response.result!;
    }

    async getCheckInHistory(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<CheckInResponse>> {
        const response = await apiClient.get<PageResponse<CheckInResponse>>(
            `${this.BASE_URL}/check-in-history`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getTotalPointsFromCheckIns(): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/total-from-check-ins`
        );
        return response.result!;
    }

    async getPointHistoryByType(
        type: TransactionType,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<PointTransactionResponse>> {
        const response = await apiClient.get<PageResponse<PointTransactionResponse>>(
            `${this.BASE_URL}/history/type/${type}`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getTransactionsByReference(
        referenceType: ReferenceType,
        referenceId: string
    ): Promise<PointTransactionResponse[]> {
        const response = await apiClient.get<PointTransactionResponse[]>(
            `${this.BASE_URL}/history/reference`,
            { params: { referenceType, referenceId } }
        );
        return response.result!;
    }

    async getTotalEarnedPoints(): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/total-earned`
        );
        return response.result!;
    }

    async getTopCheckInUsers(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<PointsResponse>> {
        const response = await apiClient.get<PageResponse<PointsResponse>>(
            '/admin/points/top-users',
            { params: { page, size } }
        );
        return response.result!;
    }

    async getUsersByTier(tier: string): Promise<PointsResponse[]> {
        const response = await apiClient.get<PointsResponse[]>(
            `/admin/points/tier/${tier}`
        );
        return response.result!;
    }

    async userHasEnoughPoints(userId: string, points: number): Promise<boolean> {
        const response = await apiClient.get<boolean>(
            `/admin/points/user/${userId}/check-points`,
            { params: { points } }
        );
        return response.result!;
    }
}

export const pointsService = new PointsService();
export default pointsService;