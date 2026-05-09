import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services';
import type { User } from '../types/user.types';
import toast from 'react-hot-toast';

interface AdminContextType {
    user: User | null;
    isLoading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(authService.getStoredUser());
    const [isLoading, setIsLoading] = useState(false);

    const refreshUser = useCallback(async () => {
        try {
            setIsLoading(true);
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            localStorage.setItem('user', JSON.stringify(currentUser));
        } catch (error) {
            console.error('Failed to refresh user:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
            setUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed');
        }
    }, []);

    useEffect(() => {
        const handleUserUpdate = (event: CustomEvent) => {
            setUser(event.detail);
        };

        window.addEventListener('userUpdated', handleUserUpdate as EventListener);
        return () => {
            window.removeEventListener('userUpdated', handleUserUpdate as EventListener);
        };
    }, []);

    const value = useMemo(
        () => ({
            user,
            isLoading,
            refreshUser,
            logout,
        }),
        [user, isLoading, refreshUser, logout]
    );

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
};