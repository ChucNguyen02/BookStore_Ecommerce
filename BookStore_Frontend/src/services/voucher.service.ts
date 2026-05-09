import apiClient from './api.client';
import { type VoucherResponse } from '../types';

class VoucherService {
    private readonly BASE_URL = '/vouchers';

    async getAvailableVouchers(): Promise<VoucherResponse[]> {
        const response = await apiClient.get<VoucherResponse[]>(this.BASE_URL);
        return response.result!;
    }

    async getAllAvailableVouchers(): Promise<VoucherResponse[]> {
        const response = await apiClient.get<VoucherResponse[]>(
            `${this.BASE_URL}/all-available`
        );
        return response.result!;
    }

    async getVoucherByCode(code: string): Promise<VoucherResponse> {
        const response = await apiClient.get<VoucherResponse>(
            `${this.BASE_URL}/${code}`
        );
        return response.result!;
    }

    async validateVoucher(code: string): Promise<VoucherResponse> {
        const response = await apiClient.post<VoucherResponse>(
            `${this.BASE_URL}/validate/${code}`
        );
        return response.result!;
    }

    async isVoucherValid(code: string): Promise<boolean> {
        const response = await apiClient.get<boolean>(
            `${this.BASE_URL}/check-valid/${code}`
        );
        return response.result!;
    }
}

export const voucherService = new VoucherService();
export default voucherService;