import { useTranslation } from 'react-i18next';import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { FlashSaleData } from '../../../types/promotion.types';
import { formatCurrency } from '../../../utils/format';

interface FlashSaleSectionProps {
  flashSale: FlashSaleData;
  isLoading: boolean;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({ flashSale, isLoading }) => {const { t } = useTranslation();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(flashSale.endTime).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor(difference / (1000 * 60 * 60) % 24),
          minutes: Math.floor(difference / 1000 / 60 % 60),
          seconds: Math.floor(difference / 1000 % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [flashSale.endTime]);

  if (isLoading || flashSale.books.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        <Zap className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{flashSale.title}</h2>
                        {flashSale.description &&
            <p className="text-white/90 text-sm">{flashSale.description}</p>
            }
                    </div>
                </div>

                {/* Countdown */}
                <div className="flex items-center gap-2">
                    <span className="text-sm opacity-90">{t("Common.ketThucSau")}</span>
                    <div className="flex gap-1">
                        {[
            { label: t("Common.gio"), value: timeLeft.hours },
            { label: t("Common.phut"), value: timeLeft.minutes },
            { label: t("Common.giay"), value: timeLeft.seconds }].
            map((item, index) =>
            <div key={index} className="flex flex-col items-center">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[48px]">
                                    <span className="text-xl font-bold">
                                        {item.value.toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <span className="text-xs mt-1 opacity-75">{item.label}</span>
                            </div>
            )}
                    </div>
                </div>
            </div>

            {/* Books */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {flashSale.books.map((book) =>
        <div
          key={book.id}
          onClick={() => navigate(`/books/${book.slug}`)}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-3 cursor-pointer hover:bg-white/20 transition-colors">
          
                        <div className="aspect-[3/4] mb-2 overflow-hidden rounded-lg">
                            <img
              src={book.coverImageUrl || '/placeholder-book.jpg'}
              alt={book.title}
              className="w-full h-full object-cover" />
            
                        </div>
                        <div className="text-sm font-medium line-clamp-2 mb-1">{book.title}</div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold">{formatCurrency(book.discountPrice || book.price)}</span>
                            {book.discountPrice &&
            <span className="text-xs line-through opacity-75">
                                    {formatCurrency(book.price)}
                                </span>
            }
                        </div>
                    </div>
        )}
            </div>
        </div>);

};