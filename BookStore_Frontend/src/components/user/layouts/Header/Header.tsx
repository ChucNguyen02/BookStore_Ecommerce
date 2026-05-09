import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../../../hooks/user/useCart";
import { useWishlist } from "../../../../hooks/user/useWishlist";
import { useNotifications } from "../../../../hooks/user/useNotifications";
import { useAuth } from "../../../../hooks/user/useAuth";
import { eventEmitter, EVENTS } from "../../../../utils/eventEmitter";

import { TopBar } from "./TopBar";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { UserActions } from "./UserActions";
import { GuestActions } from "./GuestActions";
import { MainNavigation } from "./MainNavigation";
import { CompactNavigation } from "./CompactNavigation";

export const Header = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    // Auth hook
    const { user: currentUser, logout: logoutUser } = useAuth();

    // Cart, Wishlist, Notifications hooks
    const { cart, refreshCart } = useCart();
    const { 
        totalElements: wishlistCount, 
        refreshWishlist 
    } = useWishlist();
    const { summary: notificationSummary, refetch: refetchNotifications } = useNotifications();

    // Local states
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showCompactNav, setShowCompactNav] = useState(false);

    const scrollTimeoutRef = useRef<NodeJS.Timeout>();

    const navigationItems = useMemo(
        () => [
            { path: "/", label: t('Header.home') },
            { path: "/books", label: t('Header.allBooks') },
            { path: "/categories", label: t('Header.categories') },
            { path: "/promotions", label: t('Header.promotions') },
            { path: "/bestsellers", label: t('Header.bestSellers') },
            { path: "/new-arrivals", label: t('Header.newArrivals') },
        ],
        [t]
    );

    const cartCount = useMemo(() => cart?.items?.length || 0, [cart?.items?.length]);
    const displayWishlistCount = useMemo(() => wishlistCount || 0, [wishlistCount]);
    const notificationCount = useMemo(() => notificationSummary?.unreadCount || 0, [notificationSummary?.unreadCount]);

    // Event listeners for real-time updates
    useEffect(() => {
        const handleCartUpdate = () => refreshCart();
        eventEmitter.on(EVENTS.CART_UPDATED, handleCartUpdate);
        return () => eventEmitter.off(EVENTS.CART_UPDATED, handleCartUpdate);
    }, [refreshCart]);

    useEffect(() => {
        const handleWishlistUpdate = () => {
            if (typeof refreshWishlist === 'function') {
                refreshWishlist();
            }
        };
        eventEmitter.on(EVENTS.WISHLIST_UPDATED, handleWishlistUpdate);
        return () => eventEmitter.off(EVENTS.WISHLIST_UPDATED, handleWishlistUpdate);
    }, [refreshWishlist]);

    useEffect(() => {
        const handleNotificationUpdate = () => refetchNotifications();
        eventEmitter.on(EVENTS.NOTIFICATION_UPDATED, handleNotificationUpdate);
        return () => eventEmitter.off(EVENTS.NOTIFICATION_UPDATED, handleNotificationUpdate);
    }, [refetchNotifications]);

    // Scroll handling
    useEffect(() => {
        const handleScroll = () => {
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

            scrollTimeoutRef.current = setTimeout(() => {
                const scrollY = window.scrollY;
                setIsScrolled(scrollY > 20);
                setShowCompactNav(scrollY > 100);
            }, 50);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, []);

    const handleToggleMenu = useCallback(() => {
        setIsMenuOpen((prev) => !prev);
    }, []);

    const handleLogout = useCallback(async () => {
        const success = await logoutUser();
        if (success) {
            navigate("/login");
        }
    }, [logoutUser, navigate]);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg"
                    : "bg-white dark:bg-gray-900 shadow-md"
            }`}
        >
            <TopBar/>

            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20 gap-4">
                    <Logo knowledge={t('Header.knowledge')} />

                    <SearchBar
                        placeholder={t('Header.searchPlaceholder')}
                    />

                    <div className="hidden md:flex items-center gap-2">
                        {currentUser ? (
                            <UserActions
                                currentUser={currentUser}
                                cartCount={cartCount}
                                wishlistCount={displayWishlistCount}
                                notificationCount={notificationCount}
                                onLogout={handleLogout}
                            />
                        ) : (
                            <GuestActions/>
                        )}
                    </div>

                    <button
                        onClick={handleToggleMenu}
                        className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {!isScrolled && (
                    <MainNavigation
                        navigationItems={navigationItems}
                        currentPath={location.pathname}
                    />
                )}
            </div>

            {isScrolled && showCompactNav && (
                <CompactNavigation
                    navigationItems={navigationItems}
                    currentPath={location.pathname}
                />
            )}
        </header>
    );
};