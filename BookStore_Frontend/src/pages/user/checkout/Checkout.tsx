import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Loader2, AlertCircle, Phone } from 'lucide-react';
import { AddressSelector } from '../../../components/user/checkout/AddressSelector';
import { PaymentMethodSelector } from '../../../components/user/checkout/PaymentMethodSelector';
import { VoucherApplier } from '../../../components/user/checkout/VoucherApplier';
import { CheckoutSummary } from '../../../components/user/checkout/CheckoutSummary';
import LoadingSpinner from '../../../components/user/common/LoadingSpinner';
import type { CartItemResponse } from '../../../types/cart.types';
import type { AddressResponse } from '../../../types/address.types';
import { type PaymentMethod } from '../../../types/enum';
import { useCart } from '../../../hooks/user/useCart';
import { useProfile } from '../../../hooks/user/useProfile';
import { useCheckout } from '../../../hooks/user/useCheckout';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { cart, loading: cartLoading } = useCart();
    const {
        profile,
        addresses,
        loading: profileLoading,
        updating,
        updateProfile,
        createAddress,
        updateAddress,
    } = useProfile();
    const {
        processing,
        appliedVoucher,
        validatingVoucher,
        validateVoucher,
        removeVoucher,
        createOrder,
    } = useCheckout();

    const hasCheckedPaymentReturn = useRef(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [savingPhone, setSavingPhone] = useState(false);

    // Check payment return
    useEffect(() => {
        if (hasCheckedPaymentReturn.current) return;
        hasCheckedPaymentReturn.current = true;

        // ✅ FIX: Nếu đang bắt đầu checkout mới (có selectedItems từ cart),
        // KHÔNG redirect theo pendingPayment cũ → clear nó luôn
        const isNewCheckout = location.state?.selectedItems?.length > 0;

        const pendingPaymentStr = localStorage.getItem('pendingPayment');

        if (pendingPaymentStr) {
            try {
                const pendingPayment = JSON.parse(pendingPaymentStr);
                const { orderCode, timestamp } = pendingPayment;

                const now = Date.now();
                const thirtyMinutes = 30 * 60 * 1000;

                // ✅ FIX: Nếu đang checkout mới hoặc pendingPayment quá cũ → clear và tiếp tục checkout
                if (isNewCheckout || now - timestamp > thirtyMinutes) {
                    localStorage.removeItem('pendingPayment');
                    // Không return, cho phép tiếp tục checkout bình thường
                } else {
                    // Chỉ redirect nếu KHÔNG phải checkout mới
                    setIsRedirecting(true);
                    localStorage.removeItem('pendingPayment');

                    const currentParams = new URLSearchParams(window.location.search);
                    currentParams.set('orderCode', orderCode);

                    navigate(`/payment-result?${currentParams.toString()}`, { replace: true });
                    return;
                }
            } catch (error) {
                console.error('Error parsing pending payment:', error);
                localStorage.removeItem('pendingPayment');
            }
        }

        const hasPaymentParams = searchParams.has('vnp_ResponseCode') ||
            searchParams.has('resultCode');
        const orderCodeParam = searchParams.get('orderCode') ||
            searchParams.get('vnp_TxnRef') ||
            searchParams.get('orderId');

        if (hasPaymentParams && orderCodeParam) {
            setIsRedirecting(true);
            navigate(`/payment-result?${searchParams.toString()}`, { replace: true });
            return;
        }
    }, [searchParams, navigate, location.state]);

    const selectedCartItemIds = location.state?.selectedItems || [];
    const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
    const [pointsToUse, setPointsToUse] = useState(0);
    const [note, setNote] = useState('');
    const [selectedItems, setSelectedItems] = useState<CartItemResponse[]>([]);

    useEffect(() => {
        if (isRedirecting) return;

        if (cart?.items && selectedCartItemIds.length > 0) {
            const filtered = cart.items.filter(item =>
                selectedCartItemIds.includes(item.id)
            );
            setSelectedItems(filtered);

            if (filtered.length === 0 && !cartLoading) {
                toast.error(t('Checkout.error.itemsProcessed'));
                navigate('/orders', { replace: true });
            }
        }
    }, [cart, selectedCartItemIds, cartLoading, isRedirecting, navigate, t]);

    useEffect(() => {
        if (isRedirecting) return;

        if (!cartLoading && selectedCartItemIds.length === 0) {
            toast.error(t('Checkout.error.selectItems'));
            navigate('/cart', { replace: true });
        }
    }, [selectedCartItemIds, cartLoading, isRedirecting, navigate, t]);

    useEffect(() => {
        if (isRedirecting) return;

        if (!cartLoading && (!cart || cart.items.length === 0)) {
            toast.error(t('Checkout.error.emptyCart'));
            navigate('/cart', { replace: true });
        }
    }, [cart, cartLoading, isRedirecting, navigate, t]);

    useEffect(() => {
        if (addresses.length > 0) {
            const defaultAddr = addresses.find(addr => addr.isDefault);
            setSelectedAddress(defaultAddr || addresses[0]);
        }
    }, [addresses]);

    useEffect(() => {
        window.history.scrollRestoration = 'manual';
        return () => {
            window.history.scrollRestoration = 'auto';
        };
    }, []);

    useEffect(() => {
        if (profile && !profile.phone) {
            setShowPhoneModal(true);
        }
    }, [profile]);

    const handleSavePhone = async () => {
        if (!phoneNumber.trim()) {
            toast.error(t('Checkout.phoneModal.error.empty'));
            return;
        }

        const phoneRegex = /^(0|\+84)[0-9]{9}$/;
        if (!phoneRegex.test(phoneNumber.trim())) {
            toast.error(t('Checkout.phoneModal.error.invalid'));
            return;
        }

        setSavingPhone(true);
        try {
            const success = await updateProfile({ fullName: profile?.fullName || '', phone: phoneNumber.trim() });
            if (success) {
                setShowPhoneModal(false);
                toast.success(t('Checkout.phoneModal.success'));
            }
        } catch (error) {
            console.error('Error updating phone:', error);
        } finally {
            setSavingPhone(false);
        }
    };

    const handleSubmitOrder = async () => {
        if (!profile?.phone) {
            setShowPhoneModal(true);
            toast.error(t('Checkout.error.phoneRequired'));
            return;
        }

        if (!selectedAddress) {
            toast.error(t('Checkout.error.addressRequired'));
            return;
        }

        const hasOutOfStock = selectedItems.some(item => !item.inStock);
        if (hasOutOfStock) {
            toast.error(t('Checkout.error.outOfStock'));
            return;
        }

        try {
            await createOrder({
                selectedCartItemIds: selectedCartItemIds,
                shippingName: selectedAddress.fullName,
                shippingPhone: selectedAddress.phone,
                shippingAddress: selectedAddress.fullAddress,
                addressId: selectedAddress.id,
                paymentMethod,
                voucherCode: appliedVoucher?.code,
                pointsToUse: pointsToUse > 0 ? pointsToUse : undefined,
                note: note.trim() || undefined,
            });
        } catch (error) {
            console.error('Order creation error:', error);
        }
    };

    if (isRedirecting) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-green-600 dark:text-green-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        {t('Checkout.paymentChecking')}
                    </p>
                </div>
            </div>
        );
    }

    if (cartLoading || profileLoading) {
        return <LoadingSpinner fullScreen />;
    }

    if (!cart || cart.items.length === 0 || selectedCartItemIds.length === 0) {
        return null;
    }

    const selectedQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {showPhoneModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('Checkout.phoneModal.title')}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('Checkout.phoneModal.description')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('Checkout.phoneModal.label')}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder={t('Checkout.phoneModal.placeholder')}
                                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    disabled={savingPhone}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {t('Checkout.phoneModal.hint')}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowPhoneModal(false);
                                        navigate('/cart');
                                    }}
                                    disabled={savingPhone}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                    {t('Checkout.phoneModal.back')}
                                </button>
                                <button
                                    onClick={handleSavePhone}
                                    disabled={savingPhone || !phoneNumber.trim()}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {savingPhone ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {t('Checkout.phoneModal.saving')}
                                        </>
                                    ) : (
                                        t('Checkout.phoneModal.confirm')
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <ShoppingBag className="w-10 h-10 text-green-600 dark:text-green-400" />
                        {t('Checkout.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('Checkout.subtitle')}
                    </p>
                </div>

                {/* Phone Warning Banner */}
                {!profile?.phone && (
                    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
                                    {t('Checkout.phoneWarning.title')}
                                </p>
                                <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
                                    {t('Checkout.phoneWarning.description')}
                                </p>
                                <button
                                    onClick={() => setShowPhoneModal(true)}
                                    className="px-4 py-2 bg-amber-600 dark:bg-amber-700 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-800 transition-colors text-sm font-medium"
                                >
                                    {t('Checkout.phoneWarning.updateNow')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Selected Items Info Banner */}
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div className="flex-1">
                            <p className="font-semibold text-green-800 dark:text-green-300">
                                {t('Checkout.selectedItems.banner', {
                                    count: selectedItems.length,
                                    quantity: selectedQuantity
                                })}
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-400">
                                {t('Checkout.selectedItems.note')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        <AddressSelector
                            addresses={addresses}
                            selectedAddress={selectedAddress}
                            onSelectAddress={setSelectedAddress}
                            onAddAddress={createAddress}
                            onUpdateAddress={updateAddress}
                            updating={updating}
                        />

                        <PaymentMethodSelector
                            selectedMethod={paymentMethod}
                            onSelectMethod={setPaymentMethod}
                        />

                        <VoucherApplier
                            appliedVoucher={appliedVoucher}
                            validating={validatingVoucher}
                            onApply={validateVoucher}
                            onRemove={removeVoucher}
                        />

                        {/* Order Note */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                {t('Checkout.orderNote.title')}
                            </h3>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                                placeholder={t('Checkout.orderNote.placeholder')}
                            />
                        </div>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <CheckoutSummary
                                cart={cart}
                                selectedItems={selectedItems}
                                appliedVoucher={appliedVoucher}
                                pointsToUse={pointsToUse}
                                onPointsChange={setPointsToUse}
                            />

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmitOrder}
                                disabled={processing || !selectedAddress || !profile?.phone}
                                className="w-full mt-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        {t('Checkout.submit.processing')}
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-6 h-6" />
                                        {t('Checkout.submit.placeOrder')}
                                    </>
                                )}
                            </button>

                            {/* Warnings */}
                            {!profile?.phone && (
                                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                    <p className="text-sm text-amber-700 dark:text-amber-400">
                                        {t('Checkout.warning.phone')}
                                    </p>
                                </div>
                            )}

                            {!selectedAddress && (
                                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                    <p className="text-sm text-red-700 dark:text-red-400">
                                        {t('Checkout.warning.address')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;