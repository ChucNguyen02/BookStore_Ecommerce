import {
    X,
    User,
    Phone,
    MapPin,
    CreditCard,
    Package,
    Calendar,
    Truck,
    FileText,
    Edit3,
    Printer,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type OrderDetailResponse } from '../../../types';
import OrderStatusBadge from './OrderStatusBadge';
import LoadingSpinner from '../common/LoadingSpinner';

interface OrderDetailModalProps {
    open: boolean;
    orderDetail: OrderDetailResponse | null;
    isLoading: boolean;
    onClose: () => void;
    onUpdateStatus: (orderCode: string, status: string, note?: string, cancelledReason?: string) => void;
    onAddNote: (orderCode: string, note: string) => void;
    onUpdateTracking: (orderCode: string, trackingNumber: string) => void;
}

export default function OrderDetailModal({
    open,
    orderDetail,
    isLoading,
    onClose,
    onUpdateStatus,
    onAddNote,
    onUpdateTracking
}: OrderDetailModalProps) {
    const { t } = useTranslation();
    const [showStatusUpdate, setShowStatusUpdate] = useState(false);
    const [showNoteInput, setShowNoteInput] = useState(false);
    const [showTrackingInput, setShowTrackingInput] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const [newStatus, setNewStatus] = useState('');
    const [statusNote, setStatusNote] = useState('');
    const [note, setNote] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [cancelReason, setCancelReason] = useState('');

    // ✅ MOVED useMemo to TOP LEVEL - before any conditional returns
    const getNextStatuses = (currentStatus: string): string[] => {
        const statusFlow: Record<string, string[]> = {
            'PENDING': ['CONFIRMED', 'CANCELLED'],
            'CONFIRMED': ['SHIPPING', 'CANCELLED'],
            'SHIPPING': ['DELIVERED', 'CANCELLED'],
            'DELIVERED': ['RETURNED'],
            'CANCELLED': [],
            'RETURNED': []
        };
        return statusFlow[currentStatus] || [];
    };

    const nextStatuses = useMemo(() => {
        if (!orderDetail) return [];
        return getNextStatuses(orderDetail.status);
    }, [orderDetail]);

    const canUpdateStatus = nextStatuses.length > 0;


    if (!open) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleStatusUpdate = () => {
        if (orderDetail && newStatus) {
            if (newStatus === 'CANCELLED') {
                setShowCancelDialog(true);
                setShowStatusUpdate(false);
            } else {
                onUpdateStatus(orderDetail.orderCode, newStatus, statusNote || undefined);
                setShowStatusUpdate(false);
                setNewStatus('');
                setStatusNote('');
            }
        }
    };

    const handleCancelOrder = () => {
        if (orderDetail && cancelReason) {
            onUpdateStatus(orderDetail.orderCode, 'CANCELLED', undefined, cancelReason);
            setShowCancelDialog(false);
            setCancelReason('');
        }
    };

    const handleAddNote = () => {
        if (orderDetail && note) {
            onAddNote(orderDetail.orderCode, note);
            setShowNoteInput(false);
            setNote('');
        }
    };

    const handleUpdateTracking = () => {
        if (orderDetail && trackingNumber) {
            onUpdateTracking(orderDetail.orderCode, trackingNumber);
            setShowTrackingInput(false);
            setTrackingNumber(orderDetail.trackingNumber || '');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (!orderDetail && !isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                <div className="card max-w-md w-full p-8 text-center animate-scaleIn">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-lg text-gray-900 dark:text-white font-bold mb-2">
                        {t('admin.orderNotFound')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        {t('admin.orderNotFoundDescription')}
                    </p>
                    <button onClick={onClose} className="btn-secondary">
                        {t('common.close')}
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="card max-w-5xl w-full my-8 animate-scaleIn overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t('admin.orderDetails')}
                        </h2>
                        {orderDetail && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono">
                                #{orderDetail.orderCode}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="p-2.5 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-all hover-scale group"
                            title="Print Order"
                        >
                            <Printer className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2.5 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-all hover-scale"
                        >
                            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {isLoading ? (
                        <LoadingSpinner size="lg" message={t('common.loading')} />
                    ) : orderDetail ? (
                        <div className="space-y-6">
                            {/* Status & Actions */}
                            <div className="card p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <OrderStatusBadge status={orderDetail.status} />
                                        {orderDetail.trackingNumber && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                                                <Truck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                <span className="font-medium">{orderDetail.trackingNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                    {canUpdateStatus && (
                                        <button
                                            onClick={() => setShowStatusUpdate(!showStatusUpdate)}
                                            className="btn-primary flex items-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            <span>{t('admin.updateStatus')}</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Status Update Form */}
                            {showStatusUpdate && (
                                <div className="card p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 space-y-3 animate-fadeInUp">
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="input-field"
                                    >
                                        <option value="">{t('admin.selectStatus')}</option>
                                        {nextStatuses.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    {newStatus && newStatus !== 'CANCELLED' && (
                                        <textarea
                                            value={statusNote}
                                            onChange={(e) => setStatusNote(e.target.value)}
                                            placeholder={t('admin.addNote')}
                                            rows={2}
                                            className="input-field resize-none"
                                        />
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleStatusUpdate}
                                            disabled={!newStatus}
                                            className="btn-primary flex-1"
                                        >
                                            {t('common.confirm')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowStatusUpdate(false);
                                                setNewStatus('');
                                                setStatusNote('');
                                            }}
                                            className="btn-secondary"
                                        >
                                            {t('common.cancel')}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Cancel Dialog */}
                            {showCancelDialog && (
                                <div className="card p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 space-y-3 animate-fadeInUp">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-red-500 dark:bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <XCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                                                {t('admin.cancelOrder')}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                {t('admin.cancelOrderConfirmation')}
                                            </p>
                                            <textarea
                                                value={cancelReason}
                                                onChange={(e) => setCancelReason(e.target.value)}
                                                placeholder={t('admin.cancelReason')}
                                                rows={3}
                                                required
                                                className="input-field resize-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleCancelOrder}
                                            disabled={!cancelReason.trim()}
                                            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all hover-lift"
                                        >
                                            {t('admin.confirmCancel')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowCancelDialog(false);
                                                setCancelReason('');
                                            }}
                                            className="btn-secondary"
                                        >
                                            {t('common.cancel')}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Customer & Payment Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Customer Info */}
                                <div className="card">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 rounded-lg flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <span>{t('admin.customerInfo')}</span>
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-start">
                                            <span className="text-gray-600 dark:text-gray-400">{t('common.name')}:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white text-right">{orderDetail.shippingName}</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-gray-600 dark:text-gray-400">{t('common.email')}:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white text-right break-all">{orderDetail.userEmail}</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                {t('common.phone')}:
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{orderDetail.shippingPhone}</span>
                                        </div>
                                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex items-start gap-2">
                                                <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('common.address')}:</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {orderDetail.shippingAddress}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="card">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 rounded-lg flex items-center justify-center">
                                            <CreditCard className="w-4 h-4 text-white" />
                                        </div>
                                        <span>{t('admin.paymentInfo')}</span>
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">{t('admin.paymentMethod')}:</span>
                                            <span className="badge badge-primary">{orderDetail.paymentMethod}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">{t('admin.paymentStatus')}:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{orderDetail.paymentStatus}</span>
                                        </div>
                                        {orderDetail.transactionId && (
                                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('admin.transactionId')}:</p>
                                                <p className="font-mono text-xs font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                    {orderDetail.transactionId}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="card">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-lg flex items-center justify-center">
                                        <Package className="w-4 h-4 text-white" />
                                    </div>
                                    <span>{t('admin.orderItems')}</span>
                                    <span className="badge badge-primary ml-auto">{orderDetail.items.length}</span>
                                </h3>
                                <div className="space-y-3">
                                    {orderDetail.items.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="stagger-item flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-all group"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            <div className="flex items-center gap-4">
                                                {item.bookImage && (
                                                    <img
                                                        src={item.bookImage}
                                                        alt={item.bookTitle}
                                                        className="w-16 h-20 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform"
                                                    />
                                                )}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                        {item.bookTitle}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {formatCurrency(item.price)} × {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                                    {formatCurrency(item.subtotal)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="card bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">{t('admin.subtotal')}:</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(orderDetail.subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">{t('admin.shippingFee')}:</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(orderDetail.shippingFee)}
                                        </span>
                                    </div>
                                    {orderDetail.voucherDiscount && orderDetail.voucherDiscount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {t('admin.voucherDiscount')} <span className="badge badge-danger ml-1">{orderDetail.voucherCode}</span>
                                            </span>
                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                -{formatCurrency(orderDetail.voucherDiscount)}
                                            </span>
                                        </div>
                                    )}
                                    {orderDetail.pointsDiscount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {t('admin.pointsDiscount')} ({orderDetail.pointsUsed} pts)
                                            </span>
                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                -{formatCurrency(orderDetail.pointsDiscount)}
                                            </span>
                                        </div>
                                    )}
                                    {orderDetail.discountAmount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">{t('admin.discount')}:</span>
                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                -{formatCurrency(orderDetail.discountAmount)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xl font-bold pt-3 border-t-2 border-gray-300 dark:border-gray-600">
                                        <span className="text-gray-900 dark:text-white">{t('admin.totalAmount')}:</span>
                                        <span className="text-amber-600 dark:text-amber-400">
                                            {formatCurrency(orderDetail.totalAmount)}
                                        </span>
                                    </div>
                                    {orderDetail.pointsEarned > 0 && (
                                        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{t('admin.pointsEarned')}:</span>
                                            <span className="badge badge-success">
                                                +{orderDetail.pointsEarned} pts
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="card">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-white" />
                                    </div>
                                    <span>{t('admin.orderTimeline')}</span>
                                </h3>
                                <div className="space-y-4 relative before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
                                    {[
                                        { date: orderDetail.createdAt, label: t('admin.created'), color: 'bg-blue-500' },
                                        orderDetail.confirmedAt && { date: orderDetail.confirmedAt, label: t('admin.confirmed'), color: 'bg-green-500' },
                                        orderDetail.shippedAt && { date: orderDetail.shippedAt, label: t('admin.shipped'), color: 'bg-purple-500' },
                                        orderDetail.deliveredAt && { date: orderDetail.deliveredAt, label: t('admin.delivered'), color: 'bg-amber-500' },
                                        orderDetail.cancelledAt && { date: orderDetail.cancelledAt, label: t('admin.cancelled'), color: 'bg-red-500' },
                                    ].filter(Boolean).map((item: any, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 text-sm relative animate-fadeInLeft"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className={`w-2.5 h-2.5 ${item.color} rounded-full z-10 ring-4 ring-white dark:ring-gray-800`}></div>
                                            <span className="text-gray-600 dark:text-gray-400 font-medium">{item.label}:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {formatDate(item.date)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            {(orderDetail.note || orderDetail.cancelledReason) && (
                                <div className="card">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                                        <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-white" />
                                        </div>
                                        <span>{t('admin.notes')}</span>
                                    </h3>
                                    <div className="space-y-3">
                                        {orderDetail.note && (
                                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                                                <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-1">{t('admin.customerNote')}</p>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    {orderDetail.note}
                                                </p>
                                            </div>
                                        )}
                                        {orderDetail.cancelledReason && (
                                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500 dark:border-red-400">
                                                <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-1">{t('admin.cancelReason')}</p>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    {orderDetail.cancelledReason}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => {
                                        setShowTrackingInput(!showTrackingInput);
                                        setTrackingNumber(orderDetail.trackingNumber || '');
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all hover-lift"
                                >
                                    <Truck className="w-5 h-5" />
                                    <span>{orderDetail.trackingNumber ? t('admin.updateTracking') : t('admin.addTracking')}</span>
                                </button>
                                <button
                                    onClick={() => setShowNoteInput(!showNoteInput)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all hover-lift"
                                >
                                    <Edit3 className="w-5 h-5" />
                                    <span>{t('admin.addNote')}</span>
                                </button>
                            </div>

                            {/* Tracking Input */}
                            {showTrackingInput && (
                                <div className="card p-4 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 space-y-3 animate-fadeInUp">
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                        {t('admin.trackingNumber')}
                                    </label>
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder={t('admin.enterTrackingNumber')}
                                        className="input-field"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleUpdateTracking}
                                            disabled={!trackingNumber}
                                            className="btn-primary flex-1"
                                        >
                                            {t('common.save')}
                                        </button>
                                        <button
                                            onClick={() => setShowTrackingInput(false)}
                                            className="btn-secondary"
                                        >
                                            {t('common.cancel')}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Note Input */}
                            {showNoteInput && (
                                <div className="card p-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 space-y-3 animate-fadeInUp">
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                        {t('admin.addNote')}
                                    </label>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder={t('admin.enterNote')}
                                        rows={3}
                                        className="input-field resize-none"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleAddNote}
                                            disabled={!note}
                                            className="btn-primary flex-1"
                                        >
                                            {t('common.save')}
                                        </button>
                                        <button
                                            onClick={() => setShowNoteInput(false)}
                                            className="btn-secondary"
                                        >
                                            {t('common.cancel')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <Package className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">
                                {t('admin.orderNotFound')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}