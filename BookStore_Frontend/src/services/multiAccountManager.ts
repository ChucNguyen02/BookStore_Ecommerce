import { type User } from '../types/user.types';
import { type AuthResponse } from '../types/auth.types';
import { eventEmitter, EVENTS } from '../utils/eventEmitter';
import type { Role } from '../types';


interface StoredAccount {
  accessToken: string;
  user: User;
  role: Role;
  lastUsed: number;
}

interface AccountStorage {
  accounts: Record<string, StoredAccount>;
  activeAccountEmail: string | null;
}

class MultiAccountManager {
  // Storage keys
  private readonly USER_STORAGE_KEY = 'user_multi_accounts';
  private readonly ADMIN_STORAGE_KEY = 'admin_multi_accounts';

  // Backward compatibility keys (có thể bỏ sau này nếu không cần nữa)
  private readonly LEGACY_KEYS = ['accessToken', 'user'] as const;

  /**
   * Xác định context hiện tại là admin hay user
   */
  private isAdminContext(): boolean {
    return window.location.pathname.startsWith('/admin');
  }

  /**
   * Lấy storage key phù hợp theo context và role
   */
  private getStorageKey(role: Role): string {
    return role === 'ADMIN' ? this.ADMIN_STORAGE_KEY : this.USER_STORAGE_KEY;
  }

  private getCurrentStorageKey(): string {
    return this.isAdminContext() ? this.ADMIN_STORAGE_KEY : this.USER_STORAGE_KEY;
  }

  // ==================== Core Methods ====================

  saveAccount(authResponse: AuthResponse): void {
    const { user, accessToken } = authResponse;
    const role = user.role as Role;
    const storageKey = this.getStorageKey(role);

    const storage = this.getStorage(storageKey);
    const email = user.email;

    storage.accounts[email] = {
      accessToken,
      user,
      role,
      lastUsed: Date.now(),
    };

    storage.activeAccountEmail = email;
    this.saveStorage(storageKey, storage);

    // Backward compatibility: cập nhật legacy localStorage
    this.syncLegacyStorage(storage.accounts[email]);

    // GIỮ emit event ở đây vì đây là lúc login/register (user chủ động)
    eventEmitter.emit(EVENTS.USER_UPDATED, user);
  }

  switchAccount(email: string): boolean {
    const storageKey = this.getCurrentStorageKey();
    const storage = this.getStorage(storageKey);
    const account = storage.accounts[email];

    if (!account) {
      console.warn(`Attempted to switch to non-existent account: ${email}`);
      return false;
    }

    account.lastUsed = Date.now();
    storage.activeAccountEmail = email;
    this.saveStorage(storageKey, storage);

    this.syncLegacyStorage(account);

    // GIỮ emit event ở đây vì user chủ động switch account
    eventEmitter.emit(EVENTS.USER_UPDATED, account.user);

    return true;
  }

  getActiveAccount(): StoredAccount | null {
    const storageKey = this.getCurrentStorageKey();
    const storage = this.getStorage(storageKey);

    const activeEmail = storage.activeAccountEmail;
    if (!activeEmail) return null;

    return storage.accounts[activeEmail] ?? null;
  }

  getAllAccounts(): StoredAccount[] {
    const storageKey = this.getCurrentStorageKey();
    const storage = this.getStorage(storageKey);
    return Object.values(storage.accounts)
      .sort((a, b) => b.lastUsed - a.lastUsed);
  }

  getAllUserAccounts(): StoredAccount[] {
    return this.getSortedAccounts(this.USER_STORAGE_KEY);
  }

  getAllAdminAccounts(): StoredAccount[] {
    return this.getSortedAccounts(this.ADMIN_STORAGE_KEY);
  }

  removeAccount(email: string): void {
    const storageKey = this.getCurrentStorageKey();
    const storage = this.getStorage(storageKey);

    const wasActive = storage.activeAccountEmail === email;
    delete storage.accounts[email];

    if (wasActive) {
      const remainingEmails = Object.keys(storage.accounts);
      const newActiveEmail = remainingEmails.length > 0 ? remainingEmails[0] : null;
      storage.activeAccountEmail = newActiveEmail;

      if (newActiveEmail) {
        this.syncLegacyStorage(storage.accounts[newActiveEmail]);
      } else {
        this.clearLegacyStorage();
      }
    }

    this.saveStorage(storageKey, storage);

    if (wasActive && !storage.activeAccountEmail) {
      eventEmitter.emit(EVENTS.USER_UPDATED, null);
    }
  }

  clearActiveAccount(): void {
    const active = this.getActiveAccount();
    if (active) {
      this.removeAccount(active.user.email);
    }
  }

  clearAllAccounts(): void {
    const storageKey = this.getCurrentStorageKey();
    sessionStorage.removeItem(storageKey);
    this.clearLegacyStorage();
    eventEmitter.emit(EVENTS.USER_UPDATED, null);
  }

  clearAllAccountsEverywhere(): void {
    sessionStorage.removeItem(this.USER_STORAGE_KEY);
    sessionStorage.removeItem(this.ADMIN_STORAGE_KEY);
    this.clearLegacyStorage();
    eventEmitter.emit(EVENTS.USER_UPDATED, null);
  }

  // ==================== Token & User Helpers ====================

  getAccessToken(): string | null {
    return this.getActiveAccount()?.accessToken ?? null;
  }

  getStoredUser(): User | null {
    return this.getActiveAccount()?.user ?? null;
  }

  isAuthenticated(): boolean {
    return this.getActiveAccount() !== null;
  }

  hasAccount(email: string): boolean {
    const storageKey = this.getCurrentStorageKey();
    const storage = this.getStorage(storageKey);
    return !!storage.accounts[email];
  }

  updateActiveUserInfo(user: User): void {
    console.log('🔄 multiAccountManager: updating active user info');

    const activeAccount = this.getActiveAccount();
    if (!activeAccount) return;

    activeAccount.user = user;
    activeAccount.lastUsed = Date.now();

    const storageKey = this.getCurrentStorageKey();
    const storage = this.getStorage(storageKey);
    storage.accounts[user.email] = activeAccount;
    this.saveStorage(storageKey, storage);

    this.syncLegacyStorage(activeAccount);

  }

  updateActiveAccountToken(accessToken: string): void {
    const activeAccount = this.getActiveAccount();
    if (!activeAccount) return;

    activeAccount.accessToken = accessToken;
    activeAccount.lastUsed = Date.now();

    const storageKey = this.getCurrentStorageKey();
    const storage = this.getStorage(storageKey);
    this.saveStorage(storageKey, storage);
    this.syncLegacyStorage(activeAccount);
  }

  // ==================== Private Helpers ====================

  private getStorage(key: string): AccountStorage {
    try {
      const item = sessionStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Validate structure
        return {
          accounts: parsed.accounts || {},
          activeAccountEmail: parsed.activeAccountEmail || null,
        };
      }
    } catch (error) {
      console.error(`Failed to parse storage for key "${key}"`, error);
    }

    return { accounts: {}, activeAccountEmail: null };
  }

  private saveStorage(key: string, storage: AccountStorage): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(storage));
    } catch (error) {
      console.error(`Failed to save storage for key "${key}"`, error);
    }
  }

  private getSortedAccounts(storageKey: string): StoredAccount[] {
    const storage = this.getStorage(storageKey);
    return Object.values(storage.accounts)
      .sort((a, b) => b.lastUsed - a.lastUsed);
  }

  private syncLegacyStorage(account: StoredAccount): void {
    sessionStorage.setItem('accessToken', account.accessToken);
    sessionStorage.setItem('user', JSON.stringify(account.user));
  }

  private clearLegacyStorage(): void {
    this.LEGACY_KEYS.forEach(key => sessionStorage.removeItem(key));
  }
}

export const multiAccountManager = new MultiAccountManager();
export default multiAccountManager;