import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Send, Book, User, Calendar } from 'lucide-react';

interface AnswerModalProps {
    question: any;
    onSubmit: (answer: string) => void;
    onClose: () => void;
}

export default function AnswerModal({ question, onSubmit, onClose }: AnswerModalProps) {
    const { t } = useTranslation();
    const [answer, setAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!answer.trim()) {
            return;
        }

        setIsSubmitting(true);
        await onSubmit(answer);
        setIsSubmitting(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scaleIn">
                {/* Header với shimmer effect */}
                <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                    </div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Send className="w-5 h-5" />
                            </div>
                            <h3 className="text-2xl font-bold">
                                {t('admin.answerQuestion')}
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-smooth hover-scale"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {/* Question Details */}
                    <div className="space-y-4">
                        {/* User Info */}
                        <div className="card hover-lift">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                        {question.userAvatar ? (
                                            <img
                                                src={question.userAvatar}
                                                alt={question.userName}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {question.userName}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{formatDate(question.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Book Info */}
                        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover-lift">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                                <Book className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-purple-900 dark:text-purple-300">
                                {question.bookTitle}
                            </span>
                        </div>

                        {/* Question Text */}
                        <div className="card border-l-4 border-purple-500">
                            <div className="flex items-center space-x-2 mb-3">
                                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">Q</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {t('admin.question')}
                                </p>
                            </div>
                            <p className="text-gray-900 dark:text-white leading-relaxed pl-8">
                                {question.question}
                            </p>
                        </div>

                        {/* Existing Answers */}
                        {question.answers && question.answers.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {t('admin.existingAnswers')} ({question.answers.length})
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    {question.answers.map((ans: any, index: number) => (
                                        <div
                                            key={ans.id}
                                            className="card border-l-4 border-blue-500 hover-lift animate-fadeInUp"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">A</span>
                                                </div>
                                                <span className="font-semibold text-blue-900 dark:text-blue-300">
                                                    {ans.userName || t('admin.anonymous')}
                                                </span>
                                                {ans.isSellerAnswer && (
                                                    <span className="inline-flex items-center px-2 py-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-xs font-semibold shadow-sm">
                                                        {t('admin.official')}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 pl-8">
                                                {ans.answer}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Answer Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="card bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10">
                            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">A</span>
                                </div>
                                <span>{t('admin.yourAnswer')} *</span>
                            </label>
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                rows={6}
                                placeholder={t('admin.answerPlaceholder')}
                                className="input-field resize-none transition-smooth"
                                required
                            />
                            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                <p className="text-sm text-purple-900 dark:text-purple-300 font-medium">
                                    {t('admin.answerAsOfficial')}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-secondary flex-1 hover-scale"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !answer.trim()}
                                className="btn-primary flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>{t('common.submitting')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        <span>{t('admin.submitAnswer')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}