import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services';
import type { User } from '../types';
import { eventEmitter, EVENTS } from '../utils/eventEmitter';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(authService.getStoredUser());
    const [loading, setLoading] = useState(true);

    // Chỉ fetch user MỘT LẦN khi app khởi động
    useEffect(() => {
        const initAuth = async () => {
            const storedUser = authService.getStoredUser();
            const hasToken = authService.isAuthenticated();

            if (storedUser && hasToken) {
                try {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                } catch (err) {
                    console.error('Failed to fetch user:', err);
                    authService.clearStoredUser();
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        initAuth();

        // Lắng nghe event USER_UPDATED
        const handleUserUpdated = (data: unknown) => {
            const updatedUser = data as User | null;
            setUser(updatedUser);
        };

        eventEmitter.on(EVENTS.USER_UPDATED, handleUserUpdated);

        return () => {
            eventEmitter.off(EVENTS.USER_UPDATED, handleUserUpdated);
        };
    }, []);

    const refreshUser = async () => {
        try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
        } catch (err) {
            console.error('Failed to refresh user:', err);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, setUser, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
};