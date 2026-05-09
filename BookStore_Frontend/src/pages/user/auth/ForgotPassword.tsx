import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/user/useAuth';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
    
    const { t } = useTranslation(); 
    const { forgotPassword } = useAuth();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error(t('ForgotPassword.enterEmail'));
            return;
        }

        if (!validateEmail(email)) {
            toast.error(t('ForgotPassword.invalidEmail'));
            return;
        }

        setIsLoading(true);
        try {
            await forgotPassword({ email: email.trim() });
            toast.success(t('ForgotPassword.emailSentSuccess'));
            setEmailSent(true);
        } catch (error: unknown) {
            console.error('Forgot password error:', error);

            let errorMessage = t('ForgotPassword.emailSentError');

            if (error instanceof Error) {
                errorMessage = error.message || t('ForgotPassword.emailSentError');
            } else if (typeof error === 'object' && error !== null && 'message' in error) {
                errorMessage = (error as { message: string }).message || t('ForgotPassword.emailSentError');
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = () => {
        setEmailSent(false);
    };

    if (emailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-8">
                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('ForgotPassword.emailSentTitle')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('ForgotPassword.emailSentDesc')}
                            </p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <p className="text-sm text-blue-900 dark:text-blue-300">
                                {t('ForgotPassword.checkSpam')}{' '}
                                <button
                                    onClick={handleResend}
                                    className="font-semibold underline hover:no-underline"
                                >
                                    {t('ForgotPassword.resend')}
                                </button>
                            </p>
                        </div>

                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('ForgotPassword.backToLogin')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white dark:bg-gray-900">
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8 animate-fadeInUp">
                    <div className="text-center">
                        <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-6">
                            <BookOpen className="w-12 h-12 text-amber-600 dark:text-amber-500" />
                            <span className="text-3xl font-serif font-bold bg-gradient-to-r from-amber-700 to-orange-600 dark:from-amber-500 dark:to-orange-500 bg-clip-text text-transparent">
                                BookStore
                            </span>
                        </Link>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                            {t('ForgotPassword.title')}
                        </h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            {t('ForgotPassword.subtitle')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('ForgotPassword.email')}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    placeholder={t('ForgotPassword.emailPlaceholder')}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 focus:ring-4 focus:ring-amber-300 dark:focus:ring-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>{t('ForgotPassword.sending')}</span>
                                </>
                            ) : (
                                <span>{t('ForgotPassword.sendLink')}</span>
                            )}
                        </button>

                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('ForgotPassword.backToLogin')}
                        </Link>
                    </form>
                </div>
            </div>

            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 dark:from-amber-600 dark:via-orange-600 dark:to-red-600 p-12 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
                <div className="relative z-10 text-white space-y-6 max-w-md text-center">
                    <BookOpen className="w-20 h-20 mx-auto mb-6" />
                    <h2 className="text-4xl font-serif font-bold mb-4">
                        {t('ForgotPassword.rightSideTitle')}
                    </h2>
                    <p className="text-lg text-white/90">
                        {t('ForgotPassword.rightSideDesc')}
                    </p>
                </div>
                <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
        </div>
    );
}