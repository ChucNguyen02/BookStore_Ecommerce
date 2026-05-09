import { useState } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AnswerFormProps {
  questionId: string;
  onSubmit: (answer: string) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
}

export const AnswerForm = ({ questionId, onSubmit, onCancel, submitting }: AnswerFormProps) => {
  const { t } = useTranslation();
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answer.trim()) {
      return;
    }

    await onSubmit(answer.trim());
    setAnswer('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('AnswerForm.yourAnswer')}
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
          placeholder={t('AnswerForm.placeholder')}
          required
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium disabled:opacity-50"
        >
          {t('AnswerForm.cancel')}
        </button>
        <button
          type="submit"
          disabled={submitting || !answer.trim()}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 dark:hover:from-blue-700 dark:hover:to-cyan-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <MessageCircle className="w-4 h-4" />
          {t('AnswerForm.send')}
        </button>
      </div>
    </form>
  );
};