import { useState } from 'react';
import { Ticket, Copy, Check, Gift, AlertCircle, Calendar, Tag, Search, X, Shield, Percent, DollarSign } from 'lucide-react';
import { useVouchers } from '../../../hooks/user/useVouchers';
import { useAuth } from '../../../hooks/user/useAuth';
import LoadingSpinner from '../../../components/user/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import type { VoucherResponse } from '../../../types/voucher.types';

export const VouchersPublic = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { vouchers, loading, getVoucherByCode, checkVoucherValidity } = useVouchers();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState<VoucherResponse | 'not_found' | null>(null);
  const [checkCode, setCheckCode] = useState('');
  const [checkResult, setCheckResult] = useState<{valid: boolean;voucher: VoucherResponse | null;} | null>(null);
  const [searching, setSearching] = useState(false);
  const [checking, setChecking] = useState(false);

  const prefix = 'VouchersPublic';

  // Filter only public vouchers
  const publicVouchers = vouchers.filter((v) => !v.isPersonal && v.isValid);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(t(`${prefix}.copy.success`));
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSearchVoucher = async () => {
    if (!searchCode.trim()) {
      toast.error(t(`${prefix}.searchSection.placeholder`));
      return;
    }

    setSearching(true);
    const found = await getVoucherByCode(searchCode.trim());
    setSearching(false);

    if (found && !found.isPersonal) {
      setSearchResult(found);
      toast.success(t(`${prefix}.searchSection.found`));
    } else {
      setSearchResult('not_found');
      toast.error(t(`${prefix}.searchSection.notFound`));
    }
  };

  const handleCheckValidity = async () => {
    if (!checkCode.trim()) {
      toast.error(t(`${prefix}.checkSection.placeholder`));
      return;
    }

    setChecking(true);
    const isValid = await checkVoucherValidity(checkCode.trim());
    const voucher = await getVoucherByCode(checkCode.trim());
    setChecking(false);

    setCheckResult({ valid: isValid, voucher });

    toast[isValid ? 'success' : 'error'](
      isValid ?
      t(`${prefix}.checkSection.valid`) :
      t(`${prefix}.checkSection.invalid`)
    );
  };

  const handleCollectVoucher = (voucher: VoucherResponse) => {
    if (!isAuthenticated) {
      toast.error(t(`${prefix}.copy.loginRequired`));
      return;
    }

    handleCopyCode(voucher.code);
    toast.success(t(`${prefix}.copy.collectSuccess`));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatDiscount = (voucher: VoucherResponse) => {
    if (voucher.discountType === 'PERCENTAGE') {
      return `${voucher.discountValue}%`;
    }
    return `${voucher.discountValue.toLocaleString()}đ`;
  };

  const getVoucherColor = (voucher: VoucherResponse) => {
    return voucher.discountType === 'PERCENTAGE' ?
    'from-amber-500 to-orange-500' :
    'from-blue-500 to-cyan-500';
  };

  const getVoucherIcon = (voucher: VoucherResponse) => {
    return voucher.discountType === 'PERCENTAGE' ? Percent : DollarSign;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {t(`${prefix}.title`)}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t(`${prefix}.description`)}
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-300">
                <strong>{t(`${prefix}.infoBanner.note`)}</strong>{' '}
                {t(`${prefix}.infoBanner.content`)}
              </div>
            </div>
          </div>
        </div>

        {/* Search & Check Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Search by Code */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t(`${prefix}.searchSection.title`)}
              </h3>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                placeholder={t(`${prefix}.searchSection.placeholder`)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearchVoucher()}
                disabled={searching} />
              
              <button
                onClick={handleSearchVoucher}
                disabled={searching}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                
                {searching ? '...' : t(`${prefix}.searchSection.button`)}
              </button>
            </div>

            {searchResult &&
            <div className="mt-4">
                {searchResult === 'not_found' ?
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {t(`${prefix}.searchSection.notFound`)}
                    </p>
                  </div> :

              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg text-gray-900 dark:text-white">{searchResult.code}</span>
                      <button
                    onClick={() => setSearchResult(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{searchResult.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {formatDiscount(searchResult)}
                      </span>
                      <span>Min: {searchResult.minOrderValue.toLocaleString()}{t("Common.d")}</span>
                    </div>
                  </div>
              }
              </div>
            }
          </div>

          {/* Quick Check Validity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t(`${prefix}.checkSection.title`)}
              </h3>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={checkCode}
                onChange={(e) => setCheckCode(e.target.value.toUpperCase())}
                placeholder={t(`${prefix}.checkSection.placeholder`)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleCheckValidity()}
                disabled={checking} />
              
              <button
                onClick={handleCheckValidity}
                disabled={checking}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                
                {checking ? '...' : t(`${prefix}.checkSection.button`)}
              </button>
            </div>

            {checkResult &&
            <div className="mt-4">
                {checkResult.valid ?
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="font-semibold text-green-700 dark:text-green-300">
                        {t(`${prefix}.checkSection.valid`)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {t(`${prefix}.checkSection.canUse`)}
                    </p>
                  </div> :

              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="font-semibold text-red-700 dark:text-red-300">
                        {t(`${prefix}.checkSection.invalid`)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {checkResult.voucher ?
                  t(`${prefix}.checkSection.expiredOrUsed`) :
                  t(`${prefix}.checkSection.notFound`)}
                    </p>
                  </div>
              }
              </div>
            }
          </div>
        </div>

        {/* Vouchers Grid */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t(`${prefix}.allVouchers.title`)}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t(`${prefix}.allVouchers.count`, { count: publicVouchers.length })}
          </p>
        </div>

        {publicVouchers.length === 0 ?
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <Ticket className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {t(`${prefix}.empty`)}
            </p>
          </div> :

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicVouchers.map((voucher) => {
            const VoucherIcon = getVoucherIcon(voucher);
            return (
              <div
                key={voucher.id}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 group">
                
                  {/* Voucher Header */}
                  <div className={`bg-gradient-to-r ${getVoucherColor(voucher)} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500" />

                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <VoucherIcon className="w-6 h-6" />
                        </div>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                          {voucher.discountType === 'PERCENTAGE' ?
                        t(`${prefix}.type.percentage`) :
                        t(`${prefix}.type.fixed`)}
                        </span>
                      </div>
                      <div className="text-5xl font-bold mb-2">
                        {formatDiscount(voucher)}
                      </div>
                      {voucher.discountType === 'PERCENTAGE' && voucher.maxDiscountAmount &&
                    <div className="text-white/90 text-sm">
                          {t('max')}: {voucher.maxDiscountAmount.toLocaleString()}{t("Common.d")}
                    </div>
                    }
                    </div>
                  </div>

                  {/* Voucher Body */}
                  <div className="p-6 space-y-4">
                    {voucher.description &&
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-2 min-h-[40px]">
                        {voucher.description}
                      </p>
                  }

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Tag className="w-4 h-4" />
                          <span className="text-xs">{t(`${prefix}.labels.minOrder`)}</span>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {voucher.minOrderValue.toLocaleString()}{t("Common.d")}
                      </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs">{t(`${prefix}.labels.expires`)}</span>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white text-xs">
                          {formatDate(voucher.endDate)}
                        </span>
                      </div>
                    </div>

                    {voucher.usageLimit &&
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                          <Ticket className="w-4 h-4" />
                          <span>{t(`${prefix}.labels.remaining`)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                          style={{ width: `${(voucher.remainingUses || 0) / voucher.usageLimit * 100}%` }} />
                        
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white text-sm">
                            {voucher.remainingUses || 0}
                          </span>
                        </div>
                      </div>
                  }

                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-750 dark:to-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                            {t(`${prefix}.labels.voucherCode`)}
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white tracking-wider font-mono">
                            {voucher.code}
                          </div>
                        </div>
                        <button
                        onClick={() => handleCopyCode(voucher.code)}
                        className="p-3 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all group/btn">
                        
                          {copiedCode === voucher.code ?
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" /> :

                        <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover/btn:text-gray-900 dark:group-hover/btn:text-white" />
                        }
                        </button>
                      </div>
                    </div>

                    <button
                    onClick={() => handleCollectVoucher(voucher)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all shadow-md ${
                    isAuthenticated ?
                    'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:shadow-lg transform hover:-translate-y-0.5' :
                    'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`
                    }>
                    
                      {isAuthenticated ?
                    t(`${prefix}.collect.button`) :
                    t(`${prefix}.collect.loginButton`)}
                    </button>
                  </div>
                </div>);

          })}
          </div>
        }
      </div>
    </div>);

};