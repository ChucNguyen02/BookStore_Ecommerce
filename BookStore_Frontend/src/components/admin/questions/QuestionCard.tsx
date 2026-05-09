import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    MessageSquare,
    Trash2,
    Calendar,
    Book,
    User,
    CheckCircle,
    Reply
} from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog';

interface QuestionCardProps {
    question: any;
    onAnswer: (question: any) => void;
    onDeleteQuestion: (questionId: string) => void;
    onDeleteAnswer: (answerId: string) => void;
}

export default function QuestionCard({
    question,
    onAnswer,
    onDeleteQuestion,
    onDeleteAnswer
}: QuestionCardProps) {
    const { t } = useTranslation();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteType, setDeleteType] = useState<'question' | 'answer'>('question');
    const [deleteId, setDeleteId] = useState('');

    const handleDeleteClick = (type: 'question' | 'answer', id: string) => {
        setDeleteType(type);
        setDeleteId(id);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        if (deleteType === 'question') {
            onDeleteQuestion(deleteId);
        } else {
            onDeleteAnswer(deleteId);
        }
        setShowDeleteDialog(false);
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
        <>
            <div className="card hover-lift border-l-4 border-purple-500 animate-fadeIn">
                {/* Question Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                        {/* User Info */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                    {question.userAvatar ? (
                                        <img
                                            src={question.userAvatar}
                                            alt={question.userName}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-5 h-5 text-white" />
                                    )}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
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

                        {/* Book Info */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover-scale">
                            <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                                <Book className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
                                {question.bookTitle}
                            </span>
                        </div>

                        {/* Question Text */}
                        <div className="card bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-700/30 border border-gray-200 dark:border-gray-600">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <MessageSquare className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-gray-900 dark:text-white leading-relaxed flex-1">
                                    {question.question}
                                </p>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                            {question.isAnswered ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-full text-sm font-semibold shadow-sm hover-scale">
                                    <CheckCircle className="w-4 h-4" />
                                    {t('admin.answered')}
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 rounded-full text-sm font-semibold shadow-sm hover-scale">
                                    <span className="relative flex">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full w-2 h-2 bg-orange-500"></span>
                                    </span>
                                    {t('admin.pending')}
                                </span>
                            )}
                            {question.answerCount > 0 && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                                    <Reply className="w-3.5 h-3.5" />
                                    {question.answerCount} {t('admin.answers')}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onAnswer(question)}
                            className="p-2.5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 text-purple-600 dark:text-purple-400 rounded-lg transition-smooth hover-scale border border-purple-200 dark:border-purple-800 shadow-sm"
                            title={t('admin.answerQuestion')}
                        >
                            <Reply className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => handleDeleteClick('question', question.id)}
                            className="p-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-smooth hover-scale border border-red-200 dark:border-red-800 shadow-sm"
                            title={t('common.delete')}
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Answers */}
                {question.answers && question.answers.length > 0 && (
                    <div className="space-y-3 pt-4 mt-4 border-t-2 border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {t('admin.answers')} ({question.answers.length})
                            </span>
                        </div>
                        {question.answers.map((answer: any, index: number) => (
                            <div
                                key={answer.id}
                                className={`rounded-xl p-4 transition-smooth hover-lift animate-fadeInUp ${answer.isSellerAnswer
                                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300 dark:border-purple-700 shadow-lg'
                                        : 'card bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-700/30'
                                    }`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {answer.isSellerAnswer ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-semibold shadow-lg">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    {t('admin.officialAnswer')}
                                                </span>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                                                        <User className="w-3.5 h-3.5 text-white" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        {answer.userName || t('admin.anonymous')}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(answer.createdAt)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-2 pl-8">
                                            <div className="w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mt-1"></div>
                                            <p className="text-gray-900 dark:text-white leading-relaxed flex-1">
                                                {answer.answer}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteClick('answer', answer.id)}
                                        className="p-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-smooth hover-scale border border-red-200 dark:border-red-800"
                                        title={t('common.delete')}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={showDeleteDialog}
                title={
                    deleteType === 'question'
                        ? t('admin.deleteQuestion')
                        : t('admin.deleteAnswer')
                }
                message={
                    deleteType === 'question'
                        ? t('admin.deleteQuestionConfirm')
                        : t('admin.deleteAnswerConfirm')
                }
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteDialog(false)}
            />
        </>
    );
}