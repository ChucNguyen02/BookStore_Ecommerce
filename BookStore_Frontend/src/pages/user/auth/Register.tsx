import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, Phone, Eye, EyeOff, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/user/useAuth';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'password') {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error(t('Register.requiredFields'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('Register.passwordMismatch'));
      return;
    }

    if (formData.password.length < 8) {
      toast.error(t('Register.passwordTooShort'));
      return;
    }

    if (!formData.agreeTerms) {
      toast.error(t('Register.agreeTerms'));
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone || undefined
      });

      navigate('/');
    } catch (error: unknown) {
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 dark:from-amber-600 dark:via-orange-600 dark:to-red-600 p-12 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
                <div className="relative z-10 text-white space-y-6 max-w-md">
                    <div className="animate-fadeInLeft">
                        <BookOpen className="w-20 h-20 mb-6" />
                        <h2 className="text-4xl font-serif font-bold mb-4">{t('Register.illustrationTitle')}</h2>
                        <p className="text-lg text-white/90">{t('Register.illustrationDesc')}</p>
                    </div>

                    <div className="space-y-4 pt-8">
                        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Check className="w-6 h-6" />
                            </div>
                            <p className="text-white/90">{t('Register.benefit1')}</p>
                        </div>
                        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Check className="w-6 h-6" />
                            </div>
                            <p className="text-white/90">{t('Register.benefit2')}</p>
                        </div>
                        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Check className="w-6 h-6" />
                            </div>
                            <p className="text-white/90">{t('Register.benefit3')}</p>
                        </div>
                    </div>
                </div>

                <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Right Side - Form */}
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
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">{t('Register.title')}</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{t('Register.subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('Register.fullName')} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="John Doe"
                  disabled={isLoading} />
                
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('Register.email')} <span className="text-red-500">*</span>
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
                  disabled={isLoading} />
                
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('Register.phone')}
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="0123456789"
                  disabled={isLoading} />
                
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('Register.password')} <span className="text-red-500">*</span>
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
                  disabled={isLoading} />
                
                                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                  
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength */}
                            {formData.password &&
              <div className="mt-2 space-y-1">
                                    <div className="flex items-center text-xs">
                                        <Check className={`w-3 h-3 mr-1 ${passwordStrength.length ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                        <span className={`${passwordStrength.length ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {t('Register.min8Chars')}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-xs">
                                        <Check className={`w-3 h-3 mr-1 ${passwordStrength.uppercase ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                        <span className={`${passwordStrength.uppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {t('Register.uppercase')}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-xs">
                                        <Check className={`w-3 h-3 mr-1 ${passwordStrength.lowercase ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                        <span className={`${passwordStrength.lowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {t('Register.lowercase')}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-xs">
                                        <Check className={`w-3 h-3 mr-1 ${passwordStrength.number ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                        <span className={`${passwordStrength.number ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {t('Register.number')}
                                        </span>
                                    </div>
                                </div>
              }
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('Register.confirmPassword')} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="••••••••"
                  disabled={isLoading} />
                
                                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                  
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start">
                            <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 mt-1 text-amber-600 dark:text-amber-500 border-gray-300 dark:border-gray-700 rounded focus:ring-amber-500 dark:focus:ring-amber-400" />
              
                            <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                {t('Register.termsStart')}{' '}
                                <Link to="/terms" className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium">
                                    {t('Register.terms')}
                                </Link>
                                {' '}{t("Common.va")}{' '}
                                <Link to="/privacy" className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium">
                                    {t('Register.privacy')}
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 focus:ring-4 focus:ring-amber-300 dark:focus:ring-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
              
                            {isLoading ?
              <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>{t('Register.registering')}</span>
                                </> :

              <span>{t('Register.register')}</span>
              }
                        </button>

                        {/* Login Link */}
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                            {t('Register.haveAccount')}{' '}
                            <Link to="/login" className="font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300">
                                {t('Register.login')}
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>);

}