import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Download, AlertCircle, TrendingUp, Clock, CheckCircle as CheckCircleIcon, XCircle } from 'lucide-react';
import { useAdminOrders } from '../../../hooks/admin/useAdminOrders';
import { useOrderDetail } from '../../../hooks/admin/useOrderDetail';
import { type OrderStatus, type PaymentMethod } from '../../../types';
import OrderFilters from '../../../components/admin/orders/OrderFilters';
import OrderTable from '../../../components/admin/orders/OrderTable';
import OrderDetailModal from '../../../components/admin/orders/OrderDetailModal';
import Pagination from '../../../components/admin/common/Pagination';
import LoadingSpinner from '../../../components/admin/common/LoadingSpinner';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';

export default function AdminOrders() {
    const { t } = useTranslation();
    const {
        orders,
        isLoading,
        error,
        statistics,
        fetchOrders,
        searchOrders,
        filterByPaymentMethod,
        fetchOrdersByDateRange,
        updateOrderStatus,
        addOrderNote,
        updateTrackingNumber,
        clearFilters
    } = useAdminOrders();

    const [selectedOrderCode, setSelectedOrderCode] = useState<string | null>(null);
    const { orderDetail, isLoading: isDetailLoading, refetch: refetchDetail } = useOrderDetail(selectedOrderCode);

    const [currentPage, setCurrentPage] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>();

    const handleSearch = useCallback((keyword: string) => {
        setCurrentPage(0);
        searchOrders(keyword, selectedStatus, 0, 20);
    }, [searchOrders, selectedStatus]);

    const handleStatusFilter = useCallback((status: OrderStatus | undefined) => {
        setSelectedStatus(status);
        setCurrentPage(0);
        fetchOrders(status, 0, 20);
    }, [fetchOrders]);

    const handlePaymentMethodFilter = useCallback((method: PaymentMethod | undefined) => {
        if (method) {
            setCurrentPage(0);
            filterByPaymentMethod(method, 0, 20);
        } else {
            fetchOrders(undefined, 0, 20);
        }
    }, [filterByPaymentMethod, fetchOrders]);

    const handleDateRangeFilter = useCallback((startDate: string, endDate: string) => {
        setCurrentPage(0);
        fetchOrdersByDateRange(startDate, endDate, 0, 20);
    }, [fetchOrdersByDateRange]);

    const handleClearFilters = useCallback(() => {
        setSelectedStatus(undefined);
        setCurrentPage(0);
        clearFilters();
    }, [clearFilters]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        fetchOrders(selectedStatus, page, 20);
    }, [fetchOrders, selectedStatus]);

    const handleViewDetail = useCallback((orderCode: string) => {
        setSelectedOrderCode(orderCode);
    }, []);

    const handleCloseDetail = useCallback(() => {
        setSelectedOrderCode(null);
    }, []);

    const handleUpdateStatus = useCallback(async (
        orderCode: string,
        status: string,
        note?: string,
        cancelledReason?: string
    ) => {
        const success = await updateOrderStatus(orderCode, {
            status,
            note,
            cancelledReason
        });
        if (success) {
            refetchDetail();
            fetchOrders(selectedStatus, currentPage, 20);
        }
    }, [updateOrderStatus, refetchDetail, fetchOrders, selectedStatus, currentPage]);

    const handleAddNote = useCallback(async (orderCode: string, note: string) => {
        const success = await addOrderNote(orderCode, note);
        if (success) {
            refetchDetail();
        }
    }, [addOrderNote, refetchDetail]);

    const handleUpdateTracking = useCallback(async (orderCode: string, trackingNumber: string) => {
        const success = await updateTrackingNumber(orderCode, trackingNumber);
        if (success) {
            refetchDetail();
        }
    }, [updateTrackingNumber, refetchDetail]);

    const handleExportToExcel = useCallback(() => {
        if (!orders || orders.content.length === 0) {
            toast.error('No orders to export');
            return;
        }

        const exportData = orders.content.map(order => ({
            'Order Code': order.orderCode,
            'Date': new Date(order.createdAt).toLocaleDateString('vi-VN'),
            'Items': order.itemCount,
            'Total Amount': order.totalAmount,
            'Payment Method': order.paymentMethod,
            'Payment Status': order.paymentStatus,
            'Order Status': order.status,
            'Delivered At': order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('vi-VN') : 'N/A'
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');

        const fileName = `orders_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);

        toast.success('Orders exported successfully');
    }, [orders]);

    const handlePrintOrder = useCallback((orderCode: string) => {
        window.open(`/admin/orders/${orderCode}/print`, '_blank');
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (isLoading && !orders) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 h-32"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 h-32"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-xl text-red-600 dark:text-red-400 font-semibold mb-2">
                            {t('common.error')}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {/* Header với gradient animation */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-2xl animate-fadeInDown">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-pulse">
                                    <ShoppingCart className="w-7 h-7" />
                                </div>
                                <h1 className="text-3xl font-bold">{t('admin.ordersManagement')}</h1>
                            </div>
                            <p className="text-amber-100 animate-fadeIn">
                                {t('admin.manageAllOrders')}
                            </p>
                        </div>
                        <button
                            onClick={handleExportToExcel}
                            disabled={!orders || orders.content.length === 0}
                            className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed backdrop-blur-sm rounded-xl transition-smooth hover-scale shadow-lg hover:shadow-xl"
                        >
                            <Download className="w-5 h-5" />
                            <span className="font-medium">{t('common.exportExcel')}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Stats Cards với stagger animation */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="card hover-lift stagger-item">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {t('admin.totalOrders')}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {statistics?.totalOrders || orders?.totalElements || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card hover-lift stagger-item">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {t('admin.pending')}
                                </p>
                                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                                    {statistics?.pendingOrders || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400">
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                                {t('admin.awaitingAction')}
                            </div>
                        </div>
                    </div>

                    <div className="card hover-lift stagger-item">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {t('admin.processing')}
                                </p>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                                    {statistics?.processingOrders || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center text-xs text-purple-600 dark:text-purple-400">
                                <div className="flex space-x-1 mr-2">
                                    <div className="w-1 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                                    <div className="w-1 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-1 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                {t('admin.inProgress')}
                            </div>
                        </div>
                    </div>

                    <div className="card hover-lift stagger-item">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {t('admin.delivered')}
                                </p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                    {statistics?.deliveredOrders || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                <CheckCircleIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                                <CheckCircleIcon className="w-3 h-3 mr-2" />
                                {t('admin.completed')}
                            </div>
                        </div>
                    </div>

                    <div className="card hover-lift stagger-item">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {t('admin.cancelled')}
                                </p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                                    {statistics?.cancelledOrders || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                                <XCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center text-xs text-red-600 dark:text-red-400">
                                <XCircle className="w-3 h-3 mr-2" />
                                {t('admin.notFulfilled')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Revenue Card với animation */}
                {statistics?.totalRevenue && (
                    <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 rounded-2xl p-8 shadow-2xl text-white stagger-item hover-lift overflow-hidden relative">
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                        </div>

                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-green-100 mb-2 text-lg font-medium flex items-center">
                                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                                    {t('admin.totalRevenue')}
                                </p>
                                <p className="text-4xl font-bold mb-1">{formatCurrency(statistics.totalRevenue)}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                        {t('admin.allTime')}
                                    </div>
                                </div>
                            </div>
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                                <TrendingUp className="w-10 h-10" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="stagger-item">
                    <OrderFilters
                        onSearch={handleSearch}
                        onStatusFilter={handleStatusFilter}
                        onPaymentMethodFilter={handlePaymentMethodFilter}
                        onDateRangeFilter={handleDateRangeFilter}
                        onClearFilters={handleClearFilters}
                    />
                </div>

                {/* Orders Table */}
                {orders && (
                    <>
                        <div className="card stagger-item overflow-hidden">
                            {orders.content.length === 0 ? (
                                <div className="py-16 text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
                                        <ShoppingCart className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {t('admin.noOrdersFound')}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                        {t('admin.noOrdersFoundDesc')}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-4 px-6 pt-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                                        <div className="flex items-center space-x-3">
                                            <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
                                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                                {t('admin.ordersList')}
                                            </h2>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {t('admin.showing')}
                                            </span>
                                            <span className="badge badge-primary">
                                                {orders.content.length}
                                            </span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {t('admin.of')} {orders.totalElements}
                                            </span>
                                        </div>
                                    </div>

                                    <OrderTable
                                        orders={orders.content}
                                        onViewDetail={handleViewDetail}
                                        onPrint={handlePrintOrder}
                                        onExport={handleExportToExcel}
                                    />
                                </>
                            )}
                        </div>

                        {/* Pagination */}
                        {orders.totalPages > 1 && (
                            <div className="flex justify-center stagger-item">
                                <div className="card inline-block">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={orders.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Quick Actions Bar */}
                {orders && orders.content.length > 0 && (
                    <div className="card stagger-item">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {statistics?.pendingOrders || 0} {t('admin.pendingOrders')}
                                    </span>
                                </div>
                                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {statistics?.processingOrders || 0} {t('admin.processingOrders')}
                                    </span>
                                </div>
                                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {statistics?.deliveredOrders || 0} {t('admin.deliveredOrders')}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleClearFilters}
                                className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors hover-scale"
                            >
                                {t('admin.resetFilters')}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Detail Modal với backdrop blur */}
            {selectedOrderCode && (
                <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={handleCloseDetail}
                        ></div>
                        <div className="relative animate-scaleIn w-full max-w-4xl">
                            <OrderDetailModal
                                open={!!selectedOrderCode}
                                orderDetail={orderDetail}
                                isLoading={isDetailLoading}
                                onClose={handleCloseDetail}
                                onUpdateStatus={handleUpdateStatus}
                                onAddNote={handleAddNote}
                                onUpdateTracking={handleUpdateTracking}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}