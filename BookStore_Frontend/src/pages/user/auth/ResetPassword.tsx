import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, Lock, Eye, EyeOff, Loader2, CheckCircle, XCircle, Check } from 'lucide-react';
import { useAuth } from '../../../hooks/user/useAuth';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function ResetPassword() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { resetPassword, validateResetToken } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
    });

    useEffect(() => {
        validateToken();
    }, [token]);

    const validateToken = async () => {
        if (!token) {
            setIsTokenValid(false);
            setIsValidating(false);
            return;
        }

        try {
            const isValid = await validateResetToken(token);
            setIsTokenValid(isValid);
        } catch (error) {
            console.error('Token validation error:', error);
            setIsTokenValid(false);
        } finally {
            setIsValidating(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'newPassword') {
            setPasswordStrength({
                length: value.length >= 8,
                uppercase: /[A-Z]/.test(value),
                lowercase: /[a-z]/.test(value),
                number: /[0-9]/.test(value),
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.newPassword) {
            toast.error(t('ResetPassword.enterPassword'));
            return;
        }

        if (formData.newPassword.length < 8) {
            toast.error(t('ResetPassword.passwordTooShort'));
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error(t('ResetPassword.passwordMismatch'));
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword({
                token: token!,
                newPassword: formData.newPassword,
            });
            toast.success(t('ResetPassword.resetSuccess'));
            setResetSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (error: unknown) {
            console.error('Reset password error:', error);
            const errorMessage = error && typeof error === 'object' && 'message' in error
                ? (error as { message: string }).message
                : t('ResetPassword.resetFailed');
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-amber-600 dark:text-amber-400 mx-auto" />
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('ResetPassword.validating')}
                    </p>
                </div>
            </div>
        );
    }

    if (!isTokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-8">
                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('ResetPassword.invalidTokenTitle')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('ResetPassword.invalidTokenDesc')}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Link
                                to="/forgot-password"
                                className="block w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
                            >
                                {t('ResetPassword.requestNewLink')}
                            </Link>
                            <Link
                                to="/login"
                                className="block text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400"
                            >
                                {t('ResetPassword.backToLogin')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (resetSuccess) {
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
                                {t('ResetPassword.successTitle')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('ResetPassword.successDesc')}
                            </p>
                        </div>

                        <Link
                            to="/login"
                            className="block w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
                        >
                            {t('ResetPassword.goToLogin')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Main reset form
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
                            {t('ResetPassword.title')}
                        </h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            {t('ResetPassword.subtitle')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('ResetPassword.newPasswordLabel')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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

                            {formData.newPassword && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex items-center text-xs">
                                        <Check className={`w-3 h-3 mr-1 ${passwordStrength.length ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                        <span className={passwordStrength.length ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                                            {t('ResetPassword.min8Chars')}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-xs">
                                        <Check className={`w-3 h-3 mr-1 ${passwordStrength.uppercase ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                        <span className={passwordStrength.uppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                                            {t('ResetPassword.containsUppercase')}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-xs">
                                        <Check className={`w-3 h-3 mr-1 ${passwordStrength.lowercase ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                        <span className={passwordStrength.lowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                                            {t('ResetPassword.containsLowercase')}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-xs">
                                        <Check className={`w-3 h-3 mr-1 ${passwordStrength.number ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                        <span className={passwordStrength.number ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                                            {t('ResetPassword.containsNumber')}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('ResetPassword.confirmPasswordLabel')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 focus:ring-4 focus:ring-amber-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>{t('ResetPassword.resetting')}</span>
                                </>
                            ) : (
                                <span>{t('ResetPassword.resetPasswordButton')}</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}