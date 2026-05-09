import apiClient from './api.client';

import { type CategoryResponse, type CategorySimpleResponse, type CategoryRequest } from '../types/category.types';

class CategoryService {
    private readonly BASE_URL = '/categories';

    async getAllCategories(): Promise<CategoryResponse[]> {
        const response = await apiClient.get<CategoryResponse[]>(this.BASE_URL);
        return response.result!;
    }

    async getParentCategories(): Promise<CategoryResponse[]> {
        const response = await apiClient.get<CategoryResponse[]>(
            `${this.BASE_URL}/parents`
        );
        return response.result!;
    }

    async getChildCategories(parentId: string): Promise<CategorySimpleResponse[]> {
        const response = await apiClient.get<CategorySimpleResponse[]>(
            `${this.BASE_URL}/${parentId}/children`
        );
        return response.result!;
    }

    async getCategoryBySlug(slug: string): Promise<CategoryResponse> {
        const response = await apiClient.get<CategoryResponse>(
            `${this.BASE_URL}/slug/${slug}`
        );
        return response.result!;
    }

    async isSlugExists(slug: string): Promise<boolean> {
        const response = await apiClient.get<boolean>(
            `${this.BASE_URL}/check-slug/${slug}`
        );
        return response.result!;
    }

    async searchCategories(keyword: string): Promise<CategoryResponse[]> {
        const response = await apiClient.get<CategoryResponse[]>(
            `${this.BASE_URL}/search`,
            { params: { keyword } }
        );
        return response.result!;
    }

    async createCategory(data: CategoryRequest): Promise<CategoryResponse> {
        const response = await apiClient.post<CategoryResponse>(this.BASE_URL, data);
        return response.result!;
    }

    async updateCategory(
        categoryId: string,
        data: CategoryRequest
    ): Promise<CategoryResponse> {
        const response = await apiClient.put<CategoryResponse>(
            `${this.BASE_URL}/${categoryId}`,
            data
        );
        return response.result!;
    }

    async deleteCategory(categoryId: string): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/${categoryId}`);
    }
}

export const categoryService = new CategoryService();
export default categoryService;