import { TrendingUp, Sparkles, Clock } from 'lucide-react';
import { BannerSlider } from '../../components/user/home/BannerSlider';
import { QuickAccessSection } from '../../components/user/home/QuickAccessSection';
import { FlashSaleSection } from '../../components/user/home/FlashSaleSection';
import { PromotionalBanners } from '../../components/user/home/PromotionalBanners';
import { TopCategoriesSection } from '../../components/user/home/TopCategoriesSection';
import { BookSection } from '../../components/user/home/BookSection';
import { FeaturesSection } from '../../components/user/home/FeaturesSection';
import { TestimonialsSection } from '../../components/user/home/TestimonialsSection';
import { NewsletterSection } from '../../components/user/home/NewsletterSection';
import LoadingSpinner from '../../components/user/common/LoadingSpinner';
import { useBooks } from '../../hooks/user/useBooks';
import { useCategories } from '../../hooks/user/useCategories';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  const {
    featuredBooks,
    bestSellers,
    newArrivals,
    onSaleBooks,
    loading: booksLoading,
    error: booksError
  } = useBooks();

  const { useAllCategories } = useCategories();
  const {
    data: categories = [],
    isPending: categoriesLoading,
    error: categoriesErrorObj
  } = useAllCategories();

  const categoriesError = categoriesErrorObj ? (categoriesErrorObj as Error).message : null;

  if (booksLoading || categoriesLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (booksError || categoriesError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-xl text-red-600 dark:text-red-400">
                        {t('Home.loadError')}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        {booksError || categoriesError}
                    </p>
                </div>
            </div>);

  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Banner with Slider */}
            <BannerSlider />

            {/* Quick Access Icons */}
            <QuickAccessSection />

            {/* Flash Sale Section */}
            {onSaleBooks.length > 0 && <FlashSaleSection books={onSaleBooks} />}

            {/* Promotional Banners */}
            <PromotionalBanners />

            {/* Top Categories */}
            {categories.length > 0 && <TopCategoriesSection categories={categories} />}

            {featuredBooks.length === 0 && bestSellers.length === 0 && newArrivals.length === 0 && onSaleBooks.length === 0 &&
      <div className="container mx-auto px-4 py-8">
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">{t("Common.hienChuaCoDuLieu")}

        </div>
                </div>
      }

            {/* Featured Books */}
            {featuredBooks.length > 0 &&
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
                    <BookSection
          title={t('Home.featuredBooks')}
          books={featuredBooks}
          viewAllLink="/books?featured=true"
          icon={<Sparkles className="w-6 h-6" />}
          bgColor="from-amber-500 to-orange-500" />
        
                </div>
      }

            {/* Features Section */}
            <FeaturesSection />

            {/* Best Sellers */}
            {bestSellers.length > 0 &&
      <div className="bg-white dark:bg-gray-900">
                    <BookSection
          title={t('Home.bestSellers')}
          books={bestSellers}
          viewAllLink="/books?sort=bestseller"
          icon={<TrendingUp className="w-6 h-6" />}
          bgColor="from-blue-500 to-cyan-500" />
        
                </div>
      }

            {/* New Arrivals */}
            {newArrivals.length > 0 &&
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
                    <BookSection
          title={t('Home.newArrivals')}
          books={newArrivals}
          viewAllLink="/books?sort=newest"
          icon={<Clock className="w-6 h-6" />}
          bgColor="from-green-500 to-emerald-500" />
        
                </div>
      }

            {/* Testimonials */}
            <TestimonialsSection />

            {/* Newsletter */}
            <NewsletterSection />
        </div>);

};

export default Home;