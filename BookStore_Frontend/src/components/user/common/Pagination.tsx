import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const { t } = useTranslation();
    const maxVisiblePages = 5;
    
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage < 3) {
                for (let i = 0; i < 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages - 1);
            } else if (currentPage >= totalPages - 3) {
                pages.push(0);
                pages.push('...');
                for (let i = totalPages - 4; i < totalPages; i++) pages.push(i);
            } else {
                pages.push(0);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages - 1);
            }
        }
        
        return pages;
    };

    return (
        <nav 
            className="flex items-center justify-center gap-2 animate-fadeInUp" 
            aria-label="Pagination"
        >
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-500 dark:hover:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-300 dark:disabled:hover:border-gray-600 transition-all hover-scale group"
                aria-label="Previous page"
            >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1.5">
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span 
                            key={`ellipsis-${index}`} 
                            className="px-3 py-2 text-gray-400 dark:text-gray-500 select-none"
                        >
                            ⋯
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={`min-w-[42px] h-[42px] px-3 rounded-lg font-semibold transition-all hover-scale ${
                                currentPage === page
                                    ? 'btn-primary shadow-lg shadow-amber-500/30 dark:shadow-amber-900/50'
                                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-500 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400'
                            }`}
                            aria-label={`Page ${(page as number) + 1}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {(page as number) + 1}
                        </button>
                    )
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-500 dark:hover:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-300 dark:disabled:hover:border-gray-600 transition-all hover-scale group"
                aria-label="Next page"
            >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
            </button>

            {/* Page Info - Optional */}
            <div className="ml-4 hidden sm:block">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('CommonPagination.page')} <span className="font-semibold text-amber-600 dark:text-amber-400">{currentPage + 1}</span> {t('CommonPagination.of')} <span className="font-semibold">{totalPages}</span>
                </span>
            </div>
        </nav>
    );
}