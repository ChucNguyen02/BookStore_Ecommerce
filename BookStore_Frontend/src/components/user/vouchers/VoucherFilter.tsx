import { useTranslation } from 'react-i18next';import { Filter, X } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

interface VoucherFilterProps {
  activeFilter: 'all' | 'valid' | 'expired' | 'personal';
  onFilterChange: (filter: 'all' | 'valid' | 'expired' | 'personal') => void;
}

export const VoucherFilter = ({ activeFilter, onFilterChange }: VoucherFilterProps) => {const { t } = useTranslation();
  const { language } = useAppContext();

  const filters = [
  { id: 'all' as const, label: language === 'vi' ? t("Common.tatCa") : 'All' },
  { id: 'valid' as const, label: language === 'vi' ? t("Common.conHieuLuc") : 'Valid' },
  { id: 'expired' as const, label: language === 'vi' ? t("Common.hetHan") : 'Expired' },
  { id: 'personal' as const, label: language === 'vi' ? t("Common.caNhan") : 'Personal' }];


  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                    {language === 'vi' ? t("Common.boLoc") : 'Filter'}
                </h3>
            </div>

            <div className="space-y-2">
                {filters.map((filter) =>
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all ${activeFilter === filter.id ?
          'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-2 border-amber-500' :
          'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`
          }>
          
                        {filter.label}
                    </button>
        )}
            </div>

            {activeFilter !== 'all' &&
      <button
        onClick={() => onFilterChange('all')}
        className="w-full mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
        
                    <X className="w-4 h-4" />
                    {language === 'vi' ? t("Common.xoaBoLoc") : 'Clear filter'}
                </button>
      }
        </div>);

};