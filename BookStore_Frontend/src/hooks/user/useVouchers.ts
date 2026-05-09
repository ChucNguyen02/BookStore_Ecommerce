import { useQuery } from '@tanstack/react-query';
import { voucherService, authService } from '../../services';
import type { VoucherResponse } from '../../types';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

export const useVouchers = () => {
    const { language } = useAppContext();
    const currentUser = authService.getStoredUser();
    const isLoggedIn = !!currentUser;

    const { data: vouchers = [], isLoading: loading, error: queryError, refetch } = useQuery({
        queryKey: ['vouchers', isLoggedIn],
        queryFn: async () => {
            return isLoggedIn
                ? await voucherService.getAvailableVouchers()
                : await voucherService.getAllAvailableVouchers();
        },
        staleTime: 5 * 60 * 1000,
    });

    const error = queryError ? (queryError as Error).message : null;

    const validateVoucher = async (code: string): Promise<VoucherResponse | null> => {
        if (!isLoggedIn) {
            toast.error(language === 'vi'
                ? 'Vui lòng đăng nhập để xác thực voucher'
                : 'Please login to validate voucher');
            return null;
        }

        try {
            const voucher = await voucherService.validateVoucher(code);
            toast.success(language === 'vi'
                ? 'Áp dụng voucher thành công!'
                : 'Voucher applied successfully!');
            return voucher;
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : (language === 'vi'
                ? 'Voucher không hợp lệ'
                : 'Invalid voucher'));
            return null;
        }
    };

    const checkVoucherValidity = async (code: string): Promise<boolean> => {
        try {
            return await voucherService.isVoucherValid(code);
        } catch (err: unknown) {
            console.error('Error checking voucher validity:', err);
            return false;
        }
    };

    const getVoucherByCode = async (code: string): Promise<VoucherResponse | null> => {
        try {
            return await voucherService.getVoucherByCode(code);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : (language === 'vi'
                ? 'Không tìm thấy voucher'
                : 'Voucher not found'));
            return null;
        }
    };

    return {
        vouchers,
        loading,
        error,
        isLoggedIn,
        validateVoucher,
        checkVoucherValidity,
        getVoucherByCode,
        refetch,
    };
};