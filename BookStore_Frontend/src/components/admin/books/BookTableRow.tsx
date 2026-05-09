import { Edit, Trash2, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { BookResponse } from '../../../types/book.types';

interface BookTableRowProps {
    book: BookResponse;
    index?: number;
    onEdit: (id: string) => void;
    onDelete: (id: string, title: string) => void;
    onView: (slug: string) => void;
}

export default function BookTableRow({ book, index, onEdit, onDelete, onView }: BookTableRowProps) {
    const { t } = useTranslation();

    return (
        <tr 
            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-smooth animate-fadeInUp hover-lift"
            style={{ animationDelay: index !== undefined ? `${index * 0.05}s` : undefined }}
        >
            {/* Book Info with Cover */}
            <td className="px-6 py-4">
                <div className="flex items-center space-x-4">
                    <div className="relative group flex-shrink-0">
                        <img
                            src={book.coverImageUrl || '/placeholder-book.jpg'}
                            alt={book.title}
                            className="w-16 h-20 object-cover rounded-lg shadow-md hover-scale transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Eye className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer">
                            {book.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            ISBN: {book.isbn || 'N/A'}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {book.isFeatured && (
                                <span className="badge badge-primary animate-fadeIn">
                                    ⭐ Featured
                                </span>
                            )}
                            {book.isOnSale && (
                                <span className="badge badge-danger animate-fadeIn">
                                    🔥 Sale
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </td>

            {/* Category */}
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {book.categoryName}
                </span>
            </td>

            {/* Price */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="space-y-1">
                    {book.discountPrice ? (
                        <>
                            <p className="text-sm font-bold text-green-600 dark:text-green-400">
                                ${book.discountPrice.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 line-through">
                                ${book.price.toFixed(2)}
                            </p>
                            {book.discountPercentage && (
                                <span className="badge badge-danger text-xs">
                                    -{book.discountPercentage}%
                                </span>
                            )}
                        </>
                    ) : (
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                            ${book.price.toFixed(2)}
                        </p>
                    )}
                </div>
            </td>

            {/* Stock Quantity */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${book.stockQuantity > 10
                                ? 'bg-green-500 animate-pulse'
                                : book.stockQuantity > 0
                                    ? 'bg-amber-500 animate-pulse'
                                    : 'bg-red-500'
                            }`} />
                        <p className={`text-sm font-bold ${book.stockQuantity > 10
                                ? 'text-green-600 dark:text-green-400'
                                : book.stockQuantity > 0
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : 'text-red-600 dark:text-red-400'
                            }`}>
                            {book.stockQuantity}
                        </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        📦 Sold: {book.soldCount}
                    </p>
                </div>
            </td>

            {/* Status Badge */}
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`badge ${book.inStock
                        ? 'badge-success'
                        : 'badge-danger'
                    }`}>
                    {book.inStock ? t('admin.inStock') : t('admin.outOfStock')}
                </span>
            </td>

            {/* Action Buttons */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onView(book.slug)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all hover-scale"
                        title={t('admin.view')}
                        aria-label={t('admin.view')}
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onEdit(book.id)}
                        className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all hover-scale"
                        title={t('admin.edit')}
                        aria-label={t('admin.edit')}
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(book.id, book.title)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all hover-scale"
                        title={t('admin.delete')}
                        aria-label={t('admin.delete')}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}