export interface StatisticsResponse {
    totalUsers: number;
    totalBooks: number;
    totalOrders: number;
    totalRevenue: number;
    todayOrders: number;
    todayRevenue: number;
    monthlyOrders: number;
    monthlyRevenue: number;
    ordersByStatus: Record<string, number>;
    dailyRevenue: Record<string, number>;
    topSellingBooks: any[] | null;
    topCustomers: any[] | null;
}