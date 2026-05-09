import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { userService, addressService, authService, fileUploadService } from '../../services';
import type { UserProfileResponse, UpdateProfileRequest } from '../../types';
import type { AddressResponse, AddressRequest } from '../../types';
import toast from 'react-hot-toast';
import { eventEmitter, EVENTS } from '../../utils/eventEmitter';

export const useProfile = () => {
    const queryClient = useQueryClient();
    const token = authService.getAccessToken();
    const isAuthenticated = !!token;
    const [updating, setUpdating] = useState(false);

    const { data: profile = null, isLoading: loadingProfile, error: profileError } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            if (!isAuthenticated) return null;
            return await userService.getUserProfile();
        },
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });

    const { data: addresses = [], isLoading: loadingAddresses, error: addressesError } = useQuery({
        queryKey: ['addresses'],
        queryFn: async () => {
            if (!isAuthenticated) return [];
            return await addressService.getUserAddresses();
        },
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });

    const loading = loadingProfile || loadingAddresses;
    const error = profileError ? (profileError as Error).message : (addressesError ? (addressesError as Error).message : null);

    useEffect(() => {
        const handleUserUpdated = (user: unknown) => {
            if (user !== null) {
                queryClient.setQueryData(['profile'], user);
            } else {
                queryClient.invalidateQueries({ queryKey: ['profile'] });
            }
        };

        eventEmitter.on(EVENTS.USER_UPDATED, handleUserUpdated);

        return () => {
            eventEmitter.off(EVENTS.USER_UPDATED, handleUserUpdated);
        };
    }, [queryClient]);

    const updateProfile = async (data: UpdateProfileRequest) => {
        try {
            setUpdating(true);

            const updateData: UpdateProfileRequest = {
                fullName: data.fullName || profile?.fullName || '',
                phone: data.phone !== undefined ? data.phone : profile?.phone,
                avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : profile?.avatarUrl,
            };

            console.log('📝 Updating profile with:', updateData);
            const updatedUser = await userService.updateProfile(updateData);

            // Cập nhật localStorage
            const storedUser = authService.getStoredUser();
            if (storedUser) {
                const newUser = { ...storedUser, ...updatedUser };
                authService.setStoredUser(newUser);

                // Emit event để các component khác biết
                console.log('📢 Emitting USER_UPDATED event');
                eventEmitter.emit(EVENTS.USER_UPDATED, newUser);
            }

            toast.success('Cập nhật thông tin thành công!');

            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Cập nhật thất bại';
            toast.error(errorMsg);
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
        try {
            setUpdating(true);
            await authService.changePassword({ currentPassword, newPassword, confirmPassword });
            toast.success('Đổi mật khẩu thành công!');
            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Đổi mật khẩu thất bại';
            toast.error(errorMsg);
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const setPassword = async (newPassword: string, confirmPassword: string) => {
        try {
            setUpdating(true);
            await authService.setPassword(newPassword, confirmPassword);
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Đặt mật khẩu thành công! Bạn giờ có thể đăng nhập bằng cả Email/Mật khẩu và Google.');
            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Đặt mật khẩu thất bại';
            toast.error(errorMsg);
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const requestEmailChange = async (newEmail: string) => {
        try {
            setUpdating(true);
            await userService.requestEmailChange(newEmail);
            toast.success('Link xác thực đã được gửi đến email mới. Vui lòng kiểm tra hộp thư!');
            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Yêu cầu đổi email thất bại';
            toast.error(errorMsg);
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const sendVerificationEmail = async () => {
        try {
            setUpdating(true);
            await userService.sendVerificationEmail();
            toast.success('Email xác thực đã được gửi. Vui lòng kiểm tra hộp thư!');
            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Gửi email xác thực thất bại';
            toast.error(errorMsg);
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const createAddress = async (data: AddressRequest) => {
        try {
            setUpdating(true);
            await addressService.createAddress(data);
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            toast.success('Thêm địa chỉ thành công!');
            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Thêm địa chỉ thất bại';
            toast.error(errorMsg);
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const updateAddress = async (addressId: string, data: AddressRequest) => {
        try {
            setUpdating(true);
            await addressService.updateAddress(addressId, data);
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            toast.success('Cập nhật địa chỉ thành công!');
            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Cập nhật địa chỉ thất bại';
            toast.error(errorMsg);
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const deleteAddress = async (addressId: string) => {
        try {
            setUpdating(true);
            await addressService.deleteAddress(addressId);
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            toast.success('Xóa địa chỉ thành công!');
            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Xóa địa chỉ thất bại';
            toast.error(errorMsg);
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const setDefaultAddress = async (addressId: string) => {
        try {
            setUpdating(true);
            await addressService.setDefaultAddress(addressId);
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            toast.success('Đặt địa chỉ mặc định thành công!');
            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Đặt địa chỉ mặc định thất bại';
            toast.error(errorMsg);
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const deleteAllAddresses = async () => {
        try {
            setUpdating(true);
            await addressService.deleteAllUserAddresses();
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            toast.success('Xóa tất cả địa chỉ thành công!');
            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Xóa địa chỉ thất bại';
            toast.error(errorMsg);
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const deleteAccount = async () => {
        try {
            setUpdating(true);

            if (profile?.avatarUrl) {
                try {
                    await fileUploadService.deleteImage(profile.avatarUrl);
                } catch (error) {
                    console.error('Error deleting avatar:', error);
                }
                toast.dismiss();
            }

            await userService.deleteAccount();
            await authService.logout();
            eventEmitter.emit(EVENTS.USER_LOGGED_OUT);

            toast.success('Xóa tài khoản thành công!');

            setTimeout(() => {
                window.location.href = '/';
            }, 1000);

            return true;
        } catch (err: unknown) {
            toast.dismiss();
            const errorMsg = err instanceof Error ? err.message : 'Xóa tài khoản thất bại';
            toast.error(errorMsg);
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const verifyEmail = async (token: string) => {
        try {
            setUpdating(true);
            await userService.verifyEmail(token);
            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Xác thực email thất bại';
            throw new Error(errorMsg);
        } finally {
            setUpdating(false);
        }
    };

    const verifyEmailChange = async (token: string) => {
        try {
            setUpdating(true);
            await userService.verifyEmailChange(token);
            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Xác thực thay đổi email thất bại';
            throw new Error(errorMsg);
        } finally {
            setUpdating(false);
        }
    };

    return {
        profile,
        addresses,
        loading,
        error,
        updating,
        updateProfile,
        changePassword,
        setPassword,
        requestEmailChange,
        sendVerificationEmail,
        createAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        deleteAllAddresses,
        deleteAccount,
        refreshProfile: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
        refreshAddresses: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
        verifyEmail,
        verifyEmailChange,
    };
};