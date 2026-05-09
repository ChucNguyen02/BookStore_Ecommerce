import apiClient from './api.client';
import {
  type AuthResponse,
  type RegisterRequest,
  type LoginRequest,
  type ChangePasswordRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
} from '../types';
import { type User } from '../types';
import { multiAccountManager } from './multiAccountManager';
import { eventEmitter, EVENTS } from '../utils/eventEmitter';

class AuthService {
  private readonly BASE_URL = '/auth';

  // ==================== Core Auth Methods ====================

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.BASE_URL}/register`,
      data
    );

    if (response.result) {
      multiAccountManager.saveAccount(response.result);
    } else {
      throw new Error(response.message || 'Registration failed');
    }

    return response.result;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.BASE_URL}/login`,
      data
    );

    if (response.result) {
      multiAccountManager.saveAccount(response.result);
    } else {
      throw new Error(response.message || 'Login failed');
    }

    return response.result;
  }

  async googleLogin(credential: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.BASE_URL}/google`,
      { credential }
    );

    if (response.result) {
      multiAccountManager.saveAccount(response.result);
    } else {
      throw new Error(response.message || 'Google login failed');
    }

    return response.result;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(`${this.BASE_URL}/me`);

    if (response.result) {
      console.log('🔄 getCurrentUser: updating user info'); // THÊM LOG
      multiAccountManager.updateActiveUserInfo(response.result);
      return response.result;
    }

    throw new Error(response.message || 'Failed to fetch user info');
  }

  // ==================== Password Management ====================

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient.post<void>(`${this.BASE_URL}/change-password`, data);
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await apiClient.post<void>(`${this.BASE_URL}/forgot-password`, data);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await apiClient.post<void>(`${this.BASE_URL}/reset-password`, data);
  }

  async validateResetToken(token: string): Promise<boolean> {
    const response = await apiClient.get<boolean>(
      `${this.BASE_URL}/validate-reset-token`,
      { params: { token } }
    );
    return response.result ?? false;
  }

  async setPassword(newPassword: string, confirmPassword: string): Promise<void> {
    await apiClient.post<void>(`${this.BASE_URL}/set-password`, {
      newPassword,
      confirmPassword,
    });
  }

  // ==================== Logout ====================

  async logout(): Promise<void> {
    const token = multiAccountManager.getAccessToken();


    const activeAccount = multiAccountManager.getActiveAccount();
    if (activeAccount) {
      multiAccountManager.removeAccount(activeAccount.user.email);
    }

    if (!multiAccountManager.getActiveAccount()) {
      eventEmitter.emit(EVENTS.USER_LOGGED_OUT);
    }

    // Sau đó mới gọi API logout (best effort)
    if (token) {
      try {
        await apiClient.post<void>(
          `${this.BASE_URL}/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Logout API call failed (already cleared local):', error);
      }
    }
  }

  async logoutAll(): Promise<void> {
    const accounts = multiAccountManager.getAllAccounts();

    // Gọi API logout cho từng account (best effort)
    await Promise.all(
      accounts.map(async (account) => {
        try {
          await apiClient.post<void>(
            `${this.BASE_URL}/logout`,
            {},
            { headers: { Authorization: `Bearer ${account.accessToken}` } }
          );
        } catch (error) {
          console.error(`Logout failed for ${account.user.email}:`, error);
        }
      })
    );

    // Luôn clear local
    multiAccountManager.clearAllAccounts();
    eventEmitter.emit(EVENTS.USER_LOGGED_OUT);
  }

  // ==================== Multi Account Management ====================

  switchAccount(email: string): boolean {
    const success = multiAccountManager.switchAccount(email);
    if (success) {
      window.location.reload(); // Để áp dụng token mới ngay lập tức
    }
    return success;
  }

  getAllAccounts() {
    return multiAccountManager.getAllAccounts();
  }

  hasAccount(email: string): boolean {
    return multiAccountManager.hasAccount(email);
  }

  // ==================== Delegated / Helper Methods ====================

  isAuthenticated(): boolean {
    return multiAccountManager.isAuthenticated();
  }

  getStoredUser(): User | null {
    return multiAccountManager.getStoredUser();
  }

  getAccessToken(): string | null {
    return multiAccountManager.getAccessToken();
  }

  setStoredUser(user: User) {
    multiAccountManager.updateActiveUserInfo(user);
  }

  clearStoredUser() {
    const activeAccount = multiAccountManager.getActiveAccount();
    if (activeAccount) {
      multiAccountManager.removeAccount(activeAccount.user.email);
    }
  }

  clearAuthData(): void {
    this.clearStoredUser();
  }
}

export const authService = new AuthService();
export default authService;