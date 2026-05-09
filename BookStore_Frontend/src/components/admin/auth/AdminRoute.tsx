import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { multiAccountManager } from '../../../services/multiAccountManager';

export default function AdminRoute() {
    const location = useLocation();
    const account = multiAccountManager.getActiveAccount();

    // Not authenticated → redirect to admin login
    if (!account) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Not admin → redirect to home
    if (account.role !== 'ADMIN') {
        return (
            <Navigate
                to="/"
                state={{
                    error: 'Access denied. Administrator privileges required.',
                    from: location
                }}
                replace
            />
        );
    }

    // Admin authenticated → allow access
    return <Outlet />;
}