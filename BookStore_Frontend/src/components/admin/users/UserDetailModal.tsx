import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X,
    User as UserIcon,
    Mail,
    Phone,
    Calendar,
    Shield,
    Award,
    ShoppingBag,
    MessageSquare,
    TrendingUp,
} from 'lucide-react';
import { useUserDetail } from '../../../hooks/admin/useUserDetail';
import LoadingSpinner from '../../admin/common/LoadingSpinner';
import UserOrderHistory from './UserOrderHistory';
import UserPointsHistory from './UserPointsHistory';

interface UserDetailModalProps {
    userId: string;
    onClose: () => void;
    onUpdate: () => void;
}

export default function UserDetailModal({ userId, onClose, onUpdate }: UserDetailModalProps) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'points'>('info');
    const { user, isLoading, error } = useUserDetail(userId);

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl p-8">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl p-8">
                    <p className="text-red-600 dark:text-red-400">{error || t('admin.userNotFound')}</p>
                    <button
                        onClick={onClose}
                        className="mt-4 px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl"
                    >
                        {t('common.close')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="card w-full max-w-4xl my-8 animate-scaleIn">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t('admin.userDetails')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-smooth hover-scale"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`px-6 py-4 font-medium transition-smooth relative ${activeTab === 'info'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                    >
                        {t('admin.information')}
                        {activeTab === 'info' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 animate-fadeInLeft" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-4 font-medium transition-smooth relative ${activeTab === 'orders'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                    >
                        {t('admin.orderHistory')}
                        {activeTab === 'orders' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 animate-fadeInLeft" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('points')}
                        className={`px-6 py-4 font-medium transition-smooth relative ${activeTab === 'points'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                    >
                        {t('admin.pointsHistory')}
                        {activeTab === 'points' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 animate-fadeInLeft" />
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            {/* Avatar & Basic Info */}
                            <div className="flex items-center space-x-6 animate-fadeInUp">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold hover-scale">
                                    {user.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {user.fullName}
                                    </h3>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className={`badge ${user.role === 'ADMIN' ? 'badge-danger' : 'badge-primary'}`}>
                                            {user.role}
                                        </span>
                                        <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                                            {user.isActive ? t('admin.active') : t('admin.inactive')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t('admin.memberSince')}{' '}
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover-lift stagger-item">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {t('admin.email')}
                                        </span>
                                    </div>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {user.email}
                                    </p>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover-lift stagger-item" style={{ animationDelay: '0.1s' }}>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {t('admin.phone')}
                                        </span>
                                    </div>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {user.phone || '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white hover-lift stagger-item">
                                    <Award className="w-8 h-8 mb-2 opacity-80 animate-pulse" />
                                    <p className="text-2xl font-bold">
                                        {user.totalPoints?.toLocaleString() || 0}
                                    </p>
                                    <p className="text-sm opacity-80">{t('admin.points')}</p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white hover-lift stagger-item" style={{ animationDelay: '0.1s' }}>
                                    <TrendingUp className="w-8 h-8 mb-2 opacity-80 animate-pulse" />
                                    <p className="text-2xl font-bold">{user.tier || 'N/A'}</p>
                                    <p className="text-sm opacity-80">{t('admin.tier')}</p>
                                </div>

                                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white hover-lift stagger-item" style={{ animationDelay: '0.2s' }}>
                                    <ShoppingBag className="w-8 h-8 mb-2 opacity-80 animate-pulse" />
                                    <p className="text-2xl font-bold">
                                        {(user as any).totalOrders || 0}
                                    </p>
                                    <p className="text-sm opacity-80">{t('admin.orders')}</p>
                                </div>

                                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 text-white hover-lift stagger-item" style={{ animationDelay: '0.3s' }}>
                                    <MessageSquare className="w-8 h-8 mb-2 opacity-80 animate-pulse" />
                                    <p className="text-2xl font-bold">
                                        {(user as any).totalReviews || 0}
                                    </p>
                                    <p className="text-sm opacity-80">{t('admin.reviews')}</p>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                    {t('admin.additionalInfo')}
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            {t('admin.authProvider')}:
                                        </span>
                                        <span className="ml-2 text-gray-900 dark:text-white font-medium">
                                            {user.authProvider}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            {t('admin.emailVerified')}:
                                        </span>
                                        <span className="ml-2 text-gray-900 dark:text-white font-medium">
                                            {user.emailVerified ? t('common.yes') : t('common.no')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && <UserOrderHistory userId={userId} />}
                    {activeTab === 'points' && <UserPointsHistory userId={userId} />}
                </div>
            </div>
        </div>
    );
}