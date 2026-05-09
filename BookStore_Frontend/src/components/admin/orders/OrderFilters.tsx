import { Search, Filter, Calendar, X, Phone, Mail, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderStatus, PaymentMethod } from '../../../types';

interface OrderFiltersProps {
    onSearch: (keyword: string) => void;
    onStatusFilter: (status: OrderStatus | undefined) => void;
    onPaymentMethodFilter: (method: PaymentMethod | undefined) => void;
    onDateRangeFilter: (startDate: string, endDate: string) => void;
    onClearFilters: () => void;
}

export default function OrderFilters({
    onSearch,
    onStatusFilter,
    onPaymentMethodFilter,
    onDateRangeFilter,
    onClearFilters
}: OrderFiltersProps) {
    const { t } = useTranslation();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchType, setSearchType] = useState<'all' | 'orderCode' | 'email' | 'phone' | 'customerName'>('all');
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | ''>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchKeyword.trim()) {
            onSearch(searchKeyword.trim());
        }
    };

    const handleQuickSearch = (type: 'email' | 'phone') => {
        setSearchType(type);
        if (searchKeyword.trim()) {
            onSearch(searchKeyword.trim());
        }
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status as OrderStatus | '');
        onStatusFilter(status ? (status as OrderStatus) : undefined);
    };

    const handlePaymentMethodChange = (method: string) => {
        setSelectedPaymentMethod(method as PaymentMethod | '');
        onPaymentMethodFilter(method ? (method as PaymentMethod) : undefined);
    };

    const handleDateRangeApply = () => {
        if (startDate && endDate) {
            if (new Date(startDate) > new Date(endDate)) {
                alert('Start date must be before end date');
                return;
            }
            onDateRangeFilter(startDate, endDate);
        }
    };

    const handleClearAll = () => {
        setSearchKeyword('');
        setSearchType('all');
        setSelectedStatus('');
        setSelectedPaymentMethod('');
        setStartDate('');
        setEndDate('');
        onClearFilters();
    };

    const hasActiveFilters = searchKeyword || selectedStatus || selectedPaymentMethod || (startDate && endDate);

    const getSearchPlaceholder = () => {
        switch (searchType) {
            case 'orderCode':
                return t('admin.searchByOrderCode');
            case 'email':
                return t('admin.searchByEmail');
            case 'phone':
                return t('admin.searchByPhone');
            case 'customerName':
                return t('admin.searchByCustomerName');
            default:
                return t('admin.searchOrders');
        }
    };

    return (
        <div className="card animate-fadeInUp">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-4">
                <div className="flex flex-col sm:flex-row gap-2">
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value as any)}
                        className="input-field sm:w-auto"
                    >
                        <option value="all">{t('common.all')}</option>
                        <option value="orderCode">{t('admin.orderCode')}</option>
                        <option value="email">{t('common.email')}</option>
                        <option value="phone">{t('common.phone')}</option>
                        <option value="customerName">{t('admin.customerName')}</option>
                    </select>
                    
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder={getSearchPlaceholder()}
                            className="input-field pl-12"
                        />
                    </div>

                    <button type="submit" className="btn-primary whitespace-nowrap">
                        {t('common.search')}
                    </button>
                </div>

                {/* Quick Search Buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                    <button
                        type="button"
                        onClick={() => handleQuickSearch('email')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all hover-scale"
                    >
                        <Mail className="w-4 h-4" />
                        <span>{t('admin.searchByEmail')}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleQuickSearch('phone')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-all hover-scale"
                    >
                        <Phone className="w-4 h-4" />
                        <span>{t('admin.searchByPhone')}</span>
                    </button>
                </div>
            </form>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all hover-scale font-medium"
                >
                    <Filter className="w-4 h-4" />
                    <span>{t('common.filters')}</span>
                    {hasActiveFilters && (
                        <span className="badge badge-danger ml-1 animate-pulse">
                            {[searchKeyword, selectedStatus, selectedPaymentMethod, startDate && endDate].filter(Boolean).length}
                        </span>
                    )}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={handleClearAll}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all hover-scale font-medium"
                    >
                        <X className="w-4 h-4" />
                        <span>{t('common.clearAll')}</span>
                    </button>
                )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="space-y-4 pt-4 animate-fadeInUp">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.orderStatus')}
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="input-field"
                            >
                                <option value="">{t('common.all')}</option>
                                <option value="PENDING">🕐 Pending</option>
                                <option value="CONFIRMED">✓ Confirmed</option>
                                <option value="SHIPPING">🚚 Shipping</option>
                                <option value="DELIVERED">📦 Delivered</option>
                                <option value="CANCELLED">✕ Cancelled</option>
                                <option value="RETURNED">↩ Returned</option>
                            </select>
                        </div>

                        {/* Payment Method Filter */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.paymentMethod')}
                            </label>
                            <select
                                value={selectedPaymentMethod}
                                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                className="input-field"
                            >
                                <option value="">{t('common.all')}</option>
                                <option value="COD">💵 COD</option>
                                <option value="BANK_TRANSFER">🏦 Bank Transfer</option>
                                <option value="MOMO">📱 MoMo</option>
                                <option value="VNPAY">💳 VNPay</option>
                            </select>
                        </div>
                    </div>

                    {/* Date Range Filter */}
                    <div className="card bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-800">
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            {t('admin.dateRange')}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                    {t('admin.startDate')}
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    max={endDate || undefined}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                    {t('admin.endDate')}
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || undefined}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {startDate && endDate && (
                            <button
                                onClick={handleDateRangeApply}
                                className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>{t('common.applyDateRange')}</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                            <Filter className="w-3 h-3" />
                            {t('admin.activeFilters')}:
                        </span>
                        {searchKeyword && (
                            <span className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center gap-2 animate-fadeIn">
                                <strong>{searchType === 'all' ? 'Search' : searchType}:</strong> {searchKeyword}
                                <button
                                    onClick={() => setSearchKeyword('')}
                                    className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {selectedStatus && (
                            <span className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 flex items-center gap-2 animate-fadeIn">
                                <strong>Status:</strong> {selectedStatus}
                                <button
                                    onClick={() => handleStatusChange('')}
                                    className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {selectedPaymentMethod && (
                            <span className="badge bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center gap-2 animate-fadeIn">
                                <strong>Payment:</strong> {selectedPaymentMethod}
                                <button
                                    onClick={() => handlePaymentMethodChange('')}
                                    className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {startDate && endDate && (
                            <span className="badge badge-primary flex items-center gap-2 animate-fadeIn">
                                <Calendar className="w-3 h-3" />
                                <span>{startDate} → {endDate}</span>
                                <button
                                    onClick={() => {
                                        setStartDate('');
                                        setEndDate('');
                                    }}
                                    className="hover:bg-amber-200 dark:hover:bg-amber-800 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}