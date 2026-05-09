import { useState, useEffect, useCallback } from 'react';
import { questionService } from '../../services';
import { toast } from 'react-hot-toast';
import type { PageResponse } from '../../types/base.types';
import type { QuestionResponse } from '../../types/question.types';

interface UseAdminQuestionsParams {
    page?: number;
    size?: number;
    status?: 'unanswered' | 'answered';
}

interface QuestionStats {
    totalQuestions: number;
    answeredQuestions: number;
    unansweredQuestions: number;
    answerRate: number;
}

export function useAdminQuestions(params: UseAdminQuestionsParams = {}) {
    const { page = 0, size = 20, status } = params;
    
    const [questions, setQuestions] = useState<PageResponse<QuestionResponse> | null>(null);
    const [stats, setStats] = useState<QuestionStats>({
        totalQuestions: 0,
        answeredQuestions: 0,
        unansweredQuestions: 0,
        answerRate: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchQuestions = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            let data: PageResponse<QuestionResponse>;

            if (status === 'unanswered') {
                data = await questionService.getUnansweredQuestions(page, size);
            } else {
                // For 'all' and 'answered', we need to fetch and filter
                // Since there's no direct endpoint, we'll fetch all and filter client-side
                const allQuestions = await questionService.getUnansweredQuestions(0, 1000);
                
                if (status === 'answered') {
                    // This would need a backend endpoint, for now just return empty
                    data = {
                        content: [],
                        pageNumber: page,
                        pageSize: size,
                        totalElements: 0,
                        totalPages: 0,
                        first: true,
                        last: true,
                        empty: true
                    };
                } else {
                    data = allQuestions;
                }
            }

            setQuestions(data);

            // Calculate stats
            const totalQuestions = data.totalElements;
            const answeredQuestions = data.content.filter(q => q.isAnswered).length;
            const unansweredQuestions = totalQuestions - answeredQuestions;
            const answerRate = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

            setStats({
                totalQuestions,
                answeredQuestions,
                unansweredQuestions,
                answerRate
            });
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to fetch questions';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [page, size, status]);

    const deleteQuestion = async (questionId: string): Promise<boolean> => {
        try {
            await questionService.deleteQuestion(questionId);
            toast.success('Question deleted successfully');
            fetchQuestions();
            return true;
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to delete question';
            toast.error(errorMessage);
            return false;
        }
    };

    const deleteAnswer = async (answerId: string): Promise<boolean> => {
        try {
            await questionService.deleteAnswer(answerId);
            toast.success('Answer deleted successfully');
            fetchQuestions();
            return true;
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to delete answer';
            toast.error(errorMessage);
            return false;
        }
    };

    const answerQuestion = async (questionId: string, answer: string): Promise<boolean> => {
        try {
            await questionService.answerQuestion(questionId, { answer });
            toast.success('Answer submitted successfully');
            fetchQuestions();
            return true;
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to submit answer';
            toast.error(errorMessage);
            return false;
        }
    };

    const getQuestionDetail = async (questionId: string) => {
        try {
            // Since there's no direct getById endpoint, find in current list
            const question = questions?.content.find(q => q.id === questionId);
            return question || null;
        } catch (err: any) {
            toast.error(err?.message || 'Failed to get question detail');
            return null;
        }
    };

    const countUnansweredQuestions = async (): Promise<number> => {
        try {
            return await questionService.countUnansweredQuestions();
        } catch (err: any) {
            toast.error(err?.message || 'Failed to count unanswered questions');
            return 0;
        }
    };

    const searchQuestions = async (bookId: string, keyword: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await questionService.searchQuestions(bookId, keyword, page, size);
            setQuestions(data);
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to search questions';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteQuestionWithAnswers = async (questionId: string): Promise<boolean> => {
        try {
            await questionService.deleteQuestionWithAnswers(questionId);
            toast.success('Question and all answers deleted successfully');
            fetchQuestions();
            return true;
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to delete question with answers';
            toast.error(errorMessage);
            return false;
        }
    };

    const getSellerAnswer = async (questionId: string) => {
        try {
            return await questionService.getSellerAnswer(questionId);
        } catch (err: any) {
            // Seller answer might not exist, don't show error
            return null;
        }
    };

    const hasSellerAnswer = async (questionId: string): Promise<boolean> => {
        try {
            return await questionService.hasSellerAnswer(questionId);
        } catch (err: any) {
            return false;
        }
    };

    const countAnswers = async (questionId: string): Promise<number> => {
        try {
            return await questionService.countAnswers(questionId);
        } catch (err: any) {
            return 0;
        }
    };

    const countBookQuestions = async (bookId: string): Promise<number> => {
        try {
            return await questionService.countBookQuestions(bookId);
        } catch (err: any) {
            return 0;
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    return {
        questions,
        stats,
        isLoading,
        error,
        deleteQuestion,
        deleteAnswer,
        answerQuestion,
        getQuestionDetail,
        countUnansweredQuestions,
        searchQuestions,
        deleteQuestionWithAnswers,
        getSellerAnswer,
        hasSellerAnswer,
        countAnswers,
        countBookQuestions,
        refetch: fetchQuestions
    };
}