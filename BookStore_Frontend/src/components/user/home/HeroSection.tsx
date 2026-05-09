import { useTranslation } from 'react-i18next';import { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';

export const HeroSection = () => {const { t } = useTranslation();
  const { language } = useAppContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const trendingSearches = language === 'vi' ?
  [t("Common.vanHocVietNam"), t("Common.tieuThuyet"), t("Common.sachKinhTe"), 'Self-help'] :
  ['Vietnamese Literature', 'Novel', 'Economics', 'Self-help'];

  return (
    <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/30 dark:bg-amber-900/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/30 dark:bg-orange-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {/* Title */}
                    <div className="space-y-4 animate-fadeInUp">
                        <h1 className="text-5xl md:text-6xl font-serif font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                            {language === 'vi' ? t("Common.khamPhaTheGioiTri") : 'Discover The World of Knowledge'}
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            {language === 'vi' ? t("Common.hangNghinDauSachChat") :

              'Thousands of quality books at the best market prices'}
                        </p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <div className="relative max-w-3xl mx-auto">
                            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'vi' ? t("Common.timKiemSachTacGia") : 'Search books, authors...'}
                className="w-full px-6 py-5 pr-14 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-500 shadow-xl dark:shadow-gray-950/50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all" />
              
                            <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white p-3 rounded-xl hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all shadow-lg hover:shadow-xl">
                
                                <Search className="w-6 h-6" />
                            </button>
                        </div>
                    </form>

                    {/* Trending Searches */}
                    <div className="flex items-center justify-center gap-3 flex-wrap animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {language === 'vi' ? t("Common.timKiemPhoBien") : 'Trending:'}
                            </span>
                        </div>
                        {trendingSearches.map((term, index) =>
            <button
              key={index}
              onClick={() => {
                setSearchQuery(term);
                navigate(`/books?search=${encodeURIComponent(term)}`);
              }}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-amber-100 dark:hover:bg-gray-700 hover:text-amber-700 dark:hover:text-amber-400 transition-all shadow-sm hover:shadow-md">
              
                                {term}
                            </button>
            )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                        {[
            { value: '10,000+', label: language === 'vi' ? t("Common.dauSach") : 'Books' },
            { value: '50,000+', label: language === 'vi' ? t("Common.khachHang") : 'Customers' },
            { value: '4.8⭐', label: language === 'vi' ? t("Common.danhGia") : 'Rating' },
            { value: '24/7', label: language === 'vi' ? t("Common.hoTro") : 'Support' }].
            map((stat, index) =>
            <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover-lift">
                                <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
                            </div>
            )}
                    </div>
                </div>
            </div>
        </div>);

};