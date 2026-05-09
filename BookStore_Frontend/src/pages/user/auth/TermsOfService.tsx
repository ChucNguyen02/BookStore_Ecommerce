import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Shield, Scale, FileText, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TermsOfService() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center space-x-2">
                            <BookOpen className="w-8 h-8 text-amber-600 dark:text-amber-500" />
                            <span className="text-xl font-serif font-bold bg-gradient-to-r from-amber-700 to-orange-600 dark:from-amber-500 dark:to-orange-500 bg-clip-text text-transparent">
                                BookStore
                            </span>
                        </Link>
                        <Link
                            to="/"
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>{t('TermsOfService.back')}</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Title Section */}
                <div className="text-center mb-12 animate-fadeInUp">
                    <Scale className="w-16 h-16 text-amber-600 dark:text-amber-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                        {t('TermsOfService.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('TermsOfService.lastUpdated')}
                    </p>
                </div>

                {/* Notice Box */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-8 animate-fadeInUp">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">
                                {t('TermsOfService.importantNoticeTitle')}
                            </h3>
                            <p className="text-sm text-amber-800 dark:text-amber-400">
                                {t('TermsOfService.importantNoticeDesc')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                    {/* Section 1 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <div className="flex items-center space-x-3 mb-4">
                            <FileText className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                {t('TermsOfService.section1.title')}
                            </h2>
                        </div>
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {t('TermsOfService.section1.intro')}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('TermsOfService.section1.companyInfo')}
                            </p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                            {t('TermsOfService.section2.title')}
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('TermsOfService.section2.sub1.title')}
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                                    {t('TermsOfService.section2.sub1.items', { returnObjects: true }).map((item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('TermsOfService.section2.sub2.title')}
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                                    {t('TermsOfService.section2.sub2.items', { returnObjects: true }).map((item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                            {t('TermsOfService.section3.title')}
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('TermsOfService.section3.sub1.title')}
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                                    {t('TermsOfService.section3.sub1.items', { returnObjects: true }).map((item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('TermsOfService.section3.sub2.title')}
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                                    {t('TermsOfService.section3.sub2.items', { returnObjects: true }).map((item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                            {t('TermsOfService.section4.title')}
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                            {t('TermsOfService.section4.items', { returnObjects: true }).map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                            {t('TermsOfService.section5.title')}
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('TermsOfService.section5.sub1.title')}
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                                    {t('TermsOfService.section5.sub1.items', { returnObjects: true }).map((item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('TermsOfService.section5.sub2.title')}
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                                    {t('TermsOfService.section5.sub2.items', { returnObjects: true }).map((item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <div className="flex items-center space-x-3 mb-4">
                            <Shield className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                {t('TermsOfService.section6.title')}
                            </h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-400">
                            <p>{t('TermsOfService.section6.desc')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                {t('TermsOfService.section6.items', { returnObjects: true }).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                            {t('TermsOfService.section7.title')}
                        </h2>
                        <div className="space-y-4 text-gray-600 dark:text-gray-400">
                            <p className="mb-4">{t('TermsOfService.section7.intro')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                {t('TermsOfService.section7.items', { returnObjects: true }).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Section 8 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                            {t('TermsOfService.section8.title')}
                        </h2>
                        <div className="space-y-4 text-gray-600 dark:text-gray-400">
                            <p className="mb-4">{t('TermsOfService.section8.intro')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                {t('TermsOfService.section8.items', { returnObjects: true }).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Section 9 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                            {t('TermsOfService.section9.title')}
                        </h2>
                        <div className="space-y-4 text-gray-600 dark:text-gray-400">
                            <p>{t('TermsOfService.section9.desc1')}</p>
                            <p>{t('TermsOfService.section9.desc2')}</p>
                        </div>
                    </section>

                    {/* Section 10 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                            {t('TermsOfService.section10.title')}
                        </h2>
                        <div className="space-y-4 text-gray-600 dark:text-gray-400">
                            <p>{t('TermsOfService.section10.intro')}</p>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                                <p><strong>{t('TermsOfService.section10.emailLabel')}:</strong> {t('TermsOfService.section10.email')}</p>
                                <p><strong>{t('TermsOfService.section10.hotlineLabel')}:</strong> {t('TermsOfService.section10.hotline')}</p>
                                <p><strong>{t('TermsOfService.section10.addressLabel')}:</strong> {t('TermsOfService.section10.address')}</p>
                                <p><strong>{t('TermsOfService.section10.hoursLabel')}:</strong> {t('TermsOfService.section10.hours')}</p>
                            </div>
                        </div>
                    </section>
                </div>

                
            </main>
        </div>
    );
}