import { useState, useEffect, useCallback } from 'react';
import { adminVoucherService } from '../../services';
import { type VoucherResponse } from '../../types/voucher.types';
import { type VoucherStatistics } from '../../types/admin.types';
import { type PageResponse } from '../../types/base.types';
import toast from 'react-hot-toast';

export const useAdminVouchers = () => {
    const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
    const [statistics, setStatistics] = useState<VoucherStatistics | null>(null);
    const [pagination, setPagination] = useState<PageResponse<VoucherResponse> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const fetchVouchers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [vouchersData, statsData] = await Promise.all([
                adminVoucherService.getAllVouchers(currentPage, 20),
                adminVoucherService.getVoucherStatistics(),
            ]);

            setVouchers(vouchersData.content);
            setPagination(vouchersData);
            setStatistics(statsData);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch vouchers');
            toast.error(err.message || 'Failed to fetch vouchers');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchVouchers();
    }, [fetchVouchers]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleToggleActive = async (voucherId: string) => {
        try {
            await adminVoucherService.toggleVoucherActive(voucherId);
            toast.success('Voucher status updated successfully');
            await fetchVouchers();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update voucher status');
        }
    };

    const handleDeleteVoucher = async (voucherId: string) => {
        try {
            await adminVoucherService.deleteVoucher(voucherId);
            toast.success('Voucher deleted successfully');
            await fetchVouchers();
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete voucher');
        }
    };

    const refetch = () => {
        fetchVouchers();
    };

    return {
        vouchers,
        statistics,
        pagination,
        isLoading,
        error,
        currentPage,
        handlePageChange,
        handleToggleActive,
        handleDeleteVoucher,
        refetch,
    };
};