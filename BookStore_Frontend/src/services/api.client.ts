import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ApiResponse } from '../types';
import env from '../utils/env.config';
import toast from 'react-hot-toast';
import { multiAccountManager } from './multiAccountManager';


declare module 'axios' {
    interface AxiosInstance {
        get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
        delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
        head<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
        options<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
        post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
        put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
        patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
        request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    }
}


class ApiClient {
    private instance = axios.create({
        baseURL: env.API_BASE_URL,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    constructor() {
        this.setupInterceptors();
    }


    private setupInterceptors(): void {
        // Request
        this.instance.interceptors.request.use(
            (config) => {
                const token = multiAccountManager.getAccessToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error) => {
                const originalRequest = error.config as AxiosRequestConfig & {
                    _retry?: boolean;
                };

                const isAuthEndpoint = [
                    '/auth/login',
                    '/auth/register',
                    '/auth/google',
                    '/auth/forgot-password',
                    '/auth/reset-password',
                ].some((path) => originalRequest.url?.includes(path));

                // XỬ LÝ LỖI 401
                if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
                    originalRequest._retry = true;

                    const errorMessage = error.response?.data?.message || '';

                    // CHỈ clear và redirect khi token bị revoke/blacklist
                    if (errorMessage.includes('revoked') || errorMessage.includes('blacklist')) {
                        console.log('⚠️ Token revoked/blacklisted, clearing and redirecting...');
                        multiAccountManager.clearAllAccounts();
                        toast.error('Session expired. Please login again.');

                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 1500);

                        return Promise.reject(error);
                    }

                    // Với lỗi 401 khác (token expired), KHÔNG reload
                    // Chỉ reject để component tự xử lý
                    console.log('⚠️ 401 error but not revoked, rejecting...');
                    return Promise.reject(error);
                }

                // XỬ LÝ CÁC LỖI KHÁC
                const apiError = error.response?.data as ApiResponse<unknown> | undefined;
                const errorMsg =
                    apiError?.message ||
                    apiError?.error ||
                    error.response?.data?.msg ||
                    error.message ||
                    'An error occurred';

                // Chỉ hiển thị toast cho lỗi không phải 401
                if (error.response?.status !== 401) {
                    toast.error(errorMsg);
                }

                return Promise.reject(error);
            }
        );
    }

    // BỎ hàm handleTokenTimeout() vì không dùng nữa


    async get<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const res = await this.instance.get<ApiResponse<T>>(url, config);
        return res.data;
    }

    async post<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const res = await this.instance.post<ApiResponse<T>>(url, data, config);
        return res.data;
    }

    async put<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const res = await this.instance.put<ApiResponse<T>>(url, data, config);
        return res.data;
    }

    async patch<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const res = await this.instance.patch<ApiResponse<T>>(url, data, config);
        return res.data;
    }

    async delete<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const res = await this.instance.delete<ApiResponse<T>>(url, config);
        return res.data;
    }


    async uploadFile<T>(
        url: string,
        file: File,
        folder: string = 'general'
    ): Promise<ApiResponse<T>> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const res = await this.instance.post<ApiResponse<T>>(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return res.data;
    }

    async uploadFiles<T>(
        url: string,
        files: File[],
        folder: string = 'general'
    ): Promise<ApiResponse<T>> {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        formData.append('folder', folder);

        const res = await this.instance.post<ApiResponse<T>>(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return res.data;
    }
}


const apiClient = new ApiClient();
export default apiClient;
export { apiClient };