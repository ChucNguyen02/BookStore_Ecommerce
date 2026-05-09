import { useTranslation } from 'react-i18next';import { useState } from 'react';
import { Lock, Eye, EyeOff, Check, Shield, Info } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { hasAuthProvider } from '../../../types/user.types';
import { AuthProvider } from '../../../types/enum';
import type { UserProfileResponse } from '../../../types/user.types';
import toast from 'react-hot-toast';

interface ChangePasswordProps {
  profile: UserProfileResponse;
  updating: boolean;
  onChangePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
  onSetPassword: (newPassword: string, confirmPassword: string) => Promise<boolean>;
}

export const ChangePassword = ({ profile, updating, onChangePassword, onSetPassword }: ChangePasswordProps) => {const { t } = useTranslation();
  const { language } = useAppContext();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const hasLocal = hasAuthProvider(profile, AuthProvider.LOCAL);
  const hasGoogle = hasAuthProvider(profile, AuthProvider.GOOGLE);
  const isGoogleOnlyUser = hasGoogle && !hasLocal; // Google user without LOCAL

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
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

    // For LOCAL users, require current password
    if (hasLocal && !formData.currentPassword) {
      toast.error(language === 'vi' ? t("Common.vuiLongNhapMatKhau") : 'Please enter current password');
      return;
    }

    if (!formData.newPassword) {
      toast.error(language === 'vi' ? t("Common.vuiLongNhapMatKhau") : 'Please enter new password');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error(language === 'vi' ? t("Common.matKhauMoiPhaiCo") : 'New password must be at least 8 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(language === 'vi' ? t("Common.matKhauXacNhanKhong") : 'Confirm password does not match');
      return;
    }

    if (hasLocal && formData.currentPassword === formData.newPassword) {
      toast.error(language === 'vi' ? t("Common.matKhauMoiPhaiKhac") : 'New password must be different from current password');
      return;
    }

    let success: boolean;

    if (isGoogleOnlyUser) {

      success = await onSetPassword(
        formData.newPassword,
        formData.confirmPassword
      );
    } else {

      success = await onChangePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );
    }

    if (success) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordStrength({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                        {isGoogleOnlyUser ?
            language === 'vi' ? t("Common.datMatKhau") : 'Set Password' :
            language === 'vi' ? t("Common.doiMatKhau") : 'Change Password'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {hasLocal && hasGoogle ?
            language === 'vi' ? t("Common.taiKhoanLocalGoogle") : 'Account: LOCAL, GOOGLE' :
            hasLocal ?
            language === 'vi' ? t("Common.taiKhoanLocal") : 'Account: LOCAL' :
            language === 'vi' ? t("Common.taiKhoanGoogle") : 'Account: GOOGLE'}
                    </p>
                </div>
            </div>

            {/* Info Box */}
            {isGoogleOnlyUser &&
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                                {language === 'vi' ? t("Common.datMatKhauDeDang") : 'Set password for more login options'}
                            </h3>
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                {language === 'vi' ? t("Common.sauKhiDatMatKhau") :

              'After setting a password, you can login with both Google or Email/Password. Login methods will become: LOCAL, GOOGLE'}
                            </p>
                        </div>
                    </div>
                </div>
      }

            {hasLocal && hasGoogle &&
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-green-900 dark:text-green-300 mb-1">
                                {language === 'vi' ? t("Common.dangNhapDaPhuongThuc") : ' Multi-Method Login'}
                            </h3>
                            <p className="text-sm text-green-800 dark:text-green-400">
                                {language === 'vi' ? t("Common.thayDoiMatKhauChi") :

              'Password changes only affect Email/Password login. You can still use Google to sign in.'}
                            </p>
                        </div>
                    </div>
                </div>
      }

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Current Password - Only for LOCAL users */}
                {hasLocal &&
        <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === 'vi' ? t("Common.matKhauHienTai") : 'Current Password'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <input
              type={showCurrentPassword ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              disabled={updating}
              className="w-full pl-11 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
              placeholder="••••••••"
              required />
            
                            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
              
                                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
        }

                {/* New Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {isGoogleOnlyUser ?
            language === 'vi' ? t("Common.matKhau") : 'Password' :
            language === 'vi' ? t("Common.matKhauMoi") : 'New Password'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <input
              type={showNewPassword ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={updating}
              className="w-full pl-11 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
              placeholder="••••••••"
              required />
            
                        <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
              
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Password Strength */}
                    {formData.newPassword &&
          <div className="mt-3 space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {language === 'vi' ? t("Common.doManhMatKhau") : 'Password Strength:'}
                            </p>
                            <div className="space-y-1">
                                <div className="flex items-center text-xs">
                                    <Check className={`w-3 h-3 mr-1 ${passwordStrength.length ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                    <span className={`${passwordStrength.length ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {language === 'vi' ? t("Common.itNhat8KyTu") : 'At least 8 characters'}
                                    </span>
                                </div>
                                <div className="flex items-center text-xs">
                                    <Check className={`w-3 h-3 mr-1 ${passwordStrength.uppercase ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                    <span className={`${passwordStrength.uppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {language === 'vi' ? t("Common.chuHoa") : 'Uppercase letter'}
                                    </span>
                                </div>
                                <div className="flex items-center text-xs">
                                    <Check className={`w-3 h-3 mr-1 ${passwordStrength.lowercase ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                    <span className={`${passwordStrength.lowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {language === 'vi' ? t("Common.chuThuong") : 'Lowercase letter'}
                                    </span>
                                </div>
                                <div className="flex items-center text-xs">
                                    <Check className={`w-3 h-3 mr-1 ${passwordStrength.number ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                    <span className={`${passwordStrength.number ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {language === 'vi' ? t("Common.so") : 'Number'}
                                    </span>
                                </div>
                            </div>
                        </div>
          }
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === 'vi' ? t("Common.xacNhanMatKhau") : 'Confirm Password'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={updating}
              className="w-full pl-11 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
              placeholder="••••••••"
              required />
            
                        <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
              
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {formData.confirmPassword && formData.newPassword !== formData.confirmPassword &&
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            {language === 'vi' ? t("Common.matKhauXacNhanKhong") : 'Passwords do not match'}
                        </p>
          }
                </div>

                {/* Submit Button */}
                <button
          type="submit"
          disabled={updating}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold">
          
                    {updating ?
          language === 'vi' ? t("Common.dangXuLy") : 'Processing...' :
          isGoogleOnlyUser ?
          language === 'vi' ? t("Common.datMatKhau") : 'Set Password' :
          language === 'vi' ? t("Common.doiMatKhau") : 'Change Password'}
                </button>
            </form>
        </div>);

};