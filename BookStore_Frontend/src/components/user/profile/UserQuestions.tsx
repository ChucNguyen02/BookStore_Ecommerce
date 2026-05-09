import { useTranslation } from 'react-i18next';import { useState, useMemo } from 'react';
import { HelpCircle, MessageCircle, Search, Trash2, CheckCircle, Calendar, Book, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserQuestions } from '../../../hooks/user/useQuestions';
import { useAppContext } from '../../../context/AppContext';
import LoadingSpinner from '../common/LoadingSpinner';

export const UserQuestions = () => {const { t } = useTranslation();
  const { language } = useAppContext();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'answered' | 'unanswered'>('all');

  const {
    useUserQuestionsInfinite,
    useDeleteQuestion
  } = useUserQuestions();

  // Fetch questions with infinite scroll
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useUserQuestionsInfinite(filterStatus, searchKeyword);

  // Delete mutation
  const deleteQuestionMutation = useDeleteQuestion();

  // Calculate stats from data
  const stats = useMemo(() => {
    if (!data) return { total: 0, answered: 0, unanswered: 0 };

    const allQuestions = data.pages.flatMap((page) => page.content);
    return {
      total: allQuestions.length,
      answered: allQuestions.filter((q) => q.isAnswered).length,
      unanswered: allQuestions.filter((q) => !q.isAnswered).length
    };
  }, [data]);

  // Get filtered questions
  const questions = data?.questions || [];

  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm(
      language === 'vi' ? t("Common.banCoChacMuonXoa") :

      'Are you sure you want to delete this question?'
    )) {
      return;
    }

    deleteQuestionMutation.mutate(questionId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <HelpCircle className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    {language === 'vi' ? t("Common.cauHoiCuaToi") : 'My Questions'}
                </h2>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {language === 'vi' ? t("Common.tongCauHoi") : 'Total'}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.answered}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {language === 'vi' ? t("Common.daTraLoi") : 'Answered'}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.unanswered}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {language === 'vi' ? t("Common.choTraLoi") : 'Pending'}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder={language === 'vi' ? t("Common.timKiemCauHoi") : 'Search questions...'}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none" />
            
                    </div>

                    <div className="flex gap-2">
                        {(['all', 'answered', 'unanswered'] as const).map((status) =>
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-3 rounded-lg font-medium transition-all text-sm ${
              filterStatus === status ?
              status === 'all' ? 'bg-blue-500 text-white' :
              status === 'answered' ? 'bg-green-500 text-white' :
              'bg-amber-500 text-white' :
              'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`
              }>
              
                                {status === 'all' ? language === 'vi' ? t("Common.tatCa") : 'All' :
              status === 'answered' ? language === 'vi' ? t("Common.daTraLoi") : 'Answered' :
              language === 'vi' ? t("Common.cho") : 'Pending'}
                            </button>
            )}
                    </div>
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                {questions.length === 0 ?
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                        <HelpCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            {language === 'vi' ? t("Common.khongCoCauHoiNao") : 'No questions found'}
                        </p>
                    </div> :

        questions.map((question) =>
        <div
          key={question.id}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
          
                            {/* Book Info */}
                            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Book className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {question.bookTitle}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(question.createdAt)}
                                    </div>
                                </div>
                                <button
              onClick={() => handleDeleteQuestion(question.id)}
              disabled={deleteQuestionMutation.isPending}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group disabled:opacity-50">
              
                                    <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                                </button>
                            </div>

                            {/* Question */}
                            <div className="mb-4">
                                <div className="flex items-start gap-3">
                                    <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {question.question}
                                    </p>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-3 mb-4">
                                {question.isAnswered ?
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-sm font-semibold rounded-full flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4" />
                                        {language === 'vi' ? t("Common.daTraLoi") : 'Answered'}
                                    </span> :

            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-sm font-semibold rounded-full flex items-center gap-1">
                                        <MessageCircle className="w-4 h-4" />
                                        {language === 'vi' ? t("Common.choTraLoi") : 'Pending'}
                                    </span>
            }
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {question.answerCount} {language === 'vi' ? t("Common.cauTraLoi") : 'answers'}
                                </span>
                            </div>

                            {/* Answers */}
                            {question.answers && question.answers.length > 0 &&
          <div className="space-y-3 pl-8">
                                    {question.answers.map((answer) =>
            <div
              key={answer.id}
              className={`p-4 rounded-lg ${
              answer.isSellerAnswer ?
              'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' :
              'bg-gray-50 dark:bg-gray-750'}`
              }>
              
                                            <div className="flex items-start gap-3">
                                                <MessageCircle className="w-4 h-4 text-gray-400 mt-1" />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                                            {answer.userName}
                                                        </span>
                                                        {answer.isSellerAnswer &&
                    <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                                                <CheckCircle className="w-3 h-3" />
                                                                {language === 'vi' ? t("Common.nguoiBan") : 'Seller'}
                                                            </span>
                    }
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {formatDate(answer.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                                                        {answer.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
            )}
                                </div>
          }

                            {/* View Book Link */}
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Link
              to={`/books/${question.bookSlug}`}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-2">
              
                                    <Book className="w-4 h-4" />
                                    {language === 'vi' ? t("Common.xemChiTietSach") : 'View book details'}
                                </Link>
                            </div>
                        </div>
        )
        }
            </div>

            {/* Load More */}
            {hasNextPage && questions.length > 0 &&
      <div className="flex justify-center">
                    <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2">
          
                        {isFetchingNextPage ?
          <>
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                {language === 'vi' ? t("Common.dangTai") : 'Loading...'}
                            </> :

          <>
                                <ChevronDown className="w-5 h-5" />
                                {language === 'vi' ? t("Common.xemThem") : 'Load More'}
                            </>
          }
                    </button>
                </div>
      }
        </div>);

};