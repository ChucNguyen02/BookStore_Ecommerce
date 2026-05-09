import { useState, useMemo } from 'react';
import { Ticket, Gift, TrendingUp, Calendar } from 'lucide-react';
import { VoucherCard, VoucherFilter } from '../../../components/user/vouchers';
import LoadingSpinner from '../../../components/user/common/LoadingSpinner';
import { useVouchers } from '../../../hooks/user/useVouchers';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const Vouchers = () => {
  const { t } = useTranslation();
  const { vouchers, loading, error } = useVouchers();
  const [activeFilter, setActiveFilter] = useState<'all' | 'valid' | 'expired' | 'personal'>('all');

  const prefix = 'Vouchers';

  const filteredVouchers = useMemo(() => {
    let filtered = [...vouchers];

    switch (activeFilter) {
      case 'valid':
        filtered = filtered.filter(v =>
          v.isValid &&
          new Date(v.endDate) >= new Date() &&
          (v.usageLimit === null || v.remainingUses! > 0)
        );
        break;
      case 'expired':
        filtered = filtered.filter(v =>
          new Date(v.endDate) < new Date() ||
          (v.usageLimit !== null && v.remainingUses === 0)
        );
        break;
      case 'personal':
        filtered = filtered.filter(v => v.isPersonal);
        break;
    }

    return filtered;
  }, [vouchers, activeFilter]);

  const stats = useMemo(() => {
    const now = new Date();
    const valid = vouchers.filter(v =>
      v.isValid &&
      new Date(v.endDate) >= now &&
      (v.usageLimit === null || v.remainingUses! > 0)
    );
    const expired = vouchers.filter(v => new Date(v.endDate) < now);
    const personal = vouchers.filter(v => v.isPersonal);

    return {
      total: vouchers.length,
      valid: valid.length,
      expired: expired.length,
      personal: personal.length,
    };
  }, [vouchers]);

  const handleCopyVoucher = (code: string) => {
    toast.success(t(`${prefix}.copySuccess`, { code }));
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            {t(`${prefix}.error.tryAgain`)}
          </button>
        </div>
      </div>
    );
  }

  if (vouchers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <Ticket className="w-24 h-24 text-gray-400 dark:text-gray-600 mx-auto" />
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
              {t(`${prefix}.empty.title`)}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {t(`${prefix}.empty.description`)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Gift className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            {t(`${prefix}.title`)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t(`${prefix}.description`)}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Ticket className="w-8 h-8" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
            <p className="text-sm opacity-90">{t(`${prefix}.stats.total`)}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8" />
              <span className="text-2xl font-bold">{stats.valid}</span>
            </div>
            <p className="text-sm opacity-90">{t(`${prefix}.stats.valid`)}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8" />
              <span className="text-2xl font-bold">{stats.expired}</span>
            </div>
            <p className="text-sm opacity-90">{t(`${prefix}.stats.expired`)}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Gift className="w-8 h-8" />
              <span className="text-2xl font-bold">{stats.personal}</span>
            </div>
            <p className="text-sm opacity-90">{t(`${prefix}.stats.personal`)}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <VoucherFilter
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          {/* Vouchers List */}
          <div className="lg:col-span-3">
            {filteredVouchers.length > 0 ? (
              <div className="space-y-6">
                {filteredVouchers.map((voucher) => (
                  <VoucherCard
                    key={voucher.id}
                    voucher={voucher}
                    onCopy={handleCopyVoucher}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                <Ticket className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {t(`${prefix}.noResults`)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vouchers;