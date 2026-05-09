import { useState, useCallback } from 'react';
import { questionService, authService } from '../../services';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import type { AnswerQuestionRequest, PageResponse, QuestionResponse, } from '../../types';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useQuestions = (bookId: string) => {
    const { language } = useAppContext();
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [totalQuestions, setTotalQuestions] = useState(0);

    const currentUser = authService.getStoredUser();
    const isLoggedIn = !!currentUser;


    const loadQuestions = useCallback(async (resetPage = false) => {
        try {
            setLoading(true);
            const pageToLoad = resetPage ? 0 : currentPage;

            const response = searchKeyword
                ? await questionService.searchQuestions(bookId, searchKeyword, pageToLoad, 10)
                : await questionService.getBookQuestions(bookId, pageToLoad, 10);

            if (resetPage) {
                setQuestions(response.content);
                setCurrentPage(0);
            } else {

                setQuestions(response.content);
            }

            setHasMore(!response.last);
        } catch (error: unknown) {
            toast.error((error as Error).message || (language === 'vi' ? 'Không thể tải câu hỏi' : 'Cannot load questions'));
        } finally {
            setLoading(false);
        }
    }, [bookId, searchKeyword, currentPage, language]);

    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            const nextPage = currentPage + 1;

            const response = searchKeyword
                ? await questionService.searchQuestions(bookId, searchKeyword, nextPage, 10)
                : await questionService.getBookQuestions(bookId, nextPage, 10);

            setQuestions(prev => [...prev, ...response.content]);
            setCurrentPage(nextPage);
            setHasMore(!response.last);
        } catch (error: unknown) {
            toast.error((error as Error).message);
        } finally {
            setLoadingMore(false);
        }
    }, [bookId, searchKeyword, currentPage, hasMore, loadingMore]);

    const loadQuestionCount = useCallback(async () => {
        try {
            const count = await questionService.countBookQuestions(bookId);
            setTotalQuestions(count);
        } catch (error) {
            console.error('Cannot load question count:', error);
        }
    }, [bookId]);

    const updateSearch = useCallback((keyword: string) => {
        setSearchKeyword(keyword);
        setCurrentPage(0);
    }, []);

    const createQuestion = useCallback(async (questionText: string): Promise<boolean> => {
        if (!isLoggedIn) {
            toast.error(language === 'vi'
                ? 'Vui lòng đăng nhập để đặt câu hỏi'
                : 'Please login to ask a question');
            return false;
        }

        if (!questionText.trim()) {
            return false;
        }

        try {
            setSubmitting(true);
            await questionService.createQuestion({
                bookId,
                question: questionText.trim(),
            });
            toast.success(language === 'vi' ? 'Gửi câu hỏi thành công' : 'Question submitted successfully');

            await loadQuestions(true);
            await loadQuestionCount();

            return true;
        } catch (error: unknown) {
            toast.error((error as Error).message || (language === 'vi' ? 'Có lỗi xảy ra' : 'An error occurred'));
            return false;
        } finally {
            setSubmitting(false);
        }
    }, [isLoggedIn, bookId, language, loadQuestions, loadQuestionCount]);

    const answerQuestion = useCallback(async (questionId: string, answer: string): Promise<boolean> => {
        if (!isLoggedIn) {
            toast.error(language === 'vi'
                ? 'Vui lòng đăng nhập để trả lời'
                : 'Please login to answer');
            return false;
        }

        if (!answer.trim()) {
            return false;
        }

        try {
            await questionService.answerQuestion(questionId, { answer: answer.trim() });
            toast.success(language === 'vi' ? 'Gửi câu trả lời thành công' : 'Answer submitted successfully');


            await loadQuestions(false);

            return true;
        } catch (error: unknown) {
            toast.error((error as Error).message);
            return false;
        }
    }, [isLoggedIn, language, loadQuestions]);

    const deleteQuestion = useCallback(async (questionId: string): Promise<boolean> => {
        if (!window.confirm(language === 'vi' ? 'Bạn có chắc muốn xóa câu hỏi này?' : 'Are you sure you want to delete this question?')) {
            return false;
        }

        try {
            await questionService.deleteQuestionWithAnswers(questionId);
            toast.success(language === 'vi' ? 'Đã xóa câu hỏi' : 'Question deleted');


            await loadQuestions(true);
            await loadQuestionCount();

            return true;
        } catch (error: unknown) {
            toast.error((error as Error).message);
            return false;
        }
    }, [language, loadQuestions, loadQuestionCount]);

    const deleteAnswer = useCallback(async (answerId: string): Promise<boolean> => {
        if (!window.confirm(language === 'vi' ? 'Bạn có chắc muốn xóa câu trả lời này?' : 'Are you sure you want to delete this answer?')) {
            return false;
        }

        try {
            await questionService.deleteAnswer(answerId);
            toast.success(language === 'vi' ? 'Đã xóa câu trả lời' : 'Answer deleted');


            await loadQuestions(false);

            return true;
        } catch (error: unknown) {
            toast.error((error as Error).message);
            return false;
        }
    }, [language, loadQuestions]);

    return {
        questions,
        loading,
        loadingMore,
        submitting,
        hasMore,
        searchKeyword,
        totalQuestions,
        currentUser,
        isLoggedIn,
        loadQuestions,
        loadMore,
        loadQuestionCount,
        updateSearch,
        createQuestion,
        answerQuestion,
        deleteQuestion,
        deleteAnswer,
    };
};


export const userQuestionsKeys = {
    all: ['user-questions'] as const,
    lists: () => [...userQuestionsKeys.all, 'list'] as const,
    list: (filters: { status?: string; search?: string }) => 
        [...userQuestionsKeys.lists(), filters] as const,
    infinite: (filters: { status?: string; search?: string }) => 
        [...userQuestionsKeys.lists(), 'infinite', filters] as const,
};

export const useUserQuestions = () => {
    const { language } = useAppContext();
    const queryClient = useQueryClient();

    // Infinite query for paginated questions
    const useUserQuestionsInfinite = (
        filterStatus: 'all' | 'answered' | 'unanswered' = 'all',
        searchKeyword: string = ''
    ) => {
        return useInfiniteQuery<PageResponse<QuestionResponse>>({
            queryKey: userQuestionsKeys.infinite({ status: filterStatus, search: searchKeyword }),
            queryFn: ({ pageParam = 0 }) => 
                questionService.getUserQuestions(pageParam as number, 20),
            getNextPageParam: (lastPage) => 
                lastPage.last ? undefined : lastPage.pageNumber + 1,
            initialPageParam: 0,
            staleTime: 2 * 60 * 1000, // 2 minutes
            gcTime: 5 * 60 * 1000, // 5 minutes
            select: (data) => {
                // Filter questions based on status and search
                const allQuestions = data.pages.flatMap(page => page.content);
                
                let filtered = allQuestions;
                
                // Apply status filter
                if (filterStatus === 'answered') {
                    filtered = filtered.filter(q => q.isAnswered);
                } else if (filterStatus === 'unanswered') {
                    filtered = filtered.filter(q => !q.isAnswered);
                }
                
                // Apply search filter
                if (searchKeyword.trim()) {
                    const keyword = searchKeyword.toLowerCase();
                    filtered = filtered.filter(q =>
                        q.question.toLowerCase().includes(keyword) ||
                        q.bookTitle.toLowerCase().includes(keyword)
                    );
                }

                return {
                    pages: data.pages,
                    pageParams: data.pageParams,
                    questions: filtered,
                    hasNextPage: data.pages[data.pages.length - 1]?.last === false,
                };
            },
        });
    };

    // Delete question mutation
    const useDeleteQuestion = () => {
        return useMutation({
            mutationFn: (questionId: string) => 
                questionService.deleteQuestionWithAnswers(questionId),
            onSuccess: () => {
                // Invalidate all user questions queries
                queryClient.invalidateQueries({ 
                    queryKey: userQuestionsKeys.lists() 
                });
                toast.success(
                    language === 'vi' ? 'Đã xóa câu hỏi' : 'Question deleted'
                );
            },
            onError: (error: Error) => {
                toast.error(error.message);
            },
        });
    };

    // Answer question mutation
    const useAnswerQuestion = () => {
        return useMutation({
            mutationFn: ({ 
                questionId, 
                answer 
            }: { 
                questionId: string; 
                answer: AnswerQuestionRequest
            }) => questionService.answerQuestion(questionId, answer),
            onSuccess: () => {
                queryClient.invalidateQueries({ 
                    queryKey: userQuestionsKeys.lists() 
                });
                toast.success(
                    language === 'vi' 
                        ? 'Gửi câu trả lời thành công' 
                        : 'Answer submitted successfully'
                );
            },
            onError: (error: Error) => {
                toast.error(error.message);
            },
        });
    };

    // Delete answer mutation
    const useDeleteAnswer = () => {
        return useMutation({
            mutationFn: (answerId: string) => 
                questionService.deleteAnswer(answerId),
            onSuccess: () => {
                queryClient.invalidateQueries({ 
                    queryKey: userQuestionsKeys.lists() 
                });
                toast.success(
                    language === 'vi' ? 'Đã xóa câu trả lời' : 'Answer deleted'
                );
            },
            onError: (error: Error) => {
                toast.error(error.message);
            },
        });
    };

    // Count unanswered questions
    const useUnansweredCount = () => {
        return useQuery({
            queryKey: ['user-questions', 'unanswered-count'],
            queryFn: () => questionService.countUnansweredQuestions(),
            staleTime: 2 * 60 * 1000,
            refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
        });
    };

    return {
        useUserQuestionsInfinite,
        useDeleteQuestion,
        useAnswerQuestion,
        useDeleteAnswer,
        useUnansweredCount,
    };
};