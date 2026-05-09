import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { useState } from 'react';

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <AdminHeader 
                sidebarOpen={sidebarOpen} 
                setSidebarOpen={setSidebarOpen} 
            />
            
            <div className="flex">
                <AdminSidebar isOpen={sidebarOpen} />
                
                <main 
                    className={`flex-1 min-w-0 transition-all duration-300 ${
                        sidebarOpen ? 'lg:pl-64' : 'pl-0'
                    } pt-16`}
                >
                    <div className="p-4 sm:p-6 lg:p-8">
                        {/* Content wrapper với subtle shadow */}
                        <div className="animate-fadeIn">
                            <Outlet />
                        </div>
                    </div>

                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden animate-fadeIn"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}