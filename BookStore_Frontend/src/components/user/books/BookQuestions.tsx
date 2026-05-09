import { useState, useEffect } from 'react';
import { Search, ChevronDown, HelpCircle } from 'lucide-react';
import { QuestionCard } from './QuestionCard';
import { QuestionForm } from './QuestionForm';
import { useQuestions } from '../../../hooks/user/useQuestions';
import LoadingSpinner from '../common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface BookQuestionsProps {
  bookId: string;
}

export const BookQuestions = ({ bookId }: BookQuestionsProps) => {
  const { t } = useTranslation();
  const {
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
  } = useQuestions(bookId);

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    loadQuestions(true);
    loadQuestionCount();
  }, [bookId, searchKeyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateSearch('');
  };

  const handleSubmitQuestion = async (questionText: string) => {
    const success = await createQuestion(questionText);
    if (success) {
      setShowQuestionForm(false);
    }
  };

  const handleAskQuestion = () => {
    if (!isLoggedIn) {
      toast.error(t('bookQuestions.pleaseLoginToAsk'));
      return;
    }
    setShowQuestionForm(true);
  };

  if (loading && questions.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('bookQuestions.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('bookQuestions.questionsCount', { count: totalQuestions })}
            </p>
          </div>
        </div>

        <button
          onClick={handleAskQuestion}
          disabled={!isLoggedIn}
          className={`px-6 py-3 rounded-lg transition-all font-medium flex items-center gap-2 ${
            isLoggedIn
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-600 dark:hover:from-blue-700 dark:hover:to-cyan-700'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          {isLoggedIn ? t('bookQuestions.askQuestion') : t('bookQuestions.loginToAsk')}
        </button>
      </div>

      {/* Question Form Modal */}
      {showQuestionForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('bookQuestions.askAQuestion')}
            </h3>
            <QuestionForm
              bookId={bookId}
              onSubmit={handleSubmitQuestion}
              onCancel={() => setShowQuestionForm(false)}
              submitting={submitting}
            />
          </div>
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={t('bookQuestions.searchPlaceholder')}
          className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all outline-none"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      {/* Search Result Info */}
      {searchKeyword && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('bookQuestions.resultsFor')}
          </span>
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
            "{searchKeyword}"
          </span>
          <button
            onClick={handleClearSearch}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('bookQuestions.clear')}
          </button>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            currentUserId={currentUser?.id}
            isLoggedIn={isLoggedIn}
            onAnswer={answerQuestion}
            onDeleteQuestion={deleteQuestion}
            onDeleteAnswer={deleteAnswer}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                {t('bookQuestions.loading')}
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" />
                {t('bookQuestions.loadMore')}
              </>
            )}
          </button>
        </div>
      )}

      {/* Empty State */}
      {questions.length === 0 && !loading && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <HelpCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchKeyword
              ? t('bookQuestions.noQuestionsFound')
              : t('bookQuestions.noQuestionsYet')}
          </p>
          {!searchKeyword && (
            <button
              onClick={handleAskQuestion}
              disabled={!isLoggedIn}
              className={`px-6 py-3 rounded-lg transition-all font-medium ${
                isLoggedIn
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoggedIn
                ? t('bookQuestions.askFirstQuestion')
                : t('bookQuestions.loginToAsk')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};