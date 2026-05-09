import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Eye,
    Shield,
    ShieldOff,
    ToggleLeft,
    ToggleRight,
    Trash2,
    MoreVertical,
} from 'lucide-react';
import { type User } from '../../../types/user.types';
import { Role } from '../../../types/enum';
import ConfirmDialog from '../common/ConfirmDialog';

interface UserTableProps {
    users: User[];
    onViewDetail: (userId: string) => void;
    onToggleActive: (userId: string, currentStatus: boolean) => void;
    onChangeRole: (userId: string, newRole: Role) => void;
    onDelete: (userId: string) => void;
}

export default function UserTable({
    users,
    onViewDetail,
    onToggleActive,
    onChangeRole,
    onDelete,
}: UserTableProps) {
    const { t } = useTranslation();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; userId: string | null }>({
        open: false,
        userId: null,
    });

    const handleDeleteClick = (userId: string) => {
        setDeleteDialog({ open: true, userId });
        setActiveMenu(null);
    };

    const handleDeleteConfirm = () => {
        if (deleteDialog.userId) {
            onDelete(deleteDialog.userId);
        }
        setDeleteDialog({ open: false, userId: null });
    };

    const getTierBadgeColor = (tier: string | null) => {
        switch (tier) {
            case 'BRONZE':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'SILVER':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
            case 'GOLD':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'PLATINUM':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            default:
                return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
        }
    };

    const getRoleBadgeColor = (role: Role) => {
        return role === 'ADMIN'
            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    };

    return (
        <>
            <div className="card overflow-hidden animate-fadeInUp">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.user')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.contact')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.role')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.tier')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.points')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.status')}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-smooth stagger-item"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold hover-scale">
                                                {user.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {user.fullName}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {user.phone || '-'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${getTierBadgeColor(user.tier)}`}>
                                            {user.tier || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {user.totalPoints?.toLocaleString() || 0}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                                            {user.isActive ? t('admin.active') : t('admin.inactive')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => onViewDetail(user.id)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-smooth hover-scale"
                                                title={t('admin.viewDetail')}
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>

                                            <div className="relative">
                                                <button
                                                    onClick={() =>
                                                        setActiveMenu(activeMenu === user.id ? null : user.id)
                                                    }
                                                    className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-smooth hover-scale"
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>

                                                {activeMenu === user.id && (
                                                    <div className="absolute right-0 mt-2 w-48 card py-2 z-10 animate-scaleIn">
                                                        <button
                                                            onClick={() => {
                                                                onToggleActive(user.id, user.isActive);
                                                                setActiveMenu(null);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-smooth"
                                                        >
                                                            {user.isActive ? (
                                                                <ToggleLeft className="w-4 h-4" />
                                                            ) : (
                                                                <ToggleRight className="w-4 h-4" />
                                                            )}
                                                            <span>
                                                                {user.isActive
                                                                    ? t('admin.deactivate')
                                                                    : t('admin.activate')}
                                                            </span>
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                const newRole =
                                                                    user.role === 'ADMIN' ? Role.USER : Role.ADMIN;
                                                                onChangeRole(user.id, newRole);
                                                                setActiveMenu(null);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-smooth"
                                                        >
                                                            {user.role === 'ADMIN' ? (
                                                                <ShieldOff className="w-4 h-4" />
                                                            ) : (
                                                                <Shield className="w-4 h-4" />
                                                            )}
                                                            <span>
                                                                {user.role === 'ADMIN'
                                                                    ? t('admin.removeAdmin')
                                                                    : t('admin.makeAdmin')}
                                                            </span>
                                                        </button>

                                                        <hr className="my-2 border-gray-200 dark:border-gray-700" />

                                                        <button
                                                            onClick={() => handleDeleteClick(user.id)}
                                                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-smooth"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            <span>{t('admin.deleteUser')}</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmDialog
                open={deleteDialog.open}
                title={t('admin.deleteUserConfirm')}
                message={t('admin.deleteUserMessage')}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteDialog({ open: false, userId: null })}
            />
        </>
    );
}