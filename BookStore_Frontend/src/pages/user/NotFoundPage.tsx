import { Home, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 px-4">
            <div className="max-w-lg w-full text-center space-y-8">
                {/* Animated 404 */}
                <div className="relative">
                    <h1 className="text-[10rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 select-none animate-pulse">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 blur-3xl" />
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {t('NotFoundPage.title')}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        {t('NotFoundPage.description')}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('NotFoundPage.goBack')}
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25"
                    >
                        <Home className="w-4 h-4" />
                        {t('NotFoundPage.goHome')}
                    </button>
                    <button
                        onClick={() => navigate('/search')}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium shadow-sm"
                    >
                        <Search className="w-4 h-4" />
                        {t('NotFoundPage.searchBooks')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
