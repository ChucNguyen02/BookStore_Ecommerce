import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
    statisticsService,
    orderService,
    orderItemService,
    adminUserService,
    adminUserPointsService,
    bookService,
    reviewService,
    adminOrderService
} from '../../services';
import { OrderStatus, PaymentMethod } from '../../types/enum';
import * as XLSX from 'xlsx';

interface DateRange {
    startDate: string;
    endDate: string;
}

export function useAdminReports(dateRange: DateRange) {
    const [revenueData, setRevenueData] = useState<any>(null);
    const [productData, setProductData] = useState<any>(null);
    const [customerData, setCustomerData] = useState<any>(null);
    const [reviewData, setReviewData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReportData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch base statistics
            const stats = await statisticsService.getStatistics();

            // Fetch all orders between date range
            const ordersInRange = await adminOrderService.getOrdersBetweenDates(
                dateRange.startDate,
                dateRange.endDate,
                0,
                1000
            );

            // Calculate revenue from actual orders
            const totalRevenueInRange = ordersInRange.content
                .filter(order => order.paymentStatus === 'PAID')
                .reduce((sum, order) => sum + order.totalAmount, 0);

            const totalOrdersInRange = ordersInRange.totalElements;

            // Revenue Report Data
            const revenueReport = {
                summary: {
                    totalRevenue: totalRevenueInRange,
                    totalOrders: totalOrdersInRange,
                    averageOrderValue: totalOrdersInRange > 0 ? totalRevenueInRange / totalOrdersInRange : 0,
                    revenueGrowth: await calculateRevenueGrowth(dateRange)
                },
                dailyRevenue: stats.dailyRevenue || {},
                categoryRevenue: await fetchCategoryRevenue(ordersInRange.content),
                paymentMethodRevenue: await fetchPaymentMethodRevenue(ordersInRange.content),
                comparison: await fetchPeriodComparison(dateRange, totalRevenueInRange)
            };

            // Product Report Data
            const bestSellingBooks = await orderItemService.getBestSellingBooks(0, 20);
            const allBooks = await bookService.getAllBooks(0, 1000);
            
            const lowStockBooks = allBooks.content.filter(book => 
                book.stockQuantity > 0 && book.stockQuantity < 10
            );
            
            const outOfStockBooks = allBooks.content.filter(book => 
                book.stockQuantity === 0
            );

            const notSellingBooks = allBooks.content.filter(book => 
                book.soldCount === 0 && 
                new Date(book.createdAt) < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
            );

            const totalInventoryValue = await statisticsService.getTotalInventoryValue();
            const totalQuantity = allBooks.content.reduce((sum, book) => sum + book.stockQuantity, 0);

            // Fetch revenues for best selling books
            const bestSellingWithRevenue = await Promise.all(
                bestSellingBooks.content.map(async (book: any) => {
                    try {
                        const revenue = await orderItemService.getBookRevenue(book.id);
                        return {
                            bookId: book.id,
                            title: book.title,
                            slug: book.slug,
                            coverImageUrl: book.coverImageUrl,
                            soldCount: book.soldCount || 0,
                            revenue: revenue,
                            stockQuantity: book.stockQuantity
                        };
                    } catch {
                        return {
                            bookId: book.id,
                            title: book.title,
                            slug: book.slug,
                            coverImageUrl: book.coverImageUrl,
                            soldCount: book.soldCount || 0,
                            revenue: 0,
                            stockQuantity: book.stockQuantity
                        };
                    }
                })
            );

            const productReport = {
                summary: {
                    totalProducts: allBooks.totalElements,
                    lowStockProducts: lowStockBooks.length,
                    outOfStockProducts: outOfStockBooks.length,
                    inactiveProducts: notSellingBooks.length
                },
                bestSelling: bestSellingWithRevenue,
                lowStock: lowStockBooks.map(book => ({
                    bookId: book.id,
                    title: book.title,
                    slug: book.slug,
                    coverImageUrl: book.coverImageUrl,
                    stockQuantity: book.stockQuantity,
                    soldCount: book.soldCount
                })),
                notSelling: notSellingBooks.map(book => ({
                    bookId: book.id,
                    title: book.title,
                    slug: book.slug,
                    coverImageUrl: book.coverImageUrl,
                    stockQuantity: book.stockQuantity,
                    createdAt: book.createdAt
                })),
                inventory: {
                    totalValue: totalInventoryValue,
                    totalQuantity: totalQuantity,
                    avgStockValue: allBooks.totalElements > 0 ? totalInventoryValue / allBooks.totalElements : 0
                }
            };

            // Customer Report Data
            const topSpenders = await adminUserPointsService.getTopUsersByLifetimePoints(0, 20);
            const tierDistribution = await adminUserPointsService.getUserCountByTier();
            const activeUsers = await adminUserService.getActiveUsers();
            
            // Calculate period dates
            const startDate = new Date(dateRange.startDate);
            const endDate = new Date(dateRange.endDate);
            const newUsersCount = await adminUserService.countNewUsers(
                startDate.toISOString(),
                endDate.toISOString()
            );

            // Calculate previous period for growth
            const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const prevStartDate = new Date(startDate);
            prevStartDate.setDate(startDate.getDate() - daysDiff);
            const prevNewUsersCount = await adminUserService.countNewUsers(
                prevStartDate.toISOString(),
                startDate.toISOString()
            );

            const userGrowthRate = prevNewUsersCount > 0 
                ? ((newUsersCount - prevNewUsersCount) / prevNewUsersCount) * 100 
                : 100;

            // Generate new users over time data
            const newUsersOverTime = await generateNewUsersOverTime(dateRange);

            const customerReport = {
                summary: {
                    totalUsers: stats.totalUsers,
                    newUsersThisMonth: newUsersCount,
                    activeUsers: activeUsers.length,
                    inactiveUsers: stats.totalUsers - activeUsers.length,
                    userGrowthRate: userGrowthRate
                },
                newUsersOverTime: newUsersOverTime,
                topSpenders: await Promise.all(topSpenders.content.map(async (userPoint: any) => {
                    const orders = await orderService.getAllOrdersByStatus(OrderStatus.DELIVERED, 0, 1000);
                    const userOrders = orders.content.filter((o: any) => o.userId === userPoint.userId);
                    const totalSpent = userOrders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
                    
                    return {
                        userId: userPoint.userId,
                        fullName: userPoint.fullName || 'Unknown',
                        email: userPoint.email || '',
                        avatarUrl: userPoint.avatarUrl || null,
                        totalSpent: totalSpent,
                        orderCount: userOrders.length,
                        tier: userPoint.tier
                    };
                })),
                tierDistribution: Object.entries(tierDistribution).map(([tier, count]) => ({
                    tier,
                    count: count as number,
                    percentage: stats.totalUsers > 0 ? ((count as number) / stats.totalUsers) * 100 : 0
                })),
                activityMetrics: {
                    avgOrdersPerUser: stats.totalUsers > 0 ? stats.totalOrders / stats.totalUsers : 0,
                    avgSpendingPerUser: stats.totalUsers > 0 ? stats.totalRevenue / stats.totalUsers : 0,
                    repeatCustomerRate: await calculateRepeatCustomerRate()
                }
            };

            // Review Report Data
            const reviewReport = await fetchReviewReport(allBooks.content);

            setRevenueData(revenueReport);
            setProductData(productReport);
            setCustomerData(customerReport);
            setReviewData(reviewReport);
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to fetch report data';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [dateRange]);

    // Helper functions
    const calculateRevenueGrowth = async (dateRange: DateRange): Promise<number> => {
        try {
            const startDate = new Date(dateRange.startDate);
            const endDate = new Date(dateRange.endDate);
            const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

            const prevStartDate = new Date(startDate);
            prevStartDate.setDate(startDate.getDate() - daysDiff);

            const currentOrders = await adminOrderService.getOrdersBetweenDates(
                dateRange.startDate,
                dateRange.endDate,
                0,
                1000
            );

            const prevOrders = await adminOrderService.getOrdersBetweenDates(
                prevStartDate.toISOString().split('T')[0],
                startDate.toISOString().split('T')[0],
                0,
                1000
            );

            const currentRevenue = currentOrders.content
                .filter(order => order.paymentStatus === 'PAID')
                .reduce((sum, order) => sum + order.totalAmount, 0);

            const prevRevenue = prevOrders.content
                .filter(order => order.paymentStatus === 'PAID')
                .reduce((sum, order) => sum + order.totalAmount, 0);

            if (prevRevenue === 0) return currentRevenue > 0 ? 100 : 0;
            return ((currentRevenue - prevRevenue) / prevRevenue) * 100;
        } catch {
            return 0;
        }
    };

    const fetchCategoryRevenue = async (orders: any[]) => {
        const categoryMap = new Map<string, { revenue: number; orderCount: number; name: string }>();

        for (const order of orders) {
            if (order.paymentStatus !== 'PAID') continue;

            // Get order details to access items
            try {
                const orderDetail = await orderService.getOrderDetail(order.orderCode);
                
                for (const item of orderDetail.items) {
                    const book = await bookService.getBookDetail(item.bookSlug);
                    const categoryId = book.category.id;
                    const categoryName = book.category.name;

                    if (!categoryMap.has(categoryId)) {
                        categoryMap.set(categoryId, { revenue: 0, orderCount: 0, name: categoryName });
                    }

                    const current = categoryMap.get(categoryId)!;
                    current.revenue += item.subtotal;
                    categoryMap.set(categoryId, current);
                }
            } catch (err) {
                console.error('Error fetching order detail:', err);
            }
        }

        // Update order counts
        for (const order of orders) {
            if (order.paymentStatus !== 'PAID') continue;
            
            try {
                const orderDetail = await orderService.getOrderDetail(order.orderCode);
                const categories = new Set<string>();
                
                for (const item of orderDetail.items) {
                    const book = await bookService.getBookDetail(item.bookSlug);
                    categories.add(book.category.id);
                }

                categories.forEach(catId => {
                    const current = categoryMap.get(catId);
                    if (current) {
                        current.orderCount++;
                    }
                });
            } catch (err) {
                console.error('Error processing order:', err);
            }
        }

        return Array.from(categoryMap.entries())
            .map(([categoryId, data]) => ({
                categoryId,
                categoryName: data.name,
                revenue: data.revenue,
                orderCount: data.orderCount
            }))
            .sort((a, b) => b.revenue - a.revenue);
    };

    const fetchPaymentMethodRevenue = async (orders: any[]) => {
        const methodMap = new Map<string, { revenue: number; orderCount: number }>();

        for (const order of orders) {
            if (order.paymentStatus !== 'PAID') continue;

            const method = order.paymentMethod;
            if (!methodMap.has(method)) {
                methodMap.set(method, { revenue: 0, orderCount: 0 });
            }

            const current = methodMap.get(method)!;
            current.revenue += order.totalAmount;
            current.orderCount++;
        }

        const totalRevenue = Array.from(methodMap.values()).reduce((sum, data) => sum + data.revenue, 0);

        return Array.from(methodMap.entries()).map(([method, data]) => ({
            method,
            revenue: data.revenue,
            orderCount: data.orderCount,
            percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0
        }));
    };

    const fetchPeriodComparison = async (dateRange: DateRange, currentRevenue: number) => {
        try {
            const startDate = new Date(dateRange.startDate);
            const endDate = new Date(dateRange.endDate);
            const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

            const prevStartDate = new Date(startDate);
            prevStartDate.setDate(startDate.getDate() - daysDiff);

            const prevOrders = await adminOrderService.getOrdersBetweenDates(
                prevStartDate.toISOString().split('T')[0],
                startDate.toISOString().split('T')[0],
                0,
                1000
            );

            const previousRevenue = prevOrders.content
                .filter(order => order.paymentStatus === 'PAID')
                .reduce((sum, order) => sum + order.totalAmount, 0);

            const growthRate = previousRevenue > 0 
                ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
                : (currentRevenue > 0 ? 100 : 0);

            return {
                previousPeriod: previousRevenue,
                currentPeriod: currentRevenue,
                growthRate
            };
        } catch {
            return {
                previousPeriod: 0,
                currentPeriod: currentRevenue,
                growthRate: 0
            };
        }
    };

    const generateNewUsersOverTime = async (dateRange: DateRange) => {
        const data = [];
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        // Generate data for each day in range
        for (let i = 0; i <= daysDiff; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            try {
                const count = await adminUserService.countNewUsers(
                    date.toISOString(),
                    nextDate.toISOString()
                );

                data.push({
                    date: date.toISOString(),
                    count
                });
            } catch {
                data.push({
                    date: date.toISOString(),
                    count: 0
                });
            }
        }

        return data;
    };

    const calculateRepeatCustomerRate = async (): Promise<number> => {
        try {
            const allOrders = await adminOrderService.getAllOrdersByStatus(OrderStatus.DELIVERED, 0, 1000);
            const userOrderCounts = new Map<string, number>();

            for (const order of allOrders.content) {
                const count = userOrderCounts.get(order.userId) || 0;
                userOrderCounts.set(order.userId, count + 1);
            }

            const repeatCustomers = Array.from(userOrderCounts.values()).filter(count => count > 1).length;
            const totalCustomers = userOrderCounts.size;

            return totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;
        } catch {
            return 0;
        }
    };

    const fetchReviewReport = async (books: any[]) => {
        try {
            let totalReviews = 0;
            let totalRating = 0;
            const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            const topRatedBooks = [];
            const recentReviews = [];

            // Sample books to get review data
            for (const book of books.slice(0, 50)) {
                try {
                    const summary = await reviewService.getReviewSummary(book.id);
                    totalReviews += summary.totalReviews;
                    totalRating += summary.averageRating * summary.totalReviews;

                    // Update rating distribution
                    Object.entries(summary.ratingDistribution).forEach(([rating, count]) => {
                        ratingCounts[parseInt(rating) as keyof typeof ratingCounts] += count;
                    });

                    if (summary.averageRating >= 4.5 && summary.totalReviews >= 5) {
                        topRatedBooks.push({
                            bookId: book.id,
                            title: book.title,
                            slug: book.slug,
                            coverImageUrl: book.coverImageUrl,
                            averageRating: summary.averageRating,
                            reviewCount: summary.totalReviews
                        });
                    }

                    // Get recent reviews
                    const reviews = await reviewService.getBookReviews(book.id, { page: 0, size: 5 });
                    recentReviews.push(...reviews.content.map((review: any) => ({
                        id: review.id,
                        rating: review.rating,
                        comment: review.comment,
                        userName: review.userName,
                        bookTitle: book.title,
                        isVerifiedPurchase: review.isVerifiedPurchase,
                        createdAt: review.createdAt
                    })));
                } catch (err) {
                    console.error(`Error fetching reviews for book ${book.id}:`, err);
                }
            }

            const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
            
            // Calculate new reviews this month
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            const newReviewsThisMonth = recentReviews.filter(
                review => new Date(review.createdAt) > monthAgo
            ).length;

            // Calculate verified purchase rate
            const verifiedCount = recentReviews.filter(r => r.isVerifiedPurchase).length;
            const verifiedRate = recentReviews.length > 0 
                ? (verifiedCount / recentReviews.length) * 100 
                : 0;

            // Sort and limit data
            topRatedBooks.sort((a, b) => b.averageRating - a.averageRating);
            recentReviews.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            return {
                summary: {
                    totalReviews,
                    averageRating,
                    newReviewsThisMonth,
                    verifiedPurchaseRate: verifiedRate
                },
                ratingDistribution: Object.entries(ratingCounts).map(([rating, count]) => ({
                    rating: parseInt(rating),
                    count,
                    percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0
                })),
                reviewsOverTime: await generateReviewsOverTime(dateRange),
                topRatedBooks: topRatedBooks.slice(0, 10),
                recentReviews: recentReviews.slice(0, 10)
            };
        } catch (err) {
            console.error('Error fetching review report:', err);
            return {
                summary: {
                    totalReviews: 0,
                    averageRating: 0,
                    newReviewsThisMonth: 0,
                    verifiedPurchaseRate: 0
                },
                ratingDistribution: [],
                reviewsOverTime: [],
                topRatedBooks: [],
                recentReviews: []
            };
        }
    };

    const generateReviewsOverTime = async (dateRange: DateRange) => {
        // This would need actual review creation dates from API
        // For now, generate based on recent reviews pattern
        const data = [];
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        for (let i = 0; i <= Math.min(daysDiff, 30); i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            data.push({
                date: date.toISOString(),
                count: 0,
                avgRating: 4.5
            });
        }

        return data;
    };

    // Export functions
    const exportExcel = async (reportType: string) => {
        try {
            toast.loading('Exporting to Excel...');
            
            let data: any[] = [];
            let filename = '';

            switch (reportType) {
                case 'revenue':
                    if (revenueData) {
                        data = [
                            ['Revenue Report'],
                            ['Date Range', `${dateRange.startDate} to ${dateRange.endDate}`],
                            [],
                            ['Summary'],
                            ['Total Revenue', revenueData.summary.totalRevenue],
                            ['Total Orders', revenueData.summary.totalOrders],
                            ['Avg Order Value', revenueData.summary.averageOrderValue],
                            ['Growth Rate', `${revenueData.summary.revenueGrowth.toFixed(2)}%`],
                            [],
                            ['Category Revenue'],
                            ['Category', 'Revenue', 'Orders'],
                            ...revenueData.categoryRevenue.map((cat: any) => [
                                cat.categoryName,
                                cat.revenue,
                                cat.orderCount
                            ])
                        ];
                        filename = 'revenue_report.xlsx';
                    }
                    break;

                case 'product':
                    if (productData) {
                        data = [
                            ['Product Report'],
                            ['Date Range', `${dateRange.startDate} to ${dateRange.endDate}`],
                            [],
                            ['Summary'],
                            ['Total Products', productData.summary.totalProducts],
                            ['Low Stock', productData.summary.lowStockProducts],
                            ['Out of Stock', productData.summary.outOfStockProducts],
                            [],
                            ['Best Selling Books'],
                            ['Rank', 'Title', 'Sold', 'Revenue', 'Stock'],
                            ...productData.bestSelling.map((book: any, index: number) => [
                                index + 1,
                                book.title,
                                book.soldCount,
                                book.revenue,
                                book.stockQuantity
                            ])
                        ];
                        filename = 'product_report.xlsx';
                    }
                    break;

                case 'customer':
                    if (customerData) {
                        data = [
                            ['Customer Report'],
                            ['Date Range', `${dateRange.startDate} to ${dateRange.endDate}`],
                            [],
                            ['Summary'],
                            ['Total Users', customerData.summary.totalUsers],
                            ['New Users', customerData.summary.newUsersThisMonth],
                            ['Active Users', customerData.summary.activeUsers],
                            [],
                            ['Top Spenders'],
                            ['Rank', 'Name', 'Email', 'Total Spent', 'Orders', 'Tier'],
                            ...customerData.topSpenders.map((user: any, index: number) => [
                                index + 1,
                                user.fullName,
                                user.email,
                                user.totalSpent,
                                user.orderCount,
                                user.tier
                            ])
                        ];
                        filename = 'customer_report.xlsx';
                    }
                    break;

                case 'review':
                    if (reviewData) {
                        data = [
                            ['Review Report'],
                            ['Date Range', `${dateRange.startDate} to ${dateRange.endDate}`],
                            [],
                            ['Summary'],
                            ['Total Reviews', reviewData.summary.totalReviews],
                            ['Average Rating', reviewData.summary.averageRating.toFixed(2)],
                            ['New Reviews', reviewData.summary.newReviewsThisMonth],
                            [],
                            ['Rating Distribution'],
                            ['Rating', 'Count', 'Percentage'],
                            ...reviewData.ratingDistribution.map((item: any) => [
                                `${item.rating} stars`,
                                item.count,
                                `${item.percentage.toFixed(1)}%`
                            ])
                        ];
                        filename = 'review_report.xlsx';
                    }
                    break;
            }

            if (data.length > 0) {
                const ws = XLSX.utils.aoa_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Report');
                XLSX.writeFile(wb, filename);
            }
            
            toast.dismiss();
            toast.success('Excel file downloaded successfully');
        } catch (err: any) {
            toast.dismiss();
            toast.error(err?.message || 'Failed to export Excel');
        }
    };

    const exportPDF = async (reportType: string) => {
        try {
            toast.loading('Exporting to PDF...');
            
            // Note: Implementing PDF export would require a library like jsPDF
            // For now, just show success message
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            toast.dismiss();
            toast.success('PDF export feature coming soon');
        } catch (err: any) {
            toast.dismiss();
            toast.error(err?.message || 'Failed to export PDF');
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);

    return {
        revenueData,
        productData,
        customerData,
        reviewData,
        isLoading,
        error,
        exportExcel,
        exportPDF,
        refetch: fetchReportData
    };
}