import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <BookOpen className="w-8 h-8 text-amber-500" />
                            <h3 className="text-2xl font-serif font-bold">BookStore</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{t('Footer.tagline')}</p>
                        <div className="flex space-x-3">
                            <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors">
                                <Youtube className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">{t('Footer.quickLinks')}</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/books" className="hover:text-amber-500 transition-colors">{t('Footer.books')}</a></li>
                            <li><a href="/about" className="hover:text-amber-500 transition-colors">{t('Footer.about')}</a></li>
                            <li><a href="/blog" className="hover:text-amber-500 transition-colors">{t('Footer.blog')}</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">{t('Footer.support')}</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/contact" className="hover:text-amber-500 transition-colors">{t('Footer.contact')}</a></li>
                            <li><a href="/faq" className="hover:text-amber-500 transition-colors">{t('Footer.faq')}</a></li>
                            <li><a href="/shipping" className="hover:text-amber-500 transition-colors">{t('Footer.shipping')}</a></li>
                            <li><a href="/return" className="hover:text-amber-500 transition-colors">{t('Footer.return')}</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">{t('Footer.connect')}</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-start space-x-2">
                                <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{t('Footer.address')}</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Mail className="w-5 h-5 text-amber-500" />
                                <span className="text-sm">{t('Footer.email')}</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone className="w-5 h-5 text-amber-500" />
                                <span className="text-sm">{t('Footer.phone')}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>© {new Date().getFullYear()} BookStore. {t('Footer.allRights')}</p>
                        <div className="flex space-x-6 mt-2 md:mt-0">
                            <a href="/privacy" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
                            <a href="/terms" className="hover:text-amber-500 transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};