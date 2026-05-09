import apiClient from './api.client';
import { type PageResponse } from '../types';
import { type User, type UpdateProfileRequest, type UserProfileResponse } from '../types';

class UserService {
    private readonly BASE_URL = '/users';

    async getUserProfile(): Promise<UserProfileResponse> {
        const response = await apiClient.get<UserProfileResponse>(
            `${this.BASE_URL}/profile`
        );
        return response.result!;
    }

    async updateProfile(data: UpdateProfileRequest): Promise<User> {
        const response = await apiClient.put<User>(
            `${this.BASE_URL}/profile`,
            data
        );
        return response.result!;
    }

    async deleteAccount(): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/account`);
    }

    // ==================== EMAIL CHANGE METHODS ====================

    /**
     * Request email change (for LOCAL users who haven't verified email)
     */
    async requestEmailChange(newEmail: string): Promise<void> {
        await apiClient.post<void>(
            `${this.BASE_URL}/request-email-change`,
            { newEmail }
        );
    }

    /**
     * Send verification email to current email
     */
    async sendVerificationEmail(): Promise<void> {
        await apiClient.post<void>(
            `${this.BASE_URL}/send-verification-email`
        );
    }

    /**
     * Verify email change with token
     */
    async verifyEmailChange(token: string): Promise<void> {
        await apiClient.post<void>(
            `${this.BASE_URL}/verify-email-change`,
            { token }
        );
    }

    /**
     * Validate email change token
     */
    async validateEmailChangeToken(token: string): Promise<boolean> {
        const response = await apiClient.get<boolean>(
            `${this.BASE_URL}/validate-email-change-token`,
            { params: { token } }
        );
        return response.result!;
    }

    // ==================== ADMIN METHODS ====================

    async searchUsers(
        keyword: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<User>> {
        const response = await apiClient.get<PageResponse<User>>(
            '/admin/users/search',
            { params: { keyword, page, size } }
        );
        return response.result!;
    }

    async countNewUsers(startDate: string, endDate: string): Promise<number> {
        const response = await apiClient.get<number>(
            '/admin/users/new-users-count',
            { params: { startDate, endDate } }
        );
        return response.result!;
    }

    async getActiveUsers(): Promise<User[]> {
        const response = await apiClient.get<User[]>('/admin/users/active');
        return response.result!;
    }

    async getUsersByRole(role: string): Promise<User[]> {
        const response = await apiClient.get<User[]>(
            `/admin/users/role/${role}`
        );
        return response.result!;
    }

    async countUsersByRole(role: string): Promise<number> {
        const response = await apiClient.get<number>(
            `/admin/users/role/${role}/count`
        );
        return response.result!;
    }

    /**
 * Resend verification email (public - no login required)
 */
    async resendVerificationEmail(email: string): Promise<void> {
        await apiClient.post<void>(
            `${this.BASE_URL}/resend-verification-email`,
            { email }
        );
    }

    /**
     * Verify email with token (public)
     */
    async verifyEmail(token: string): Promise<void> {
        await apiClient.post<void>(
            `${this.BASE_URL}/verify-email`,
            { token }
        );
    }

    /**
     * Validate email verification token (public)
     */
    async validateVerificationToken(token: string): Promise<boolean> {
        const response = await apiClient.get<boolean>(
            `${this.BASE_URL}/validate-verification-token`,
            { params: { token } }
        );
        return response.result!;
    }
}

export const userService = new UserService();
export default userService;