import { useState } from 'react';
import { User, Lock, MapPin, Award, Package, Star, TrendingUp, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProfileInfo } from '../../../components/user/profile/ProfileInfo';
import { ChangePassword } from '../../../components/user/profile/ChangePassword';
import { AddressList } from '../../../components/user/profile/AddressList';
import { UserQuestions } from '../../../components/user/profile/UserQuestions'; 
import { useProfile } from '../../../hooks/user/useProfile';
import LoadingSpinner from '../../../components/user/common/LoadingSpinner';

type TabType = 'info' | 'password' | 'addresses' | 'questions';

const Profile = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabType>('info');
    
    const {
        profile,
        addresses,
        loading,
        error,
        updating,
        updateProfile,
        changePassword,
        setPassword,
        requestEmailChange,
        sendVerificationEmail,
        createAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        deleteAllAddresses,
        deleteAccount,
    } = useProfile();

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-xl text-red-600 dark:text-red-400">
                        {error || t('Profile.loadError')}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        {t('Profile.tryAgain')}
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        {
            id: 'info' as TabType,
            label: t('Profile.tabs.info'),
            icon: <User className="w-5 h-5" />,
        },
        {
            id: 'password' as TabType,
            label: t('Profile.tabs.password'),
            icon: <Lock className="w-5 h-5" />,
        },
        {
            id: 'addresses' as TabType,
            label: t('Profile.tabs.addresses'),
            icon: <MapPin className="w-5 h-5" />,
            badge: addresses.length,
        },
        {
            id: 'questions' as TabType,
            label: t('Profile.tabs.questions'),
            icon: <HelpCircle className="w-5 h-5" />,
            badge: profile.totalQuestions || undefined,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                        {t('Profile.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('Profile.subtitle')}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <Award className="w-8 h-8" />
                            <span className="text-2xl font-bold">{profile.totalPoints || 0}</span>
                        </div>
                        <p className="text-sm opacity-90">{t('Profile.stats.points')}</p>
                        {profile.tier && (
                            <p className="text-xs mt-1 opacity-75">
                                {t('Profile.stats.tier')}: {profile.tier}
                            </p>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 text-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <Package className="w-8 h-8" />
                            <span className="text-2xl font-bold">{profile.totalOrders || 0}</span>
                        </div>
                        <p className="text-sm opacity-90">{t('Profile.stats.orders')}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <Star className="w-8 h-8" />
                            <span className="text-2xl font-bold">{profile.totalReviews || 0}</span>
                        </div>
                        <p className="text-sm opacity-90">{t('Profile.stats.reviews')}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-8 h-8" />
                            <span className="text-2xl font-bold">{profile.consecutiveCheckInDays || 0}</span>
                        </div>
                        <p className="text-sm opacity-90">{t('Profile.stats.checkInDays')}</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Tabs Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-l-4 border-amber-500'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {tab.icon}
                                        <span className="font-medium">{tab.label}</span>
                                    </div>
                                    {tab.badge !== undefined && tab.badge > 0 && (
                                        <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-semibold rounded-full">
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        {activeTab === 'info' && (
                            <ProfileInfo
                                profile={profile}
                                updating={updating}
                                onUpdate={updateProfile}
                                onRequestEmailChange={requestEmailChange}
                                onSendVerificationEmail={sendVerificationEmail}
                                onDeleteAccount={deleteAccount}
                            />
                        )}

                        {activeTab === 'password' && (
                            <ChangePassword
                                profile={profile}
                                updating={updating}
                                onChangePassword={changePassword}
                                onSetPassword={setPassword}
                            />
                        )}

                        {activeTab === 'addresses' && (
                            <AddressList
                                addresses={addresses}
                                updating={updating}
                                onCreate={createAddress}
                                onUpdate={updateAddress}
                                onDelete={deleteAddress}
                                onSetDefault={setDefaultAddress}
                                onDeleteAll={deleteAllAddresses}
                            />
                        )}

                        {activeTab === 'questions' && <UserQuestions />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;