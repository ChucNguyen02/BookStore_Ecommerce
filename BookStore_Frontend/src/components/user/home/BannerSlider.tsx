import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Banner {
    id: number;
    titleKey: string;
    subtitleKey: string;
    buttonTextKey: string;
    buttonLink: string;
    imageUrl: string;
    bgGradient: string;
}

export const BannerSlider = memo(() => {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);

    const banners: Banner[] = [
        {
            id: 1,
            titleKey: 'BannerSlider.banner1Title',
            subtitleKey: 'BannerSlider.banner1Subtitle',
            buttonTextKey: 'BannerSlider.shopNow',
            buttonLink: '/books?sale=true',
            imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
            bgGradient: 'from-amber-500 to-orange-600'
        },
        {
            id: 2,
            titleKey: 'BannerSlider.banner2Title',
            subtitleKey: 'BannerSlider.banner2Subtitle',
            buttonTextKey: 'BannerSlider.explore',
            buttonLink: '/books?sort=newest',
            imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
            bgGradient: 'from-blue-500 to-purple-600'
        },
        {
            id: 3,
            titleKey: 'BannerSlider.banner3Title',
            subtitleKey: 'BannerSlider.banner3Subtitle',
            buttonTextKey: 'BannerSlider.viewNow',
            buttonLink: '/books?sort=bestseller',
            imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
            bgGradient: 'from-green-500 to-teal-600'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    return (
        <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-gray-900 dark:bg-gray-950">
            {/* Slides */}
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-all duration-700 ${
                        index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={banner.imageUrl}
                            alt={t(banner.titleKey)}
                            className="w-full h-full object-cover"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient} opacity-80`} />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex items-center">
                        <div className="container mx-auto px-4">
                            <div className="max-w-2xl text-white space-y-6 animate-fadeInUp">
                                <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                                    {t(banner.titleKey)}
                                </h1>
                                <p className="text-xl md:text-2xl text-white/90">
                                    {t(banner.subtitleKey)}
                                </p>
                                <Link
                                    to={banner.buttonLink}
                                    className="inline-block px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl hover:scale-105"
                                >
                                    {t(banner.buttonTextKey)}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all z-10"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all z-10"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                            index === currentSlide
                                ? 'bg-white w-8'
                                : 'bg-white/50 hover:bg-white/75'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
});

BannerSlider.displayName = 'BannerSlider';