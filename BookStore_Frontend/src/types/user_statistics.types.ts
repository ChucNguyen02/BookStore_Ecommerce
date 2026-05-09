export interface UserStatisticsResponse {
    totalOrders: number;
    totalSpent: number;
    totalBooks: number;
    totalReviews: number;
    monthlySpending: MonthlySpendingData[];
    ordersByStatus: Record<string, number>;
    topCategories: CategorySpendingData[];
    averageOrderValue: number;
    firstOrderDate: string | null;
    lastOrderDate: string | null;
}

export interface MonthlySpendingData {
    month: string; // Format: "YYYY-MM"
    year: number;
    monthNumber: number;
    totalSpent: number;
    orderCount: number;
}

export interface CategorySpendingData {
    categoryId: string;
    categoryName: string;
    totalSpent: number;
    bookCount: number;
}

export interface SpendingPeriod {
    label: string;
    value: 'all' | '3months' | '6months' | '12months';
}