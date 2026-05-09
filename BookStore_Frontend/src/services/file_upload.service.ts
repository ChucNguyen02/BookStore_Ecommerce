import apiClient from './api.client';

class FileUploadService {
    private readonly BASE_URL = '/upload';

    async uploadImage(file: File, folder: string = 'general'): Promise<string> {
        const response = await apiClient.uploadFile<string>(
            `${this.BASE_URL}/image`,
            file,
            folder
        );
        return response.result!;
    }

    async uploadImages(files: File[], folder: string = 'general'): Promise<string[]> {
        const response = await apiClient.uploadFiles<string[]>(
            `${this.BASE_URL}/images`,
            files,
            folder
        );
        return response.result!;
    }

    async deleteImage(imageUrl: string): Promise<void> {
        await apiClient.delete<void>(
            `${this.BASE_URL}/image`,
            { params: { imageUrl } }
        );
    }
}

export const fileUploadService = new FileUploadService();
export default fileUploadService;