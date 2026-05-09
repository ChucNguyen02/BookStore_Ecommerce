import apiClient from './api.client';
import { type PageResponse } from '../types';
import {
    type VoucherRequest,
    type VoucherResponse,
} from '../types';
import { type VoucherStatistics } from '../types';

class AdminVoucherService {
    private readonly BASE_URL = '/admin/vouchers';

    /**
     * Tạo một voucher mới
     */
    async createVoucher(data: VoucherRequest): Promise<VoucherResponse> {
        const response = await apiClient.post<VoucherResponse>(this.BASE_URL, data);
        return response.result!;
    }

    /**
     * Cập nhật thông tin voucher
     */
    async updateVoucher(
        voucherId: string,
        data: VoucherRequest
    ): Promise<VoucherResponse> {
        const response = await apiClient.put<VoucherResponse>(
            `${this.BASE_URL}/${voucherId}`,
            data
        );
        return response.result!;
    }

    /**
     * Xóa voucher
     */
    async deleteVoucher(voucherId: string): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/${voucherId}`);
    }

    /**
     * Lấy danh sách tất cả voucher (phân trang)
     */
    async getAllVouchers(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<VoucherResponse>> {
        const response = await apiClient.get<PageResponse<VoucherResponse>>(
            this.BASE_URL,
            { params: { page, size } }
        );
        return response.result!;
    }

    /**
     * Lấy chi tiết một voucher theo ID
     */
    async getVoucherById(voucherId: string): Promise<VoucherResponse> {
        const response = await apiClient.get<VoucherResponse>(
            `${this.BASE_URL}/${voucherId}`
        );
        return response.result!;
    }

    /**
     * Bật/tắt trạng thái hoạt động của voucher
     */
    async toggleVoucherActive(voucherId: string): Promise<VoucherResponse> {
        const response = await apiClient.patch<VoucherResponse>(
            `${this.BASE_URL}/${voucherId}/toggle-active`
        );
        return response.result!;
    }

    /**
     * Lấy thống kê tổng quan về voucher
     */
    async getVoucherStatistics(): Promise<VoucherStatistics> {
        const response = await apiClient.get<VoucherStatistics>(
            `${this.BASE_URL}/statistics`
        );
        return response.result!;
    }

    /**
     * Tạo hàng loạt voucher cùng cấu hình
     * @param request Cấu hình chung của voucher
     * @param quantity Số lượng voucher cần tạo
     */
    async bulkCreateVouchers(
        request: VoucherRequest,
        quantity: number
    ): Promise<VoucherResponse[]> {
        const response = await apiClient.post<VoucherResponse[]>(
            `${this.BASE_URL}/bulk-create`,
            request,
            { params: { quantity } }
        );
        return response.result!;
    }
}

export const adminVoucherService = new AdminVoucherService();
export default adminVoucherService;