import { Outlet } from 'react-router-dom';
import { AuthHeader } from '../layouts/AuthHeader';
import { Footer } from './Footer';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
            <AuthHeader />

            
            <main className="flex-1 pt-10">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default AuthLayout;