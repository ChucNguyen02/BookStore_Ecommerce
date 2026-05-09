import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type AuthorRequest, type AuthorResponse } from '../../../types';
import { fileUploadService } from '../../../services';

interface AuthorFormModalProps {
    isOpen: boolean;
    author: AuthorResponse | null;
    onClose: () => void;
    onSubmit: (data: AuthorRequest) => Promise<void>;
}

export default function AuthorFormModal({ isOpen, author, onClose, onSubmit }: AuthorFormModalProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<AuthorRequest>({
        name: '',
        bio: null,
        avatarUrl: null,
        birthDate: null,
        nationality: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (author) {
            setFormData({
                name: author.name,
                bio: author.bio,
                avatarUrl: author.avatarUrl,
                birthDate: author.birthDate,
                nationality: author.nationality,
            });
        } else {
            setFormData({
                name: '',
                bio: null,
                avatarUrl: null,
                birthDate: null,
                nationality: null,
            });
        }
        setErrors({});
    }, [author, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value || null
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({ ...prev, avatarUrl: 'Please select an image file' }));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, avatarUrl: 'Image size must be less than 5MB' }));
            return;
        }

        setIsUploading(true);
        try {
            const imageUrl = await fileUploadService.uploadImage(file, 'authors');
            setFormData(prev => ({ ...prev, avatarUrl: imageUrl }));
            setErrors(prev => ({ ...prev, avatarUrl: '' }));
        } catch (error: any) {
            setErrors(prev => ({ ...prev, avatarUrl: error.message || 'Failed to upload image' }));
        } finally {
            setIsUploading(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name?.trim()) {
            newErrors.name = t('validation.required', { field: t('admin.authorName') });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to save author' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="card max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {author ? t('admin.editAuthor') : t('admin.createAuthor')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors hover-scale"
                        aria-label={t('common.close')}
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
                    {/* Avatar Upload */}
                    <div className="animate-fadeInUp">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            {t('admin.avatar')}
                        </label>
                        <div className="flex items-center space-x-4">
                            {formData.avatarUrl ? (
                                <div className="relative group">
                                    <img
                                        src={formData.avatarUrl}
                                        alt="Avatar"
                                        className="w-24 h-24 rounded-full object-cover ring-4 ring-amber-100 dark:ring-amber-900/30 transition-transform hover-scale"
                                    />
                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Upload className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center hover-scale transition-transform">
                                    <Upload className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                                </div>
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                    className="hidden"
                                    id="avatar-upload"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className="btn-secondary inline-flex items-center cursor-pointer"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {t('common.uploading')}
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            {t('admin.uploadImage')}
                                        </>
                                    )}
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    {t('admin.maxFileSize')}: 5MB
                                </p>
                                {errors.avatarUrl && (
                                    <div className="badge badge-danger mt-2 animate-fadeIn">
                                        {errors.avatarUrl}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Name Field */}
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('admin.authorName')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`input-field ${errors.name ? 'border-red-500 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900/30' : ''
                                }`}
                            placeholder={t('admin.enterAuthorName')}
                        />
                        {errors.name && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1 animate-fadeIn">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Bio Field */}
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('admin.bio')}
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio || ''}
                            onChange={handleInputChange}
                            rows={4}
                            className="input-field resize-none"
                            placeholder={t('admin.enterBio')}
                        />
                    </div>

                    {/* Birth Date & Nationality - Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.birthDate')}
                            </label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate || ''}
                                onChange={handleInputChange}
                                className="input-field"
                            />
                        </div>

                        <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.nationality')}
                            </label>
                            <input
                                type="text"
                                name="nationality"
                                value={formData.nationality || ''}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder={t('admin.enterNationality')}
                            />
                        </div>
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="card border-l-4 border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/20 p-4 animate-fadeIn">
                            <div className="flex items-start space-x-3">
                                <span className="badge badge-danger">
                                    {t('common.error')}
                                </span>
                                <p className="text-red-600 dark:text-red-400 text-sm flex-1">
                                    {errors.submit}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary w-full sm:flex-1"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isUploading}
                            className="btn-primary w-full sm:flex-1 flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    {t('common.saving')}
                                </>
                            ) : (
                                t('common.save')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}