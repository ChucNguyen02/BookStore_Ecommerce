import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/user/useAuth';

/**
 * ProtectedRoute - Require authentication for user routes
 * Redirects unauthenticated users to login
 * Redirects admin users to admin dashboard
 */
export default function ProtectedRoute() {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    // Not authenticated - redirect to login with return URL
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Admin trying to access user routes - redirect to admin dashboard
    if (user.role === 'ADMIN') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Authenticated regular user - allow access
    return <Outlet />;
}