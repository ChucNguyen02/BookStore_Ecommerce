import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Truck, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const PromotionalBanners = memo(() => {
    const { t } = useTranslation();

    const promos = [
        {
            icon: <Gift className="w-12 h-12" />,
            title: t('PromotionalBanners.earnPoints'),
            description: t('PromotionalBanners.earnPointsDesc'),
            link: '/rewards',
            gradient: 'from-purple-500 to-pink-500',
            textColor: 'text-white'
        },
        {
            icon: <Truck className="w-12 h-12" />,
            title: t('PromotionalBanners.freeShipping'),
            description: t('PromotionalBanners.freeShippingDesc'),
            link: '/shipping-policy',
            gradient: 'from-blue-500 to-cyan-500',
            textColor: 'text-white'
        },
        {
            icon: <CreditCard className="w-12 h-12" />,
            title: t('PromotionalBanners.flexiblePayment'),
            description: t('PromotionalBanners.flexiblePaymentDesc'),
            link: '/payment-methods',
            gradient: 'from-green-500 to-emerald-500',
            textColor: 'text-white'
        }
    ];

    return (
        <section className="py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {promos.map((promo, index) => (
                        <Link
                            key={index}
                            to={promo.link}
                            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${promo.gradient} p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
                        >
                            {/* Decorative circles */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

                            <div className="relative z-10">
                                <div className={`inline-flex p-4 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 transition-transform ${promo.textColor}`}>
                                    {promo.icon}
                                </div>
                                <h3 className={`text-2xl font-bold mb-2 ${promo.textColor}`}>
                                    {promo.title}
                                </h3>
                                <p className={`${promo.textColor} opacity-90`}>
                                    {promo.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
});

PromotionalBanners.displayName = 'PromotionalBanners';