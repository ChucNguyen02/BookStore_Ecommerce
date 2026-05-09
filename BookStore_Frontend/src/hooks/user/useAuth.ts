import { useState, useCallback, useEffect } from 'react';
import { authService } from '../../services';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import type {
    AuthResponse,
    RegisterRequest,
    LoginRequest,
    User,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest
} from '../../types';
import { useAuthContext } from '../../context/AuthProvider';

export const useAuth = () => {
    const { language } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { user, setUser } = useAuthContext();

    // Kiểm tra authentication status
    const isAuthenticated = useCallback(() => {
        return authService.isAuthenticated();
    }, []);

    // Lấy thông tin user hiện tại
    const getCurrentUser = useCallback(async (): Promise<User | null> => {
        try {
            setLoading(true);
            setError(null);
            const userData = await authService.getCurrentUser();
            setUser(userData);
            return userData;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Không thể tải thông tin người dùng' : 'Cannot load user info');
            setError(errorMsg);
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, [language]);

    // Đăng nhập
    const login = useCallback(async (data: LoginRequest): Promise<AuthResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.login(data);
            setUser(response.user);
            return response;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Đăng nhập thất bại' : 'Login failed');
            setError(errorMsg);
            toast.error(errorMsg);

            setTimeout(() => {
                window.location.reload();
            }, 2000);

            throw err;
        } finally {
            setLoading(false);
        }
    }, [language]);
    // Đăng nhập bằng Google 
    const googleLogin = useCallback(async (credential: string): Promise<AuthResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.googleLogin(credential);
            setUser(response.user);

            return response;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Đăng nhập Google thất bại' : 'Google login failed');
            setError(errorMsg);

            throw err;
        } finally {
            setLoading(false);
        }
    }, [language]);

    // Đăng ký
    const register = useCallback(async (data: RegisterRequest): Promise<AuthResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.register(data);
            setUser(response.user);
            return response;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Đăng ký thất bại' : 'Registration failed');
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [language]);

    // Đăng xuất
    const logout = useCallback(async (): Promise<boolean> => {
        try {
            setLoading(true);
            await authService.logout();
            setUser(null);
            toast.success(language === 'vi' ? 'Đã đăng xuất' : 'Logged out');
            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Đăng xuất thất bại' : 'Logout failed');
            toast.error(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    }, [language]);

    // Đổi mật khẩu
    const changePassword = useCallback(async (data: ChangePasswordRequest): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await authService.changePassword(data);
            toast.success(language === 'vi' ? 'Đổi mật khẩu thành công' : 'Password changed successfully');
            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Đổi mật khẩu thất bại' : 'Password change failed');
            setError(errorMsg);
            toast.error(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    }, [language]);

    // Quên mật khẩu
    const forgotPassword = useCallback(async (data: ForgotPasswordRequest): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await authService.forgotPassword(data);
            toast.success(language === 'vi' ? 'Đã gửi email đặt lại mật khẩu' : 'Password reset email sent');
            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Không thể gửi email' : 'Cannot send email');
            setError(errorMsg);
            toast.error(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    }, [language]);

    // Đặt lại mật khẩu
    const resetPassword = useCallback(async (data: ResetPasswordRequest): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await authService.resetPassword(data);
            toast.success(language === 'vi' ? 'Đặt lại mật khẩu thành công' : 'Password reset successful');
            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Đặt lại mật khẩu thất bại' : 'Password reset failed');
            setError(errorMsg);
            toast.error(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    }, [language]);

    // Validate reset token
    const validateResetToken = useCallback(async (token: string): Promise<boolean> => {
        try {
            setLoading(true);
            const isValid = await authService.validateResetToken(token);
            return isValid;
        } catch (err: unknown) {
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Cập nhật thông tin user local
    const updateUser = useCallback((userData: User) => {
        setUser(userData);
        authService.setStoredUser(userData);
    }, []);


    return {
        // State
        user,
        loading,
        error,
        isAuthenticated: isAuthenticated(),

        // Methods
        getCurrentUser,
        login,
        googleLogin,
        register,
        logout,
        changePassword,
        forgotPassword,
        resetPassword,
        validateResetToken,
        updateUser,
    };
};