import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './context/AppContext';
import { CartWishlistProvider } from './context/CartWishlistProvider';
import { AdminProvider } from './context/AdminContext';
import { ThemeProvider } from './context/ThemeProvider';
import { AuthProvider } from './context/AuthProvider'; // THÊM IMPORT
import './i18n';
import './index.css';
import App from './App';
import env from './utils/env.config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID || ''}>
          <AuthProvider>
            <AppProvider>
              <AdminProvider>
                <CartWishlistProvider>
                  <App />
                </CartWishlistProvider>
              </AdminProvider>
            </AppProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);