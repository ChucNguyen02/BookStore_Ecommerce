import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, MessageSquare, AlertCircle } from 'lucide-react';
import { useAdminQuestions } from '../../../hooks/admin/useAdminQuestions';
import LoadingSpinner from '../../../components/admin/common/LoadingSpinner';
import Pagination from '../../../components/admin/common/Pagination';
import QuestionCard from '../../../components/admin/questions/QuestionCard';
import QuestionFilters from '../../../components/admin/questions/QuestionFilters';
import QuestionStats from '../../../components/admin/questions/QuestionStats';
import AnswerModal from '../../../components/admin/questions/AnswerModal';

export default function AdminQuestions() {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'all' | 'unanswered' | 'answered'>('all');
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
    const [showAnswerModal, setShowAnswerModal] = useState(false);

    const {
        questions,
        stats,
        isLoading,
        error,
        deleteQuestion,
        deleteAnswer,
        answerQuestion,
        refetch
    } = useAdminQuestions({
        page: currentPage,
        size: 20,
        status: filterStatus === 'all' ? undefined : filterStatus
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(0);
        refetch();
    };

    const handleAnswerClick = (question: any) => {
        setSelectedQuestion(question);
        setShowAnswerModal(true);
    };

    const handleAnswerSubmit = async (answer: string) => {
        if (!selectedQuestion) return;

        const success = await answerQuestion(selectedQuestion.id, answer);
        if (success) {
            setShowAnswerModal(false);
            setSelectedQuestion(null);
            refetch();
        }
    };

    const handleDeleteQuestion = async (questionId: string) => {
        const success = await deleteQuestion(questionId);
        if (success) {
            refetch();
        }
    };

    const handleDeleteAnswer = async (answerId: string) => {
        const success = await deleteAnswer(answerId);
        if (success) {
            refetch();
        }
    };

    if (isLoading && currentPage === 0) {
        return <LoadingSpinner fullScreen message={t('common.loading')} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {/* Header với gradient animation */}
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-2xl animate-fadeInDown relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-pulse">
                                    <MessageSquare className="w-7 h-7" />
                                </div>
                                <h1 className="text-3xl font-bold">
                                    {t('admin.questionsManagement')}
                                </h1>
                            </div>
                            <p className="text-purple-100 animate-fadeIn">
                                {t('admin.manageCustomerQuestions')}
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <MessageSquare className="w-20 h-20 opacity-20 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Stats */}
                <div className="stagger-item">
                    <QuestionStats stats={stats} />
                </div>

                {/* Search & Filters */}
                <div className="card stagger-item hover-lift">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={t('admin.searchQuestions')}
                                    className="input-field pl-12 transition-smooth"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-smooth hover-scale"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-6 py-3 rounded-xl font-medium transition-smooth flex items-center gap-2 hover-scale ${showFilters
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <Filter className="w-5 h-5" />
                                <span>{t('common.filters')}</span>
                            </button>
                        </div>

                        {showFilters && (
                            <div className="animate-fadeInDown">
                                <QuestionFilters
                                    filterStatus={filterStatus}
                                    onFilterChange={setFilterStatus}
                                />
                            </div>
                        )}

                        {/* Active Filters Badge */}
                        {(searchTerm || filterStatus !== 'all') && (
                            <div className="flex items-center gap-2 animate-fadeIn">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('admin.activeFilters')}:
                                </span>
                                {searchTerm && (
                                    <span className="badge badge-primary">
                                        {t('admin.search')}: "{searchTerm}"
                                    </span>
                                )}
                                {filterStatus !== 'all' && (
                                    <span className={`badge ${filterStatus === 'answered'
                                            ? 'badge-success'
                                            : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'
                                        }`}>
                                        {t(`admin.${filterStatus}`)}
                                    </span>
                                )}
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterStatus('all');
                                        refetch();
                                    }}
                                    className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors hover-scale ml-2"
                                >
                                    {t('admin.clearAll')}
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Error State */}
                {error && (
                    <div className="card stagger-item border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 animate-fadeIn">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-red-900 dark:text-red-300">
                                    {t('common.error')}
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Questions List */}
                {isLoading ? (
                    <div className="card stagger-item">
                        <LoadingSpinner />
                    </div>
                ) : questions && questions.content.length > 0 ? (
                    <>
                        {/* Results Summary */}
                        <div className="card stagger-item">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {t('admin.questionsList')}
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {t('admin.showing')} <span className="font-semibold text-gray-900 dark:text-white">{questions.content.length}</span> {t('admin.of')} {questions.totalElements}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {stats?.unansweredQuestions || 0} {t('admin.unanswered')}
                                        </span>
                                    </div>
                                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {stats?.answeredQuestions || 0} {t('admin.answered')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Questions Cards */}
                        <div className="space-y-4">
                            {questions.content.map((question, index) => (
                                <div
                                    key={question.id}
                                    className="animate-fadeInUp"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <QuestionCard
                                        question={question}
                                        onAnswer={handleAnswerClick}
                                        onDeleteQuestion={handleDeleteQuestion}
                                        onDeleteAnswer={handleDeleteAnswer}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {questions.totalPages > 1 && (
                            <div className="flex justify-center stagger-item">
                                <div className="card inline-block">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={questions.totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Bottom Stats */}
                        <div className="card stagger-item bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 border-2 border-purple-200 dark:border-purple-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {questions.totalElements} {t('admin.totalQuestions')}
                                        </span>
                                    </div>
                                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('admin.page')} <span className="font-semibold text-gray-900 dark:text-white">{currentPage + 1}</span> {t('admin.of')} {questions.totalPages}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('admin.responseRate')}: <span className="font-semibold text-purple-600 dark:text-purple-400">
                                        {stats?.totalQuestions ? Math.round(((stats.answeredQuestions || 0) / stats.totalQuestions) * 100) : 0}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="card text-center stagger-item hover-lift">
                        <div className="py-16">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
                                <MessageSquare className="w-12 h-12 text-purple-400 dark:text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {searchTerm || filterStatus !== 'all'
                                    ? t('admin.noQuestionsMatchFilter')
                                    : t('admin.noQuestions')
                                }
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                                {searchTerm || filterStatus !== 'all'
                                    ? t('admin.tryDifferentFilters')
                                    : t('admin.noQuestionsDescription')
                                }
                            </p>
                            {(searchTerm || filterStatus !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterStatus('all');
                                        refetch();
                                    }}
                                    className="btn-primary hover-scale inline-flex items-center space-x-2"
                                >
                                    <span>{t('admin.clearFilters')}</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Answer Modal với backdrop blur animation */}
            {showAnswerModal && selectedQuestion && (
                <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => {
                                setShowAnswerModal(false);
                                setSelectedQuestion(null);
                            }}
                        ></div>
                        <div className="relative animate-scaleIn w-full max-w-2xl">
                            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
                                {/* Modal Header */}
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-t-2xl">
                                    <h3 className="text-lg font-bold flex items-center">
                                        <MessageSquare className="w-5 h-5 mr-2" />
                                        {t('admin.answerQuestion')}
                                    </h3>
                                </div>

                                {/* Modal Content */}
                                <AnswerModal
                                    question={selectedQuestion}
                                    onSubmit={handleAnswerSubmit}
                                    onClose={() => {
                                        setShowAnswerModal(false);
                                        setSelectedQuestion(null);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}