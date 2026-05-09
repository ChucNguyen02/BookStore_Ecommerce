import { Outlet } from 'react-router-dom';
import { Header } from "./Header/Header";
import { Footer } from "./Footer";

import AiChatWidget from '../common/AiChatWidget';

const MainLayout = () => {

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
            <Header
            />

            <main className="flex-1 pt-[180px]">
                <Outlet />
            </main>

            <Footer />
            <AiChatWidget />
        </div>
    );
};

export default MainLayout;