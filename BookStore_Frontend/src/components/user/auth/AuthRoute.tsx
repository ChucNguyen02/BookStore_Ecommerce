import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../hooks/user/useAuth';

/**
 * AuthRoute - Prevent logged-in users from accessing login/register pages
 * Redirects authenticated users to appropriate dashboard
 */
export default function AuthRoute() {
    const { user, isAuthenticated } = useAuth();
    
    // If user is authenticated, redirect based on role
    if (isAuthenticated && user) {
        // Admin users go to admin dashboard
        if (user.role === 'ADMIN') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        
        // Regular users go to home page
        return <Navigate to="/" replace />;
    }

    // Not authenticated - allow access to auth pages (login/register)
    return <Outlet />;
}