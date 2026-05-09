import apiClient from './api.client';
import { type PageResponse } from '../types';
import {
    type QuestionResponse,
    type AnswerResponse,
    type CreateQuestionRequest,
    type AnswerQuestionRequest,
} from '../types/question.types';

class QuestionService {
    private readonly BASE_URL = '/questions';

    async createQuestion(data: CreateQuestionRequest): Promise<QuestionResponse> {
        const response = await apiClient.post<QuestionResponse>(this.BASE_URL, data);
        return response.result!;
    }

    async getBookQuestions(
        bookId: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<QuestionResponse>> {
        const response = await apiClient.get<PageResponse<QuestionResponse>>(
            `${this.BASE_URL}/book/${bookId}`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getUserQuestions(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<QuestionResponse>> {
        const response = await apiClient.get<PageResponse<QuestionResponse>>(
            `${this.BASE_URL}/my-questions`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async answerQuestion(
        questionId: string,
        data: AnswerQuestionRequest
    ): Promise<AnswerResponse> {
        const response = await apiClient.post<AnswerResponse>(
            `${this.BASE_URL}/${questionId}/answer`,
            data
        );
        return response.result!;
    }

    async deleteQuestion(questionId: string): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/${questionId}`);
    }

    async deleteAnswer(answerId: string): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/answers/${answerId}`);
    }

    async searchQuestions(
        bookId: string,
        keyword: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<QuestionResponse>> {
        const response = await apiClient.get<PageResponse<QuestionResponse>>(
            `${this.BASE_URL}/book/${bookId}/search`,
            { params: { keyword, page, size } }
        );
        return response.result!;
    }

    async countBookQuestions(bookId: string): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/book/${bookId}/count`
        );
        return response.result!;
    }

    async countUnansweredQuestions(): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/unanswered/count`
        );
        return response.result!;
    }

    async getSellerAnswer(questionId: string): Promise<AnswerResponse> {
        const response = await apiClient.get<AnswerResponse>(
            `${this.BASE_URL}/${questionId}/seller-answer`
        );
        return response.result!;
    }

    async hasSellerAnswer(questionId: string): Promise<boolean> {
        const response = await apiClient.get<boolean>(
            `${this.BASE_URL}/${questionId}/has-seller-answer`
        );
        return response.result!;
    }

    async countAnswers(questionId: string): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/${questionId}/answer-count`
        );
        return response.result!;
    }

    async deleteQuestionWithAnswers(questionId: string): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/${questionId}/with-answers`);
    }

    async getUnansweredQuestions(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<QuestionResponse>> {
        const response = await apiClient.get<PageResponse<QuestionResponse>>(
            `${this.BASE_URL}/unanswered`,
            { params: { page, size } }
        );
        return response.result!;
    }
}

export const questionService = new QuestionService();
export default questionService;