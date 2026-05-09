import { Role, AuthProvider } from './enum';

export interface User {
    id: string;
    email: string;
    fullName: string;
    phone: string | null;
    avatarUrl: string | null;
    role: Role;
    authProviders: string; 
    isActive: boolean;
    emailVerified: boolean;
    createdAt: string;
    totalPoints: number | null;
    tier: string | null;
}

export interface UserProfileResponse {
    id: string;
    email: string;
    fullName: string;
    phone: string | null;
    avatarUrl: string | null;
    role: Role;
    authProviders: string; 
    isActive: boolean;
    emailVerified: boolean;
    createdAt: string;

    // Points summary
    totalPoints: number;
    lifetimePoints: number;
    tier: string;

    // Statistics
    totalOrders: number;
    totalReviews: number;
    consecutiveCheckInDays: number;

    totalQuestions?: number;
}

export interface UpdateProfileRequest {
    fullName: string;
    phone?: string;
    avatarUrl?: string;
}

// Helper functions
export const parseAuthProviders = (authProviders: string): AuthProvider[] => {
    return authProviders.split(',').map(p => p.trim() as AuthProvider);
};

export const hasAuthProvider = (user: User | UserProfileResponse, provider: AuthProvider): boolean => {
    return user.authProviders.includes(provider);
};

export const canLoginWithLocal = (user: User | UserProfileResponse): boolean => {
    return hasAuthProvider(user, AuthProvider.LOCAL);
};

export const canLoginWithGoogle = (user: User | UserProfileResponse): boolean => {
    return hasAuthProvider(user, AuthProvider.GOOGLE);
};

export const getAuthProviderBadges = (authProviders: string) => {
    return authProviders.split(',').map(p => p.trim());
};