import apiClient from './api.client';
import { type PageResponse } from '../types';
import {
  type AuthorResponse,
  type AuthorRequest,
} from '../types/author.types';

class AuthorService {
  private readonly BASE_URL = '/authors';

  /**
   * Lấy danh sách tất cả authors (phân trang)
   */
  async getAllAuthors(
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<AuthorResponse>> {
    const response = await apiClient.get<PageResponse<AuthorResponse>>(
      this.BASE_URL,
      {
        params: { page, size },
      }
    );

    if (!response.result) {
      throw new Error(response.message || 'Failed to fetch authors');
    }

    return response.result;
  }

  /**
   * Lấy author theo ID
   */
  async getAuthorById(authorId: string): Promise<AuthorResponse> {
    const response = await apiClient.get<AuthorResponse>(
      `${this.BASE_URL}/${authorId}`
    );

    if (!response.result) {
      throw new Error(response.message || `Author with ID ${authorId} not found`);
    }

    return response.result;
  }

  /**
   * Lấy author theo tên (exact match)
   */
  async getAuthorByName(name: string): Promise<AuthorResponse> {
    const response = await apiClient.get<AuthorResponse>(
      `${this.BASE_URL}/name/${encodeURIComponent(name)}`
    );

    if (!response.result) {
      throw new Error(response.message || `Author "${name}" not found`);
    }

    return response.result;
  }

  /**
   * Tìm kiếm authors theo keyword
   */
  async searchAuthors(
    keyword: string,
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<AuthorResponse>> {
    const response = await apiClient.get<PageResponse<AuthorResponse>>(
      `${this.BASE_URL}/search`,
      {
        params: { keyword, page, size },
      }
    );

    if (!response.result) {
      throw new Error(response.message || 'Search failed');
    }

    return response.result;
  }

  /**
   * Lấy top authors (phổ biến nhất)
   */
  async getTopAuthors(
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<AuthorResponse>> {
    const response = await apiClient.get<PageResponse<AuthorResponse>>(
      `${this.BASE_URL}/top`,
      {
        params: { page, size },
      }
    );

    if (!response.result) {
      throw new Error(response.message || 'Failed to fetch top authors');
    }

    return response.result;
  }

  /**
   * Tạo author mới (dành cho admin)
   */
  async createAuthor(data: AuthorRequest): Promise<AuthorResponse> {
    const response = await apiClient.post<AuthorResponse>(this.BASE_URL, data);

    if (!response.result) {
      throw new Error(response.message || 'Failed to create author');
    }

    return response.result;
  }

  /**
   * Cập nhật author
   */
  async updateAuthor(
    authorId: string,
    data: AuthorRequest
  ): Promise<AuthorResponse> {
    const response = await apiClient.put<AuthorResponse>(
      `${this.BASE_URL}/${authorId}`,
      data
    );

    if (!response.result) {
      throw new Error(response.message || 'Failed to update author');
    }

    return response.result;
  }

  /**
   * Xóa author
   */
  async deleteAuthor(authorId: string): Promise<void> {
    await apiClient.delete<unknown>(`${this.BASE_URL}/${authorId}`);
  }
}

export const authorService = new AuthorService();
export default authorService;