import { useState } from 'react';
import { MessageCircle, MoreVertical, Trash2, CheckCircle } from 'lucide-react';
import { AnswerForm } from './AnswerForm';
import type { QuestionResponse, AnswerResponse } from '../../../types/question.types';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface QuestionCardProps {
    question: QuestionResponse;
    currentUserId?: string;
    isLoggedIn: boolean;
    onAnswer: (questionId: string, answer: string) => Promise<boolean>;
    onDeleteQuestion: (questionId: string) => Promise<boolean>;
    onDeleteAnswer: (answerId: string) => Promise<boolean>;
}

export const QuestionCard = ({
    question,
    currentUserId,
    isLoggedIn,
    onAnswer,
    onDeleteQuestion,
    onDeleteAnswer,
}: QuestionCardProps) => {
    const { t, i18n } = useTranslation();
    const [showAnswerForm, setShowAnswerForm] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const isQuestionOwner = currentUserId === question.userId;

    const handleSubmitAnswer = async (answer: string) => {
        try {
            setSubmitting(true);
            const success = await onAnswer(question.id, answer);
            if (success) {
                setShowAnswerForm(false);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleShowAnswerForm = () => {
        if (!isLoggedIn) {
            toast.error(t('questionCard.pleaseLoginToAnswer'));
            return;
        }
        setShowAnswerForm(true);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(i18n.language, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Question Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    {question.userAvatar ? (
                        <img
                            src={question.userAvatar}
                            alt={question.userName}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 flex items-center justify-center text-white font-bold ring-2 ring-gray-200 dark:ring-gray-700">
                            {question.userName.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                {question.userName}
                            </h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(question.createdAt)}
                            </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {question.question}
                        </p>
                    </div>
                </div>

                {/* Menu for question owner */}
                {isQuestionOwner && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10">
                                <button
                                    onClick={() => {
                                        onDeleteQuestion(question.id);
                                        setShowMenu(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {t('questionCard.deleteQuestion')}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Answers */}
            {question.answers && question.answers.length > 0 && (
                <div className="mt-4 space-y-4 pl-14">
                    {question.answers.map((answer: AnswerResponse) => {
                        const isAnswerOwner = currentUserId === answer.userId;

                        return (
                            <div
                                key={answer.id}
                                className={`p-4 rounded-lg ${answer.isSellerAnswer
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                                        : 'bg-gray-50 dark:bg-gray-750'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                                {answer.userName || t('questionCard.unknownUser')}
                                            </span>
                                            {answer.isSellerAnswer && (
                                                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    {t('questionCard.seller')}
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDate(answer.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                                            {answer.answer}
                                        </p>
                                    </div>

                                    {/* Delete button for answer owner */}
                                    {isAnswerOwner && (
                                        <button
                                            onClick={() => onDeleteAnswer(answer.id)}
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Answer Form */}
            {showAnswerForm ? (
                <div className="mt-4 pl-14">
                    <AnswerForm
                        questionId={question.id}
                        onSubmit={handleSubmitAnswer}
                        onCancel={() => setShowAnswerForm(false)}
                        submitting={submitting}
                    />
                </div>
            ) : (
                <div className="mt-4 pl-14">
                    <button
                        onClick={handleShowAnswerForm}
                        disabled={!isLoggedIn}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${isLoggedIn
                                ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            }`}
                    >
                        <MessageCircle className="w-4 h-4" />
                        {isLoggedIn ? t('questionCard.answer') : t('questionCard.loginToAnswer')}
                    </button>
                </div>
            )}

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>
                        {question.answerCount} {t('questionCard.answersCount', { count: question.answerCount })}
                    </span>
                </div>
                {question.isAnswered && (
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                        ✓ {t('questionCard.answered')}
                    </span>
                )}
            </div>
        </div>
    );
};