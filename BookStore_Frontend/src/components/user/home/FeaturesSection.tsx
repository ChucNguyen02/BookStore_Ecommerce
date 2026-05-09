import { memo } from 'react';
import { Truck, Shield, Headphones, Gift } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const FeaturesSection = memo(() => {
    const { t } = useTranslation();

    const features = [
        {
            icon: <Truck className="w-8 h-8" />,
            title: t('FeaturesSection.fastDelivery'),
            description: t('FeaturesSection.fastDeliveryDesc'),
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: t('FeaturesSection.securePayment'),
            description: t('FeaturesSection.securePaymentDesc'),
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: <Headphones className="w-8 h-8" />,
            title: t('FeaturesSection.support247'),
            description: t('FeaturesSection.support247Desc'),
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: <Gift className="w-8 h-8" />,
            title: t('FeaturesSection.specialOffers'),
            description: t('FeaturesSection.specialOffersDesc'),
            color: 'from-orange-500 to-red-500'
        }
    ];

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift animate-fadeInUp overflow-hidden"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Background decoration */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />

                            {/* Icon */}
                            <div className={`relative inline-flex p-4 bg-gradient-to-r ${feature.color} text-white rounded-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>

                            {/* Content */}
                            <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});

FeaturesSection.displayName = 'FeaturesSection';