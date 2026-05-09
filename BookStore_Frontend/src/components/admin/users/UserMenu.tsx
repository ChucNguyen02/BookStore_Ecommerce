import { useState, useEffect, useRef } from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';
import type { User } from '../../../types/user.types';

interface UserMenuProps {
    user: User | null;
}

export default function UserMenu({ user }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAdmin();
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 pl-4 border-l border-gray-300 dark:border-gray-600 hover-scale transition-smooth"
            >
                <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user.fullName}
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                        Administrator
                    </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold hover-lift">
                    {user.fullName.charAt(0).toUpperCase()}
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 card animate-scaleIn z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {user.fullName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                        </p>
                    </div>

                    <div className="p-2">
                        <button
                            onClick={() => {
                                navigate('/admin/profile');
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-smooth text-left hover-lift"
                        >
                            <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Profile
                            </span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-smooth text-left text-red-600 dark:text-red-400 hover-lift"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}