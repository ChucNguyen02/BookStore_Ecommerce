import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/user/layouts/MainLayout';
import AuthLayout from '../components/user/layouts/AuthLayout';
import AdminLayout from '../components/admin/layouts/AdminLayout';
import AuthRoute from '../components/user/auth/AuthRoute';
import ProtectedRoute from '../components/user/auth/ProtectedRoute';
import AdminRoute from '../components/admin/auth/AdminRoute';

// Auth Pages
import { Login, Register, ForgotPassword, ResetPassword } from '../pages/user/auth';
import AdminLogin from '../pages/admin/auth/AdminLogin';
import VerifyEmail from '../pages/user/auth/VerifyEmail';
import VerifyEmailChange from '../pages/user/auth/VerifyEmailChange';

// Public Pages
import Home from '../pages/user/Home';
import Books from '../pages/user/books/Books';
import BookDetail from '../pages/user/books/BookDetail';
import SearchBooks from '../pages/user/books/SearchBooks';
import Categories from '../pages/user/categories/Categories';
import CategoryDetail from '../pages/user/categories/CategoryDetail';
import AuthorDetail from '../pages/user/authors/AuthorDetail';
import Authors from '../pages/user/authors/Authors';
import { VouchersPublic } from '../pages/user/vouchers/VouchersPublic';
import Promotions from '../pages/user/promotions/Promotions';
import Bestsellers from '../pages/user/bestsellers/Bestsellers';
import NewArrivals from '../pages/user/new-arrivals/NewArrivals';
import Rewards from '../pages/user/rewards/Rewards';
import TermsOfService from '../pages/user/auth/TermsOfService';
import PrivacyPolicy from '../pages/user/auth/PrivacyPolicy'
import NotFoundPage from '../pages/user/NotFoundPage';

// Protected User Pages
import Profile from '../pages/user/profile/Profile';
import Checkout from '../pages/user/checkout/Checkout';
import Cart from '../pages/user/cart/Cart';
import { Orders, OrderDetail } from '../pages/user/orders';
import Points from '../pages/user/points/Points';
import Wishlist from '../pages/user/wishlist/Wishlist';
import ViewHistory from '../pages/user/view-history/ViewHistory';
import { Vouchers } from '../pages/user/vouchers';
import { Notifications } from '../pages/user/notifications';
import { UserStatistics } from '../pages/user/statistics';
import { PaymentResult } from '../pages/user/checkout';
import Review from '../pages/user/reviews/Reviews';
import OrderReviewList from '../pages/user/reviews/OrderReviewList';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminBooksList from '../pages/admin/books/AdminBooksList';
import AdminBookForm from '../pages/admin/books/AdminBookForm';
import AdminCategoriesList from '../pages/admin/categories/AdminCategoriesList';
import AdminAuthors from '../pages/admin/authors/AdminAuthors';
import AdminUsers from '../pages/admin/users/AdminUsers';
import AdminVouchers from '../pages/admin/vouchers/AdminVouchers';
import AdminRewards from '../pages/admin/rewards/AdminRewards';
import AdminOrders from '../pages/admin/orders/AdminOrders';
import AdminReviews from '../pages/admin/reviews/AdminReviews';
import AdminQuestions from '../pages/admin/questions/AdminQuestions';
import AdminReports from '../pages/admin/reports/AdminReports';

export const Router = () => {
    return (
        <Routes>
            {/* ==================== AUTH ROUTES ==================== */}
            {/* Admin Login - Standalone route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* User Auth Routes */}
            <Route element={<AuthLayout />}>
                <Route element={<AuthRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* ==================== EMAIL VERIFICATION ==================== */}
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verify-email-change" element={<VerifyEmailChange />} />

            {/* ==================== USER ROUTES ==================== */}
            <Route element={<MainLayout />}>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/books" element={<Books />} />
                <Route path="/books/:slug" element={<BookDetail />} />
                <Route path="/search" element={<SearchBooks />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/:slug" element={<CategoryDetail />} />
                <Route path="/authors" element={<Authors />} />
                <Route path="/authors/:id" element={<AuthorDetail />} />
                <Route path="/vouchers-public" element={<VouchersPublic />} />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/bestsellers" element={<Bestsellers />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/rewards" element={<Rewards />} />


                {/* Protected User Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:orderCode" element={<OrderDetail />} />
                    <Route path="/orders/:orderCode/review" element={<OrderReviewList />} /> {/* NEW */}
                    <Route path="/points" element={<Points />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/view-history" element={<ViewHistory />} />
                    <Route path="/vouchers" element={<Vouchers />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/statistics" element={<UserStatistics />} />
                    <Route path="/payment-result" element={<PaymentResult />} />
                    <Route path="/review/create" element={<Review />} />
                </Route>
            </Route>

            {/* Terms & Privacy */}
            <Route path='/terms' element={<TermsOfService />} />
            <Route path='/privacy' element={<PrivacyPolicy />} />

            {/* ==================== ADMIN ROUTES ==================== */}
            <Route path="/admin" element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />

                    {/* Books Management */}
                    <Route path="books" element={<AdminBooksList />} />
                    <Route path="books/create" element={<AdminBookForm />} />
                    <Route path="books/edit/:id" element={<AdminBookForm />} />

                    {/* Categories Management */}
                    <Route path="categories" element={<AdminCategoriesList />} />

                    {/* Authors Management */}
                    <Route path="authors" element={<AdminAuthors />} />

                    {/* Users Management */}
                    <Route path="users" element={<AdminUsers />} />

                    {/* Vouchers Management */}
                    <Route path="vouchers" element={<AdminVouchers />} />

                    {/* Rewards Management */}
                    <Route path="rewards" element={<AdminRewards />} />

                    {/* Orders Management */}
                    <Route path="orders" element={<AdminOrders />} />

                    {/* Reviews Management */}
                    <Route path="reviews" element={<AdminReviews />} />

                    {/* Questions Management */}
                    <Route path="questions" element={<AdminQuestions />} />

                    {/* Reports & Analytics */}
                    <Route path="reports" element={<AdminReports />} />
                </Route>
            </Route>

            {/* 404 - Must be last */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};