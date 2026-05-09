import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import env from '../../../utils/env.config';
import { useAuth } from '../../../hooks/user/useAuth';

export default function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login, googleLogin, logout } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error(t('Login.fillInfo'));
            return;
        }

        setIsLoading(true);
        try {
            const response = await login({
                email: formData.email,
                password: formData.password,
            });

            if (response.user.role !== 'USER') {
                toast.error(t('Login.adminNotAllowed'), { duration: 6000 });
                await logout();
                setIsLoading(false);
                return;
            }

            window.dispatchEvent(
                new CustomEvent('userUpdated', {
                    detail: response.user,
                })
            );

            // Chỉ hiển thị 1 toast duy nhất
            toast.success(t('Login.loginSuccess'));

            // Chuyển trang sau khi toast hiển thị
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 500);
        } catch (error: unknown) {
            console.error('Login error:', error);

            let errorMessage = t('Login.loginFailed');

            if (error && typeof error === 'object') {
                if ('response' in error) {
                    const err = error as { response?: { data?: { message?: string } } };
                    if (err.response?.data?.message) {
                        errorMessage = err.response.data.message;
                    }
                } else if (error instanceof Error) {
                    errorMessage = error.message || t('Login.loginFailed');
                }
            }

            if (errorMessage.includes('created with Google') || errorMessage.includes('Google')) {
                toast.error(t('Login.googleAccountHint'), { duration: 6000 });
            } else {
                toast.error(errorMessage, { duration: 5000 });
            }

            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse?.credential) {
            toast.error(t('Login.googleNoCredential'));
            return;
        }

        try {
            setIsLoading(true);

            const response = await googleLogin(credentialResponse.credential);

            if (response.user.role !== 'USER') {
                toast.error(t('Login.adminGoogleNotAllowed'), { duration: 6000 });
                await logout();
                setIsLoading(false);
                return;
            }

            window.dispatchEvent(
                new CustomEvent('userUpdated', {
                    detail: response.user,
                })
            );

            // Chỉ hiển thị 1 toast duy nhất cho Google login
            toast.success(t('Login.googleSuccess'), { duration: 4000 });

            // Chuyển trang sau khi toast hiển thị
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 500);
        } catch (error: unknown) {
            console.error('Google login error:', error);

            let errorMessage = t('Login.googleFailed');

            if (typeof error === 'object' && error !== null) {
                if ('code' in error && typeof (error as { code?: unknown }).code === 'string') {
                    const authCode = (error as { code: string }).code;

                    if (
                        authCode.includes('popup-closed-by-user') ||
                        authCode.includes('cancelled') ||
                        authCode.includes('dismissed') ||
                        authCode.includes('popup-blocked')
                    ) {
                        setIsLoading(false);
                        return;
                    }

                    const shortCode = authCode.split('/').pop() || authCode;
                    errorMessage = `${t('Login.googleFailed')}: ${shortCode}`;
                } else if ('response' in error) {
                    const err = error as { response?: { data?: { message?: string } } };
                    if (err.response?.data?.message) {
                        errorMessage = err.response.data.message;
                    }
                } else if ('message' in error && typeof (error as { message?: unknown }).message === 'string') {
                    errorMessage = `${t('Login.googleFailed')}: ${(error as { message: string }).message}`;
                }
            } else if (error instanceof Error) {
                errorMessage = `${t('Login.googleFailed')}: ${error.message}`;
            }

            toast.error(errorMessage, { duration: 6000 });
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast.error(t('Login.googleFailed'));
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
                <div className="w-full max-w-md space-y-8 animate-fadeInUp">
                    {/* Logo & Title */}
                    <div className="text-center">
                        <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-6">
                            <BookOpen className="w-12 h-12 text-amber-600 dark:text-amber-500" />
                            <span className="text-3xl font-serif font-bold bg-gradient-to-r from-amber-700 to-orange-600 dark:from-amber-500 dark:to-orange-500 bg-clip-text text-transparent">
                                BookStore
                            </span>
                        </Link>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                            {t('Login.welcome')}
                        </h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            {t('Login.subtitle')}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('Login.email')}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    placeholder="your@email.com"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('Login.password')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-end">
                            <Link to="/forgot-password" className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300">
                                {t('Login.forgot')}
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 focus:ring-4 focus:ring-amber-300 dark:focus:ring-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>{t('Login.loggingIn')}</span>
                                </>
                            ) : (
                                <span>{t('Login.login')}</span>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">{t('Login.or')}</span>
                            </div>
                        </div>

                        {/* Google Login */}
                        {env.GOOGLE_CLIENT_ID ? (
                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    useOneTap
                                    shape="rectangular"
                                    theme="outline"
                                    size="large"
                                    text="continue_with"
                                    logo_alignment="left"
                                    width="384"
                                />
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => toast.error(t('Login.configGoogle'))}
                                className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('Login.google')}</span>
                            </button>
                        )}

                        {/* Register Link */}
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                            {t('Login.noAccount')}{' '}
                            <Link to="/register" className="font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300">
                                {t('Login.register')}
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 dark:from-amber-600 dark:via-orange-600 dark:to-red-600 p-12 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
                <div className="relative z-10 text-white space-y-6 max-w-md">
                    <div className="animate-fadeInRight">
                        <BookOpen className="w-20 h-20 mb-6" />
                        <h2 className="text-4xl font-serif font-bold mb-4">{t('Login.knowledge')}</h2>
                        <p className="text-lg text-white/90">{t('Login.description')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <p className="text-3xl font-bold">10,000+</p>
                            <p className="text-white/80">{t('Login.books')}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <p className="text-3xl font-bold">50,000+</p>
                            <p className="text-white/80">{t('Login.customers')}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                            <p className="text-3xl font-bold">4.8★</p>
                            <p className="text-white/80">{t('Login.rating')}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                            <p className="text-3xl font-bold">24/7</p>
                            <p className="text-white/80">{t('Login.support')}</p>
                        </div>
                    </div>
                </div>

                <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
        </div>
    );
}