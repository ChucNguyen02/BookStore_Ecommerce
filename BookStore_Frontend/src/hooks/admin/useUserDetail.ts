import { useState, useEffect } from 'react';
import { userService } from '../../services';
import { type UserProfileResponse } from '../../types/user.types';

export const useUserDetail = (userId: string) => {
    const [user, setUser] = useState<UserProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Note: Backend doesn't have admin endpoint to get user by ID
                // This would need to be implemented as /admin/users/{userId}
                // For now, we'll simulate with the current user profile endpoint
                // In production, you'd need: await adminUserService.getUserById(userId)
                
                // Temporary workaround - this won't work for other users
                const userData = await userService.getUserProfile();
                setUser(userData);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch user details');
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchUserDetail();
        }
    }, [userId]);

    return {
        user,
        isLoading,
        error,
    };
};