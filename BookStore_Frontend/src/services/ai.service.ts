import apiClient from './api.client';

export interface AiChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface AiChatRequest {
    message: string;
    history?: AiChatMessage[];
}

export interface AiChatResponse {
    reply: string;
}

export interface AiRecommendRequest {
    preferences: string;
}

export interface AiRecommendResponse {
    recommendations: string;
}

export interface AiSummarizeResponse {
    summary: string;
    reviewCount: string;
}

export interface AiGenerateDescriptionRequest {
    title: string;
    author?: string;
    category?: string;
    existingDescription?: string;
}

export interface AiGenerateDescriptionResponse {
    description: string;
}

class AiService {
    /**
     * Chat với AI trợ lý - Tư vấn sách
     */
    async chat(request: AiChatRequest): Promise<AiChatResponse> {
        const response = await apiClient.post<AiChatResponse>('/ai/chat', request);
        return response.result;
    }

    /**
     * Gợi ý sách dựa trên sở thích
     */
    async recommend(preferences: string): Promise<AiRecommendResponse> {
        const response = await apiClient.post<AiRecommendResponse>('/ai/recommend', {
            preferences,
        });
        return response.result;
    }

    /**
     * Tóm tắt reviews của một cuốn sách
     */
    async summarizeReviews(bookId: string): Promise<AiSummarizeResponse> {
        const response = await apiClient.get<AiSummarizeResponse>(
            `/ai/summarize-reviews/${bookId}`
        );
        return response.result;
    }

    /**
     * Tạo mô tả sách bằng AI (Admin only)
     */
    async generateDescription(
        request: AiGenerateDescriptionRequest
    ): Promise<AiGenerateDescriptionResponse> {
        const response = await apiClient.post<AiGenerateDescriptionResponse>(
            '/ai/generate-description',
            request
        );
        return response.result;
    }
}

const aiService = new AiService();
export default aiService;
export { aiService };
