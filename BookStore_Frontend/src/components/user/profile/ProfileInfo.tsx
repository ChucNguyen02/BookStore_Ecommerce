import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, Camera, Save, X, AlertCircle, Check, Lock, Trash2, AlertTriangle } from 'lucide-react';
import type { UserProfileResponse, UpdateProfileRequest } from '../../../types/user.types';
import { getAuthProviderBadges, hasAuthProvider } from '../../../types/user.types';
import { AuthProvider } from '../../../types/enum';
import { useAppContext } from '../../../context/AppContext';
import { fileUploadService } from '../../../services';
import toast from 'react-hot-toast';

interface ProfileInfoProps {
  profile: UserProfileResponse;
  updating: boolean;
  onUpdate: (data: UpdateProfileRequest) => Promise<boolean>;
  onRequestEmailChange?: (newEmail: string) => Promise<boolean>;
  onSendVerificationEmail?: () => Promise<boolean>;
  onDeleteAccount: () => Promise<boolean>;
}

export const ProfileInfo = ({
  profile,
  updating,
  onUpdate,
  onRequestEmailChange,
  onSendVerificationEmail,
  onDeleteAccount
}: ProfileInfoProps) => {const { t } = useTranslation();
  const { language } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Avatar states - simplified
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState(profile.avatarUrl);

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    fullName: profile.fullName,
    phone: profile.phone || ''
  });

  const authProviders = getAuthProviderBadges(profile.authProviders);
  const hasLocal = authProviders.includes('LOCAL');
  const hasGoogle = authProviders.includes('GOOGLE');
  const hasLocalProvider = hasAuthProvider(profile, AuthProvider.LOCAL);
  const canChangeEmail = hasLocalProvider && !profile.emailVerified;

  useEffect(() => {
    setFormData({
      fullName: profile.fullName,
      phone: profile.phone || ''
    });
    setPreviewAvatar(profile.avatarUrl);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle local preview only
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(language === 'vi' ? t("Common.kichThuocAnhKhongDuoc") : 'Image size must not exceed 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(language === 'vi' ? t("Common.chiChapNhanFileJpg") : 'Only JPG, PNG, WEBP files are accepted');
      return;
    }

    // Create local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewAvatar(reader.result as string);
      setAvatarFile(file);
    };
    reader.readAsDataURL(file);

    toast.success(language === 'vi' ? t("Common.anhDaDuocChonNhan") : 'Image selected. Click Save to update.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error(language === 'vi' ? t("Common.vuiLongNhapHoTen") : 'Please enter your full name');
      return;
    }

    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        toast.error(language === 'vi' ? t("Common.soDienThoaiKhongHop") :

        'Invalid phone number. Format: 0xxxxxxxxx or +84xxxxxxxxx');
        return;
      }
    }

    try {
      const finalData = { ...formData };

      if (!finalData.phone || !finalData.phone.trim()) {
        finalData.phone = undefined as any;
      } else {
        finalData.phone = finalData.phone.trim();
      }

      // Upload new avatar if selected
      if (avatarFile) {
        toast.loading(language === 'vi' ? t("Common.dangTaiAnhLen") : 'Uploading image...');

        // BỎ PHẦN XÓA ẢNH CŨ - Backend sẽ tự động xóa
        // Chỉ cần upload ảnh mới
        const avatarUrl = await fileUploadService.uploadImage(avatarFile, 'avatars');
        finalData.avatarUrl = avatarUrl;

        toast.dismiss();
      }

      const success = await onUpdate(finalData);
      if (success) {
        setIsEditing(false);
        setAvatarFile(null);
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || (language === 'vi' ? t("Common.capNhatThatBai") : 'Update failed'));
    }
  };

  const handleEmailChangeRequest = async () => {
    if (!newEmail.trim()) {
      toast.error(language === 'vi' ? t("Common.vuiLongNhapEmailMoi") : 'Please enter new email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error(language === 'vi' ? t("Common.emailKhongHopLe") : 'Invalid email format');
      return;
    }

    if (newEmail === profile.email) {
      toast.error(language === 'vi' ? t("Common.emailMoiPhaiKhacEmail") : 'New email must be different');
      return;
    }

    if (onRequestEmailChange) {
      const success = await onRequestEmailChange(newEmail);
      if (success) {
        setShowEmailChange(false);
        setNewEmail('');
      }
    }
  };

  const handleSendVerificationEmail = async () => {
    if (onSendVerificationEmail) {
      await onSendVerificationEmail();
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile.fullName,
      phone: profile.phone || ''
    });
    setPreviewAvatar(profile.avatarUrl);
    setAvatarFile(null);
    setIsEditing(false);
    setShowEmailChange(false);
    setNewEmail('');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error(language === 'vi' ? t("Common.vuiLongNhapDeleteDe") : 'Please type "DELETE" to confirm');
      return;
    }

    const success = await onDeleteAccount();
    if (success) {
      setShowDeleteModal(false);
      setDeleteConfirmText('');
    }
  };

  return (
    <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                        {language === 'vi' ? t("Common.thongTinCaNhan") : 'Personal Information'}
                    </h2>
                    {!isEditing &&
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
            
                            {language === 'vi' ? t("Common.chinhSua") : 'Edit'}
                        </button>
          }
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar - Simplified */}
                    <div className="flex items-start gap-6">
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative">
                                {previewAvatar ?
                <img
                  src={previewAvatar}
                  alt={profile.fullName}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-amber-200 dark:ring-amber-800" /> :


                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-amber-200 dark:ring-amber-800">
                                        {profile.fullName.charAt(0).toUpperCase()}
                                    </div>
                }
                                {isEditing &&
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-amber-600 transition-colors">
                                        <Camera className="w-4 h-4 text-white" />
                                        <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleAvatarSelect}
                    className="hidden" />
                  
                                    </label>
                }
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                {language === 'vi' ? t("Common.anhDaiDien") : 'Profile Picture'}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                {language === 'vi' ? t("Common.jpgPngWebpToiDa") : 'JPG, PNG, WEBP. Max 5MB'}
                            </p>
                            {avatarFile &&
              <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                    <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                    <span className="text-xs text-green-700 dark:text-green-400">
                                        {language === 'vi' ? t("Common.anhMoiDaChon") : 'New image selected'}
                                    </span>
                                </div>
              }
                            {isEditing && profile.avatarUrl &&
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                                    {language === 'vi' ? t("Common.anhCuSeBiXoa") :

                '⚠️ Old avatar will be deleted when updating'}
                                </p>
              }
                        </div>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === 'vi' ? t("Common.hoVaTen") : 'Full Name'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing || updating}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
                required />
              
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <input
                type="email"
                value={profile.email}
                disabled
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 cursor-not-allowed" />
              
                        </div>

                        {!canChangeEmail &&
            <div className="mt-2 flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-green-800 dark:text-green-300">
                                    {language === 'vi' ? t("Common.emailDaDuocXacThuc") :

                'Email verified. Cannot change email.'}
                                </p>
                            </div>
            }

                        {canChangeEmail && !showEmailChange &&
            <div className="mt-2 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-blue-800 dark:text-blue-300 mb-2">
                                        {language === 'vi' ? t("Common.emailChuaDuocXacThuc") :

                  'Email not verified. You can change or verify current email.'}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                    type="button"
                    onClick={() => setShowEmailChange(true)}
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    
                                            {language === 'vi' ? t("Common.doiEmail") : 'Change email'}
                                        </button>
                                        <span className="text-xs text-blue-400 dark:text-blue-500">•</span>
                                        <button
                    type="button"
                    onClick={handleSendVerificationEmail}
                    disabled={updating}
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50">
                    
                                            {language === 'vi' ? t("Common.xacThucEmail") : 'Verify email'}
                                        </button>
                                    </div>
                                </div>
                            </div>
            }

                        {showEmailChange &&
            <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-3">
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                                    {language === 'vi' ? t("Common.doiEmail") : 'Change Email'}
                                </p>
                                <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={language === 'vi' ? t("Common.emailMoi") : 'New email'}
                className="w-full px-4 py-2 border border-blue-300 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              
                                <div className="flex gap-2">
                                    <button
                  type="button"
                  onClick={() => {
                    setShowEmailChange(false);
                    setNewEmail('');
                  }}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  
                                        {language === 'vi' ? t("Common.huy") : 'Cancel'}
                                    </button>
                                    <button
                  type="button"
                  onClick={handleEmailChangeRequest}
                  disabled={updating}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  
                                        {updating ? language === 'vi' ? t("Common.dangXuLy") : 'Processing...' : language === 'vi' ? t("Common.xacNhan") : 'Confirm'}
                                    </button>
                                </div>
                                <p className="text-xs text-blue-700 dark:text-blue-400">
                                    {language === 'vi' ? t("Common.linkXacThucSeDuoc") :

                'Verification link will be sent to new email. You will need to login again after verification.'}
                                </p>
                            </div>
            }
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === 'vi' ? t("Common.soDienThoai") : 'Phone Number'}
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing || updating}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
                placeholder={language === 'vi' ? '0123456789' : '0123456789'} />
              
                        </div>
                        {isEditing && formData.phone && formData.phone.trim() &&
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {language === 'vi' ? t("Common.dinhDang0xxxxxxxxxHoac84xxxxxxxxx") :

              'Format: 0xxxxxxxxx or +84xxxxxxxxx'}
                            </p>
            }
                    </div>

                    {/* Account Info */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                {language === 'vi' ? t("Common.phuongThucDangNhap") : 'Login Methods:'}
                            </span>
                            <div className="flex gap-2">
                                {authProviders.map((provider) =>
                <span
                  key={provider}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${provider === 'LOCAL' ?
                  'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' :
                  'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'}`
                  }>
                  
                                        {provider}
                                    </span>
                )}
                            </div>
                        </div>

                        {hasLocal && hasGoogle &&
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-green-900 dark:text-green-300 mb-1">
                                            {language === 'vi' ? t("Common.taiKhoanDaDuocLien") : 'Account Linked'}
                                        </p>
                                        <p className="text-xs text-green-800 dark:text-green-400">
                                            {language === 'vi' ? t("Common.banCoTheDangNhap") :

                    'You can login with both Email/Password or Google'}
                                        </p>
                                    </div>
                                </div>
                            </div>
            }

                        {profile.emailVerified && hasGoogle && !hasLocal &&
            <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-amber-900 dark:text-amber-300 mb-1">
                                            {language === 'vi' ? t("Common.datMatKhau") : 'Set Password'}
                                        </p>
                                        <p className="text-xs text-amber-800 dark:text-amber-400">
                                            {language === 'vi' ? t("Common.datMatKhauDeCo") :

                    'Set a password to enable email/password login'}
                                        </p>
                                    </div>
                                </div>
                            </div>
            }

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                {language === 'vi' ? t("Common.vaiTro") : 'Role:'}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">{profile.role}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                {language === 'vi' ? t("Common.trangThai") : 'Status:'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${profile.isActive ?
              'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' :
              'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'}`
              }>
                                {profile.isActive ?
                language === 'vi' ? t("Common.hoatDong") : 'Active' :
                language === 'vi' ? t("Common.khongHoatDong") : 'Inactive'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                {language === 'vi' ? t("Common.emailDaXacThuc") : 'Email Verified:'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${profile.emailVerified ?
              'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' :
              'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'}`
              }>
                                {profile.emailVerified ?
                language === 'vi' ? t("Common.daXacThuc") : 'Verified' :
                language === 'vi' ? t("Common.chuaXacThuc") : 'Not Verified'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                {language === 'vi' ? t("Common.ngayThamGia") : 'Member Since:'}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {new Date(profile.createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing &&
          <div className="flex gap-3 pt-4">
                            <button
              type="button"
              onClick={handleCancel}
              disabled={updating}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              
                                <X className="w-5 h-5" />
                                {language === 'vi' ? t("Common.huy") : 'Cancel'}
                            </button>
                            <button
              type="submit"
              disabled={updating}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              
                                {updating ?
              <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        {language === 'vi' ? t("Common.dangLuu") : 'Saving...'}
                                    </> :

              <>
                                        <Save className="w-5 h-5" />
                                        {language === 'vi' ? t("Common.luuThayDoi") : 'Save Changes'}
                                    </>
              }
                            </button>
                        </div>
          }
                </form>

                {/* Delete Account Section */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">
                                {language === 'vi' ? t("Common.xoaTaiKhoan") : 'Delete Account'}
                            </h3>
                            <p className="text-xs text-red-800 dark:text-red-400 mb-3">
                                {language === 'vi' ? t("Common.xoaVinhVienTaiKhoan") :

                'Permanently delete your account and all your data. This action cannot be undone.'}
                            </p>
                            <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm">
                
                                <Trash2 className="w-4 h-4" />
                                {language === 'vi' ? t("Common.xoaTaiKhoan") : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>



            {/* Delete Confirmation Modal */}
            {showDeleteModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {language === 'vi' ? t("Common.xacNhanXoaTaiKhoan") : 'Confirm Account Deletion'}
                            </h3>
                        </div>

                        <div className="space-y-4 mb-6">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {language === 'vi' ? t("Common.banCoChacChanMuon") :

              'Are you sure you want to delete your account? This will:'}
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-0.5">•</span>
                                    <span>
                                        {language === 'vi' ? t("Common.xoaVinhVienTatCa") :

                  'Permanently delete all your personal data'}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-0.5">•</span>
                                    <span>
                                        {language === 'vi' ? t("Common.xoaLichSuDonHang") :

                  'Delete order history and reward points'}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-0.5">•</span>
                                    <span>
                                        {language === 'vi' ? t("Common.xoaTatCaAnhDai") :

                  'Delete all avatars from Cloudinary'}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-0.5">•</span>
                                    <span>
                                        {language === 'vi' ? t("Common.khongTheKhoiPhucTai") :

                  'Account cannot be recovered after deletion'}
                                    </span>
                                </li>
                            </ul>

                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                                    {language === 'vi' ? t("Common.luuYNeuBanCo") :

                '⚠️ Note: If you have pending orders, your account cannot be deleted until all orders are completed.'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {language === 'vi' ? t("Common.nhapDeleteDeXacNhan") :

                'Type "DELETE" to confirm:'}
                                </label>
                                <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
              type="button"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmText('');
              }}
              disabled={updating}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
              
                                {language === 'vi' ? t("Common.huy") : 'Cancel'}
                            </button>
                            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={updating || deleteConfirmText !== 'DELETE'}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              
                                {updating ?
              <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        {language === 'vi' ? t("Common.dangXoa") : 'Deleting...'}
                                    </> :

              <>
                                        <Trash2 className="w-4 h-4" />
                                        {language === 'vi' ? t("Common.xoaVinhVien") : 'Delete Permanently'}
                                    </>
              }
                            </button>
                        </div>
                    </div>
                </div>
      }
        </>);

};