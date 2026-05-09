import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderDetail } from '../../../hooks/admin/useOrderDetail';
import { ArrowLeft, Printer, Package, MapPin, Phone, Mail, Calendar, CreditCard, Tag } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

export default function OrderPrintView() {
    const { orderCode } = useParams<{ orderCode: string }>();
    const navigate = useNavigate();
    const { orderDetail, isLoading } = useOrderDetail(orderCode || null);

    useEffect(() => {
        if (orderDetail && !isLoading) {
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }, [orderDetail, isLoading]);

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <LoadingSpinner size="lg" message="Loading invoice..." />
            </div>
        );
    }

    if (!orderDetail) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="card max-w-md w-full text-center p-8 animate-scaleIn">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-xl text-red-600 font-bold mb-4">Order not found</p>
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="btn-primary"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-8">
            <style>{`
                @media print {
                    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    .print-container { box-shadow: none !important; border: 2px solid #000 !important; }
                }
            `}</style>

            {/* Action Buttons */}
            <div className="no-print mb-6 max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 animate-fadeInDown">
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="btn-secondary flex items-center gap-2 w-full sm:w-auto"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Orders</span>
                </button>
                <button
                    onClick={() => window.print()}
                    className="btn-primary flex items-center gap-2 w-full sm:w-auto"
                >
                    <Printer className="w-5 h-5" />
                    <span>Print Invoice</span>
                </button>
            </div>

            {/* Invoice */}
            <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden print-container animate-fadeInUp">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <Package className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold">BOOKSTORE</h1>
                    </div>
                    <p className="text-amber-100 text-lg">Tax Invoice</p>
                    <p className="text-white font-semibold mt-2 text-xl">#{orderDetail.orderCode}</p>
                </div>

                <div className="p-8">
                    {/* Company & Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Company Info */}
                        <div className="card bg-gradient-to-br from-gray-50 to-gray-100">
                            <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-300">
                                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                                    <Package className="w-4 h-4 text-white" />
                                </div>
                                From:
                            </h3>
                            <div className="text-sm text-gray-700 space-y-2">
                                <p className="font-bold text-lg text-gray-900">Your Bookstore Name</p>
                                <p className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <span>123 Book Street<br/>Ho Chi Minh City, Vietnam</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-amber-600" />
                                    <span>+84 123 456 789</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-amber-600" />
                                    <span>contact@bookstore.com</span>
                                </p>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50">
                            <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-300">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-white" />
                                </div>
                                Bill To:
                            </h3>
                            <div className="text-sm text-gray-700 space-y-2">
                                <p className="font-bold text-lg text-gray-900">{orderDetail.shippingName}</p>
                                <p className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span>{orderDetail.shippingAddress}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-blue-600" />
                                    <span>{orderDetail.shippingPhone}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    <span>{orderDetail.userEmail}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 text-center">
                            <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-600 mb-1">Order Date</p>
                            <p className="font-bold text-sm">{formatDate(orderDetail.createdAt)}</p>
                        </div>
                        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 text-center">
                            <CreditCard className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-600 mb-1">Payment</p>
                            <p className="font-bold text-sm">{orderDetail.paymentMethod}</p>
                        </div>
                        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 text-center">
                            <Tag className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-600 mb-1">Status</p>
                            <p className="font-bold text-sm">{orderDetail.status}</p>
                        </div>
                        <div className="card bg-gradient-to-br from-amber-50 to-orange-50 text-center">
                            <Package className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-600 mb-1">Items</p>
                            <p className="font-bold text-sm">{orderDetail.items.length}</p>
                        </div>
                    </div>

                    {orderDetail.trackingNumber && (
                        <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-0.5">Tracking Number</p>
                                    <p className="font-mono font-bold text-lg text-gray-900">{orderDetail.trackingNumber}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Items Table */}
                    <div className="mb-8 overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                                    <th className="border border-gray-300 px-4 py-4 text-left font-bold">Item Description</th>
                                    <th className="border border-gray-300 px-4 py-4 text-center font-bold">Qty</th>
                                    <th className="border border-gray-300 px-4 py-4 text-right font-bold">Unit Price</th>
                                    <th className="border border-gray-300 px-4 py-4 text-right font-bold">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetail.items.map((item, index) => (
                                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="border border-gray-300 px-4 py-3 font-medium">{item.bookTitle}</td>
                                        <td className="border border-gray-300 px-4 py-3 text-center font-semibold">{item.quantity}</td>
                                        <td className="border border-gray-300 px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                                        <td className="border border-gray-300 px-4 py-3 text-right font-bold text-amber-600">{formatCurrency(item.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="flex justify-end mb-8">
                        <div className="w-full md:w-96">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold">{formatCurrency(orderDetail.subtotal)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Shipping Fee:</span>
                                    <span className="font-semibold">{formatCurrency(orderDetail.shippingFee)}</span>
                                </div>
                                {orderDetail.voucherDiscount && orderDetail.voucherDiscount > 0 && (
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">
                                            Voucher <span className="badge badge-danger ml-1">{orderDetail.voucherCode}</span>
                                        </span>
                                        <span className="font-bold text-green-600">-{formatCurrency(orderDetail.voucherDiscount)}</span>
                                    </div>
                                )}
                                {orderDetail.pointsDiscount > 0 && (
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Points ({orderDetail.pointsUsed} pts):</span>
                                        <span className="font-bold text-green-600">-{formatCurrency(orderDetail.pointsDiscount)}</span>
                                    </div>
                                )}
                                {orderDetail.discountAmount > 0 && (
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Discount:</span>
                                        <span className="font-bold text-green-600">-{formatCurrency(orderDetail.discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 rounded-xl text-xl font-bold shadow-lg mt-4">
                                    <span>TOTAL:</span>
                                    <span>{formatCurrency(orderDetail.totalAmount)}</span>
                                </div>
                                {orderDetail.pointsEarned > 0 && (
                                    <div className="flex justify-between py-2 mt-2">
                                        <span className="text-blue-600 font-medium">Points Earned:</span>
                                        <span className="badge badge-success">+{orderDetail.pointsEarned} pts</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {(orderDetail.note || orderDetail.cancelledReason) && (
                        <div className="mb-8 space-y-3">
                            {orderDetail.note && (
                                <div className="card bg-blue-50 border-l-4 border-blue-500">
                                    <p className="text-xs font-bold text-blue-700 mb-1">Customer Note:</p>
                                    <p className="text-sm text-gray-700">{orderDetail.note}</p>
                                </div>
                            )}
                            {orderDetail.cancelledReason && (
                                <div className="card bg-red-50 border-l-4 border-red-500">
                                    <p className="text-xs font-bold text-red-700 mb-1">Cancellation Reason:</p>
                                    <p className="text-sm text-red-600">{orderDetail.cancelledReason}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="text-center pt-8 border-t-2 border-gray-300">
                        <div className="inline-block px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl mb-4">
                            <p className="text-lg font-bold text-gray-900">Thank you for your business!</p>
                        </div>
                        <p className="text-sm text-gray-600">For any questions, please contact us at <span className="font-semibold text-amber-600">contact@bookstore.com</span></p>
                        <p className="text-xs text-gray-500 mt-4">This is a computer-generated invoice. No signature required.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}