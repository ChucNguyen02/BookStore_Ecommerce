import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export const NewsletterSection = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error(t('NewsletterSection.errors.empty'));
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error(t('NewsletterSection.errors.invalid'));
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            toast.success(t('NewsletterSection.success'));
            setEmail('');
            setIsLoading(false);
        }, 1000);
    };

    const benefits = [
        {
            text: t('NewsletterSection.benefits.0'),
            icon: '🎁'
        },
        {
            text: t('NewsletterSection.benefits.1'),
            icon: '📚'
        },
        {
            text: t('NewsletterSection.benefits.2'),
            icon: '✨'
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 dark:from-amber-700 dark:via-orange-700 dark:to-red-700 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex p-4 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                            <Mail className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                            {t('NewsletterSection.title')}
                        </h2>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            {t('NewsletterSection.subtitle')}
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white"
                            >
                                <span className="text-2xl">{benefit.icon}</span>
                                <span className="text-sm font-medium">{benefit.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                        <div className="flex-1 relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('NewsletterSection.placeholder')}
                                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all text-lg"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-4 bg-white text-amber-600 font-bold rounded-full hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg whitespace-nowrap"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                                    <span>{t('NewsletterSection.processing')}</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>{t('NewsletterSection.subscribe')}</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Trust badges */}
                    <div className="text-center mt-8">
                        <p className="text-white/80 text-sm">
                            {t('NewsletterSection.privacy')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};