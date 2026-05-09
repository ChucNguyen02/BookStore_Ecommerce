import { useState } from 'react';
import { Loader2, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuestionFormProps {
    bookId?: string;
    onSubmit: (question: string) => Promise<void>;
    onCancel: () => void;
    submitting: boolean;
}

export const QuestionForm = ({ bookId: _bookId, onSubmit, onCancel, submitting }: QuestionFormProps) => {
    const { t } = useTranslation();

    const [question, setQuestion] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!question.trim()) return;

        await onSubmit(question.trim());
        setQuestion('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('questionForm.yourQuestion')} <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                    placeholder={t('questionForm.placeholder')}
                    required
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {t('questionForm.publicNote')}
                </p>
            </div>

            <div className="flex gap-3 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
                >
                    {t('questionForm.cancel')}
                </button>
                <button
                    type="submit"
                    disabled={submitting || !question.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 dark:hover:from-blue-700 dark:hover:to-cyan-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    <HelpCircle className="w-5 h-5" />
                    {t('questionForm.submit')}
                </button>
            </div>
        </form>
    );
};