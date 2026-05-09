import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Bell, Globe, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
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
                            <span>{t('PrivacyPolicy.back')}</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Title Section */}
                <div className="text-center mb-12 animate-fadeInUp">
                    <Shield className="w-16 h-16 text-amber-600 dark:text-amber-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                        {t('PrivacyPolicy.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('PrivacyPolicy.lastUpdated')}
                    </p>
                </div>

                {/* Notice Box */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8 animate-fadeInUp">
                    <div className="flex items-start space-x-3">
                        <Lock className="w-6 h-6 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                                {t('PrivacyPolicy.privacyCommitment.title')}
                            </h3>
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                {t('PrivacyPolicy.privacyCommitment.description')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                    {/* Section 1 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <div className="flex items-center space-x-3 mb-4">
                            <Database className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                {t('PrivacyPolicy.section1.title')}
                            </h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('PrivacyPolicy.section1.subsection1.title')}
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                                    {(t('PrivacyPolicy.section1.subsection1.items', { returnObjects: true }) as any[]).map((item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('PrivacyPolicy.section1.subsection2.title')}
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                                    {(t('PrivacyPolicy.section1.subsection2.items', { returnObjects: true }) as any[]).map((item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('PrivacyPolicy.section1.subsection3.title')}
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                                    {(t('PrivacyPolicy.section1.subsection3.items', { returnObjects: true }) as any[]).map((item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <div className="flex items-center space-x-3 mb-4">
                            <Eye className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                {t('PrivacyPolicy.section2.title')}
                            </h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-400">
                            <p className="mb-4">{t('PrivacyPolicy.section2.description')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                    {(t('PrivacyPolicy.section2.items', { returnObjects: true }) as any[]).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <div className="flex items-center space-x-3 mb-4">
                            <Globe className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                {t('PrivacyPolicy.section3.title')}
                            </h2>
                        </div>
                        <div className="space-y-6">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {t('PrivacyPolicy.section3.description')}
                            </p>

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('PrivacyPolicy.section3.subsection1.title')}
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                                    {(t('PrivacyPolicy.section3.subsection1.items', { returnObjects: true }) as any[]).map((item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('PrivacyPolicy.section3.subsection2.title')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 ml-4">
                                    {t('PrivacyPolicy.section3.subsection2.description')}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('PrivacyPolicy.section3.subsection3.title')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 ml-4">
                                    {t('PrivacyPolicy.section3.subsection3.description')}
                                </p>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-4">
                                <p className="text-sm text-amber-800 dark:text-amber-400">
                                    <strong>{t('PrivacyPolicy.section3.importantNote.strong')}</strong>{' '}
                                    {t('PrivacyPolicy.section3.importantNote.text')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <div className="flex items-center space-x-3 mb-4">
                            <Lock className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                {t('PrivacyPolicy.section4.title')}
                            </h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-400">
                            <p className="mb-4">{t('PrivacyPolicy.section4.description')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                    {(t('PrivacyPolicy.section4.items', { returnObjects: true }) as any[]).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>

                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                                <p className="text-sm text-red-800 dark:text-red-400">
                                    <strong>{t('PrivacyPolicy.section4.importantWarning.strong')}</strong>{' '}
                                    {t('PrivacyPolicy.section4.importantWarning.text')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                            {t('PrivacyPolicy.section5.title')}
                        </h2>
                        <div className="space-y-6">
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('PrivacyPolicy.section5.description')}
                            </p>

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('PrivacyPolicy.section5.subsection1.title')}
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                                    {(t('PrivacyPolicy.section5.subsection1.items', { returnObjects: true }) as any[]).map((item: string, index: number) => (
                                        <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('PrivacyPolicy.section5.subsection2.title')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 ml-4">
                                    {t('PrivacyPolicy.section5.subsection2.description')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <div className="flex items-center space-x-3 mb-4">
                            <UserCheck className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                {t('PrivacyPolicy.section6.title')}
                            </h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-400">
                            <p className="mb-4">{t('PrivacyPolicy.section6.description')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                    {(t('PrivacyPolicy.section6.items', { returnObjects: true }) as any[]).map((item: string, index: number) => (
                                    <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                                ))}
                            </ul>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                                <p className="text-sm text-blue-800 dark:text-blue-400">
                                    {t('PrivacyPolicy.section6.contactToExercise')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Các section còn lại tương tự, tôi sẽ để ngắn gọn để tránh quá dài */}

                    {/* Section 7 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                            {t('PrivacyPolicy.section7.title')}
                        </h2>
                        <div className="space-y-4 text-gray-600 dark:text-gray-400">
                            <p>{t('PrivacyPolicy.section7.description')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                    {(t('PrivacyPolicy.section7.items', { returnObjects: true }) as any[]).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <p className="mt-4">{t('PrivacyPolicy.section7.afterDeletion')}</p>
                        </div>
                    </section>

                    {/* Section 8 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                            {t('PrivacyPolicy.section8.title')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('PrivacyPolicy.section8.description')}
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <div className="flex items-center space-x-3 mb-4">
                            <Bell className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                {t('PrivacyPolicy.section9.title')}
                            </h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-400">
                            <p>{t('PrivacyPolicy.section9.description')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                    {(t('PrivacyPolicy.section9.items', { returnObjects: true }) as any[]).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mt-4">
                                <p className="text-sm">
                                    <strong>{t('PrivacyPolicy.section9.unsubscribe.strong')}</strong>{' '}
                                    {t('PrivacyPolicy.section9.unsubscribe.text')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 10 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                            {t('PrivacyPolicy.section10.title')}
                        </h2>
                        <div className="space-y-4 text-gray-600 dark:text-gray-400">
                            <p>{t('PrivacyPolicy.section10.description')}</p>
                            <p>{t('PrivacyPolicy.section10.notification')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                    {(t('PrivacyPolicy.section10.notifyMethods', { returnObjects: true }) as any[]).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <p className="mt-4">{t('PrivacyPolicy.section10.continuedUse')}</p>
                        </div>
                    </section>

                    {/* Section 11 */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 animate-fadeInUp">
                        <div className="flex items-center space-x-3 mb-4">
                            <Mail className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                {t('PrivacyPolicy.section11.title')}
                            </h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-400">
                            <p>{t('PrivacyPolicy.section11.description')}</p>

                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Mail className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {t('PrivacyPolicy.section11.email')}:
                                        </p>
                                        <p className="text-amber-600 dark:text-amber-400">
                                            {t('PrivacyPolicy.section11.emailValue')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {t('PrivacyPolicy.section11.hotline')}:
                                        </p>
                                        <p>{t('PrivacyPolicy.section11.hotlineValue')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Globe className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {t('PrivacyPolicy.section11.address')}:
                                        </p>
                                        <p>{t('PrivacyPolicy.section11.addressValue')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Shield className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {t('PrivacyPolicy.section11.privacyOfficer')}:
                                        </p>
                                        <p>{t('PrivacyPolicy.section11.privacyOfficerEmail')}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm italic">
                                {t('PrivacyPolicy.section11.responseTime')}
                            </p>
                        </div>
                    </section>
                </div>

                
            </main>
        </div>
    );
}