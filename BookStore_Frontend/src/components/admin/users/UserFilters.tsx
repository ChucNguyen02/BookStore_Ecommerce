import { useTranslation } from 'react-i18next';
import { Role, Tier } from '../../../types/enum';

interface UserFiltersProps {
    filters: {
        role: Role | '';
        isActive: string;
        tier: Tier | '';
    };
    onFiltersChange: (filters: any) => void;
    onApply: () => void;
    onReset: () => void;
}

export default function UserFilters({
    filters,
    onFiltersChange,
    onApply,
    onReset,
}: UserFiltersProps) {
    const { t } = useTranslation();

    return (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-fadeInUp">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Role Filter */}
                <div className="stagger-item">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('admin.role')}
                    </label>
                    <select
                        value={filters.role}
                        onChange={(e) =>
                            onFiltersChange({ ...filters, role: e.target.value as Role | '' })
                        }
                        className="input-field"
                    >
                        <option value="">{t('admin.allRoles')}</option>
                        <option value={Role.USER}>{t('admin.user')}</option>
                        <option value={Role.ADMIN}>{t('admin.admin')}</option>
                    </select>
                </div>

                {/* Status Filter */}
                <div className="stagger-item" style={{ animationDelay: '0.1s' }}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('admin.status')}
                    </label>
                    <select
                        value={filters.isActive}
                        onChange={(e) => onFiltersChange({ ...filters, isActive: e.target.value })}
                        className="input-field"
                    >
                        <option value="">{t('admin.allStatus')}</option>
                        <option value="true">{t('admin.active')}</option>
                        <option value="false">{t('admin.inactive')}</option>
                    </select>
                </div>

                {/* Tier Filter */}
                <div className="stagger-item" style={{ animationDelay: '0.2s' }}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('admin.tier')}
                    </label>
                    <select
                        value={filters.tier}
                        onChange={(e) =>
                            onFiltersChange({ ...filters, tier: e.target.value as Tier | '' })
                        }
                        className="input-field"
                    >
                        <option value="">{t('admin.allTiers')}</option>
                        <option value={Tier.BRONZE}>{t('admin.bronze')}</option>
                        <option value={Tier.SILVER}>{t('admin.silver')}</option>
                        <option value={Tier.GOLD}>{t('admin.gold')}</option>
                        <option value={Tier.PLATINUM}>{t('admin.platinum')}</option>
                    </select>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <button
                    onClick={onApply}
                    className="btn-primary"
                >
                    {t('admin.applyFilters')}
                </button>
                <button
                    onClick={onReset}
                    className="btn-secondary"
                >
                    {t('admin.resetFilters')}
                </button>
            </div>
        </div>
    );
}