import { useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, TrendingUp, Users } from 'lucide-react';
import { authService } from '../../../services';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AdminLogin() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.email || !formData.password) {
            toast.error(t('AdminLogin.toast.fillAllFields'));

            return;
        }

        setIsLoading(true);
        try {

            const response = await authService.login({
                email: formData.email,
                password: formData.password
            });


            if (response.user.role !== 'ADMIN') {
                toast.error(t('AdminLogin.toast.accessDenied'));
                await authService.logout();
                return;
            }

            window.dispatchEvent(new CustomEvent('userUpdated', { detail: response.user }));
            toast.success(t('AdminLogin.toast.loginSuccess'));
            navigate('/admin/dashboard');





        } catch (error) {
            console.error('Admin login error:', error);
            toast.error((error as any).message || t('AdminLogin.toast.loginFailed'));

        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSubmit();
        }
    };

    const handleUserLogin = () => {
        navigate('/login');

    };

    const handleGoHome = () => {
        navigate('/');

    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-amber-50 via-white to-orange-50">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Left Side - Branding */}
            <div className="hidden lg:flex flex-1 relative items-center justify-center p-12">
                <div className="relative z-10 max-w-md space-y-8">
                    {/* Logo */}
                    <div className="animate-fadeInLeft">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-6 shadow-2xl hover-lift">
                            <Shield className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {t('AdminLogin.portalTitle')}
                        </h1>
                        <p className="text-xl text-gray-700">
                            {t('AdminLogin.portalSubtitle')}
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 pt-8">
                        <div className="stagger-item flex items-start space-x-4 p-4 glass rounded-xl hover-lift">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-amber-700" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">{t('AdminLogin.features.security.title')}</h3>
                                <p className="text-sm text-gray-600">{t('AdminLogin.features.security.description')}</p>
                            </div>
                        </div>

                        <div className="stagger-item flex items-start space-x-4 p-4 glass rounded-xl hover-lift">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-orange-700" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">{t('AdminLogin.features.monitoring.title')}</h3>
                                <p className="text-sm text-gray-600">{t('AdminLogin.features.monitoring.description')}</p>
                            </div>
                        </div>

                        <div className="stagger-item flex items-start space-x-4 p-4 glass rounded-xl hover-lift">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-amber-700" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">{t('AdminLogin.features.control.title')}</h3>
                                <p className="text-sm text-gray-600">{t('AdminLogin.features.control.description')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 relative z-10">
                <div className="w-full max-w-md">
                    {/* Card */}
                    <div className="card animate-fadeInUp shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl mb-4 shadow-lg hover-scale">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {t('AdminLogin.formTitle')}
                            </h2>
                            <p className="text-gray-600">
                                {t('AdminLogin.formSubtitle')}
                            </p>
                        </div>

                        {/* Alert */}
                        <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg animate-fadeIn">
                            <div className="flex items-start space-x-3">
                                <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-amber-900 font-semibold">{t('AdminLogin.alert.title')}</p>
                                    <p className="text-xs text-amber-700 mt-1">
                                        {t('AdminLogin.alert.description')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-5">
                            {/* Email */}
                            <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('AdminLogin.emailLabel')}
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onKeyPress={handleKeyPress}
                                        className="input-field pl-11"
                                        placeholder={t('AdminLogin.emailPlaceholder')}
                                        disabled={isLoading}
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('AdminLogin.passwordLabel')}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onKeyPress={handleKeyPress}
                                        className="input-field pl-11 pr-12"
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between animate-fadeInUp" style={{ animationDelay: '0.3s' }}>


                            </div>

                            {/* Submit Button */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="btn-primary w-full animate-fadeInUp"
                                style={{ animationDelay: '0.4s' }}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>{t('AdminLogin.signingIn')}</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center space-x-2">
                                        <Shield className="w-5 h-5" />
                                        <span>{t('AdminLogin.signInAsAdmin')}</span>
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-center text-sm text-gray-600">
                                {t('AdminLogin.needRegularAccess')}{' '}
                                <button
                                    type="button"
                                    onClick={handleUserLogin}
                                    className="font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                                >
                                    {t('AdminLogin.userLogin')}
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Mobile Logo */}
                    <div className="lg:hidden mt-8 text-center animate-fadeIn">
                        <button
                            type="button"
                            onClick={handleGoHome}
                            className="inline-flex items-center space-x-2 text-gray-700 hover:text-amber-600 transition-colors"
                        >
                            <Shield className="w-6 h-6" />
                            <span className="text-lg font-semibold">{t('AdminLogin.mobileBrand')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}