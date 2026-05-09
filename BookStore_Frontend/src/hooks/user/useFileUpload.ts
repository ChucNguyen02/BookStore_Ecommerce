import { useState, useCallback } from 'react';
import { fileUploadService } from '../../services';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

export const useFileUpload = () => {
    const { language } = useAppContext();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = useCallback(async (file: File, folder: string = 'general'): Promise<string | null> => {
        try {
            setUploading(true);
            setError(null);
            const url = await fileUploadService.uploadImage(file, folder);
            return url;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Không thể tải ảnh lên' : 'Cannot upload image');
            setError(errorMsg);
            toast.error(errorMsg);
            return null;
        } finally {
            setUploading(false);
        }
    }, [language]);

    const uploadImages = useCallback(async (files: File[], folder: string = 'general'): Promise<string[]> => {
        try {
            setUploading(true);
            setError(null);
            const urls = await fileUploadService.uploadImages(files, folder);
            return urls;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Không thể tải ảnh lên' : 'Cannot upload images');
            setError(errorMsg);
            toast.error(errorMsg);
            return [];
        } finally {
            setUploading(false);
        }
    }, [language]);

    const deleteImage = useCallback(async (imageUrl: string): Promise<boolean> => {
        try {
            setError(null);
            await fileUploadService.deleteImage(imageUrl);
            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Không thể xóa ảnh' : 'Cannot delete image');
            setError(errorMsg);
            toast.error(errorMsg);
            return false;
        }
    }, [language]);

    return {
        uploading,
        error,
        uploadImage,
        uploadImages,
        deleteImage,
    };
};