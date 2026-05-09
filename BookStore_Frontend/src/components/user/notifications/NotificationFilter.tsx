import { useTranslation } from 'react-i18next';import { Filter, Package, Tag, Heart, MessageCircle, Star, Award, Bell } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { NotificationType } from '../../../types/enum';

interface NotificationFilterProps {
  activeFilter: NotificationType | 'all' | 'unread';
  onFilterChange: (filter: NotificationType | 'all' | 'unread') => void;
}

export const NotificationFilter = ({ activeFilter, onFilterChange }: NotificationFilterProps) => {const { t } = useTranslation();
  const { language } = useAppContext();

  const filters = [
  {
    id: 'all' as const,
    label: language === 'vi' ? t("Common.tatCa") : 'All',
    icon: <Bell className="w-4 h-4" />
  },
  {
    id: 'unread' as const,
    label: language === 'vi' ? t("Common.chuaDoc") : 'Unread',
    icon: <Bell className="w-4 h-4" />
  },
  {
    id: NotificationType.ORDER,
    label: language === 'vi' ? t("Common.donHang") : 'Orders',
    icon: <Package className="w-4 h-4" />
  },
  {
    id: NotificationType.PROMOTION,
    label: language === 'vi' ? t("Common.khuyenMai") : 'Promotions',
    icon: <Tag className="w-4 h-4" />
  },
  {
    id: NotificationType.WISHLIST,
    label: language === 'vi' ? t("Common.yeuThich") : 'Wishlist',
    icon: <Heart className="w-4 h-4" />
  },
  {
    id: NotificationType.QUESTION,
    label: language === 'vi' ? t("Common.hoiDap") : 'Q&A',
    icon: <MessageCircle className="w-4 h-4" />
  },
  {
    id: NotificationType.REVIEW,
    label: language === 'vi' ? t("Common.danhGia") : 'Reviews',
    icon: <Star className="w-4 h-4" />
  },
  {
    id: NotificationType.POINTS,
    label: language === 'vi' ? t("Common.diemThuong") : 'Points',
    icon: <Award className="w-4 h-4" />
  },
  {
    id: NotificationType.SYSTEM,
    label: language === 'vi' ? t("Common.heThong") : 'System',
    icon: <Bell className="w-4 h-4" />
  }];


  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                    {language === 'vi' ? t("Common.locThongBao") : 'Filter Notifications'}
                </h3>
            </div>

            <div className="space-y-2">
                {filters.map((filter) =>
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center gap-3 ${activeFilter === filter.id ?
          'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-2 border-amber-500' :
          'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`
          }>
          
                        {filter.icon}
                        <span>{filter.label}</span>
                    </button>
        )}
            </div>
        </div>);

};