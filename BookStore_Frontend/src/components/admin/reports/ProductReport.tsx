import { useTranslation } from 'react-i18next';
import {
    TrendingUp,
    Package,
    AlertTriangle,
    XCircle,
    BarChart3
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface ProductReportProps {
    data: {
        summary: {
            totalProducts: number;
            lowStockProducts: number;
            outOfStockProducts: number;
            inactiveProducts: number;
        };
        bestSelling: Array<{
            bookId: string;
            title: string;
            slug: string;
            coverImageUrl: string | null;
            soldCount: number;
            revenue: number;
            stockQuantity: number;
        }>;
        lowStock: Array<{
            bookId: string;
            title: string;
            slug: string;
            coverImageUrl: string | null;
            stockQuantity: number;
            soldCount: number;
        }>;
        notSelling: Array<{
            bookId: string;
            title: string;
            slug: string;
            coverImageUrl: string | null;
            stockQuantity: number;
            createdAt: string;
        }>;
        inventory: {
            totalValue: number;
            totalQuantity: number;
            avgStockValue: number;
        };
    };
}

export default function ProductReport({ data }: ProductReportProps) {
    const { t } = useTranslation();

    const { summary, bestSelling, lowStock, notSelling, inventory } = data;

    const StatCard = ({ label, value, icon: Icon, colorClass, description }: any) => (
        <div className="card hover-lift">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                        {label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            {description && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
                </div>
            )}
        </div>
    );

    const ProductList = ({ items, type }: { items: any[]; type: 'bestselling' | 'lowstock' | 'notselling' }) => (
        <div className="space-y-2">
            {items.slice(0, 10).map((item, index) => (
                <div
                    key={item.bookId}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-smooth hover-lift border border-gray-200 dark:border-gray-700 animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-white shadow-lg ${index === 0 ? 'bg-gradient-to-br from-amber-500 to-yellow-600' :
                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                            index === 2 ? 'bg-gradient-to-br from-orange-600 to-amber-700' :
                                'bg-gradient-to-br from-gray-500 to-gray-600'
                        }`}>
                        #{index + 1}
                    </div>

                    <div className="relative">
                        {item.coverImageUrl ? (
                            <img
                                src={item.coverImageUrl}
                                alt={item.title}
                                className="w-12 h-16 object-cover rounded-lg shadow-lg border-2 border-white dark:border-gray-700"
                            />
                        ) : (
                            <div className="w-12 h-16 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center shadow-lg">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                        )}
                        {type === 'lowstock' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                            {item.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-1 text-sm">
                            {type === 'bestselling' && (
                                <>
                                    <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                                        <TrendingUp className="w-3 h-3" />
                                        {item.soldCount} {t('admin.sold')}
                                    </span>
                                    <span className="text-green-600 dark:text-green-400 font-semibold">
                                        ${item.revenue.toLocaleString()}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 ${item.stockQuantity < 10 ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                                        <Package className="w-3 h-3" />
                                        {item.stockQuantity}
                                    </span>
                                </>
                            )}
                            {type === 'lowstock' && (
                                <>
                                    <span className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400 font-semibold">
                                        <AlertTriangle className="w-3 h-3" />
                                        {item.stockQuantity} {t('admin.remaining')}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {item.soldCount} {t('admin.sold')}
                                    </span>
                                </>
                            )}
                            {type === 'notselling' && (
                                <>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {item.stockQuantity} {t('admin.inStock')}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-500 text-xs">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {type === 'lowstock' && (
                        <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 rounded-full text-xs font-semibold shadow-sm">
                            {t('admin.lowStock')}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );

    // Chart data for best selling
    const chartData = bestSelling.slice(0, 10).map(item => ({
        name: item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title,
        sold: item.soldCount,
        revenue: item.revenue
    }));

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stagger-item">
                    <StatCard
                        label={t('admin.totalProducts')}
                        value={summary.totalProducts.toLocaleString()}
                        icon={Package}
                        colorClass="from-blue-500 to-cyan-600"
                        description={`Total value: $${inventory.totalValue.toLocaleString()}`}
                    />
                </div>
                <div className="stagger-item">
                    <StatCard
                        label={t('admin.lowStockProducts')}
                        value={summary.lowStockProducts.toLocaleString()}
                        icon={AlertTriangle}
                        colorClass="from-orange-500 to-amber-600"
                        description={t('admin.needsRestocking')}
                    />
                </div>
                <div className="stagger-item">
                    <StatCard
                        label={t('admin.outOfStock')}
                        value={summary.outOfStockProducts.toLocaleString()}
                        icon={XCircle}
                        colorClass="from-red-500 to-rose-600"
                        description={t('admin.urgentRestocking')}
                    />
                </div>
                <div className="stagger-item">
                    <StatCard
                        label={t('admin.notSelling')}
                        value={notSelling.length.toLocaleString()}
                        icon={TrendingUp}
                        colorClass="from-gray-500 to-gray-600"
                        description={t('admin.noSalesRecently')}
                    />
                </div>
            </div>

            {/* Inventory Overview */}
            <div className="card stagger-item hover-lift border-l-4 border-blue-500">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                        <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('admin.inventoryOverview')}
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                            {t('admin.totalInventoryValue')}
                        </p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            ${inventory.totalValue.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                            {t('admin.totalQuantity')}
                        </p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {inventory.totalQuantity.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                            {t('admin.avgStockValue')}
                        </p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            ${inventory.avgStockValue.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Best Selling Chart */}
            <div className="card stagger-item hover-lift border-l-4 border-purple-500">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('admin.topSellingProducts')}
                    </h3>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis type="number" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={150}
                            stroke="#9CA3AF"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: 'none',
                                borderRadius: '0.75rem',
                                color: '#fff',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="sold"
                            fill="url(#blueGradient)"
                            name="Units Sold"
                            radius={[0, 8, 8, 0]}
                        />
                        <defs>
                            <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#06B6D4" />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Product Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Best Selling */}
                <div className="card stagger-item hover-lift border-l-4 border-blue-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('admin.bestSellingBooks')}
                        </h3>
                    </div>
                    <ProductList items={bestSelling} type="bestselling" />
                </div>

                {/* Low Stock */}
                <div className="card stagger-item hover-lift border-l-4 border-orange-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                            <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('admin.lowStockAlert')}
                        </h3>
                    </div>
                    {lowStock.length > 0 ? (
                        <ProductList items={lowStock} type="lowstock" />
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Package className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                                {t('admin.allProductsWellStocked')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Not Selling Products */}
            {notSelling.length > 0 && (
                <div className="card stagger-item hover-lift border-l-4 border-gray-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                            <XCircle className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('admin.productsNotSelling')}
                        </h3>
                    </div>
                    <ProductList items={notSelling} type="notselling" />
                </div>
            )}
        </div>
    );
}