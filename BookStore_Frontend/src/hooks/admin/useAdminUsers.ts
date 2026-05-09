import { useState, useEffect, useCallback } from 'react';
import { adminUserService } from '../../services';
import { type User } from '../../types/user.types';
import { type PageResponse } from '../../types/base.types';
import { type Role, type Tier } from '../../types/enum';
import toast from 'react-hot-toast';

interface UserFilters {
    role: Role | '';
    isActive: string;
    tier: Tier | '';
}

export const useAdminUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<PageResponse<User> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [activeFilters, setActiveFilters] = useState<UserFilters>({
        role: '',
        isActive: '',
        tier: '',
    });

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            let result: PageResponse<User>;

            if (searchKeyword) {
                result = await adminUserService.searchUsers(searchKeyword, currentPage, 20);
            } else {
                // Fetch all users with filters applied
                // Since backend doesn't have a general getAll endpoint, we'll use search with empty keyword
                result = await adminUserService.searchUsers('', currentPage, 20);
            }

            // Apply client-side filters if needed
            let filteredUsers = result.content;

            if (activeFilters.role) {
                filteredUsers = filteredUsers.filter(user => user.role === activeFilters.role);
            }

            if (activeFilters.isActive !== '') {
                const isActive = activeFilters.isActive === 'true';
                filteredUsers = filteredUsers.filter(user => user.isActive === isActive);
            }

            if (activeFilters.tier) {
                filteredUsers = filteredUsers.filter(user => user.tier === activeFilters.tier);
            }

            setUsers(filteredUsers);
            setPagination(result);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users');
            toast.error(err.message || 'Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchKeyword, activeFilters]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        setCurrentPage(0);
    };

    const handleFilter = (filters: UserFilters) => {
        setActiveFilters(filters);
        setCurrentPage(0);
    };

    const handleToggleActive = async (userId: string, currentStatus: boolean) => {
        try {
            // Backend doesn't have direct toggle endpoint
            // Would need to be implemented on backend
            toast.error('Toggle active feature not implemented on backend');
            
            // For now, just refresh
            await fetchUsers();
        } catch (err: any) {
            toast.error(err.message || 'Failed to toggle user status');
        }
    };

    const handleChangeRole = async (userId: string, newRole: Role) => {
        try {
            // Backend doesn't have direct role change endpoint
            // Would need to be implemented on backend
            toast.error('Change role feature not implemented on backend');
            
            // For now, just refresh
            await fetchUsers();
        } catch (err: any) {
            toast.error(err.message || 'Failed to change user role');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            // Backend doesn't have admin delete user endpoint
            // Would need to be implemented on backend
            toast.error('Delete user feature not implemented on backend');
            
            // For now, just refresh
            await fetchUsers();
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete user');
        }
    };

    const refetch = () => {
        fetchUsers();
    };

    return {
        users,
        pagination,
        isLoading,
        error,
        currentPage,
        handlePageChange,
        handleSearch,
        handleFilter,
        handleToggleActive,
        handleChangeRole,
        handleDeleteUser,
        refetch,
    };
};