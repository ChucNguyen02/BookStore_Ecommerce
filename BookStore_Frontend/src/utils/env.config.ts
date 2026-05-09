export const env = {
  // API
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,

  // App
  APP_NAME: import.meta.env.VITE_APP_NAME || 'BookStore',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // Pagination
  DEFAULT_PAGE_SIZE: Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 20,
  MAX_PAGE_SIZE: Number(import.meta.env.VITE_MAX_PAGE_SIZE) || 100,

  // File Upload
  MAX_FILE_SIZE: Number(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760,
  ALLOWED_IMAGE_TYPES: (import.meta.env.VITE_ALLOWED_IMAGE_TYPES || 'image/jpeg,image/jpg,image/png,image/gif,image/webp').split(','),
  MAX_IMAGES_PER_UPLOAD: Number(import.meta.env.VITE_MAX_IMAGES_PER_UPLOAD) || 5,

  // Cart & Order
  MAX_CART_ITEMS: Number(import.meta.env.VITE_MAX_CART_ITEMS) || 99,
  FREE_SHIPPING_THRESHOLD: Number(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD) || 200000,
  DEFAULT_SHIPPING_FEE: Number(import.meta.env.VITE_DEFAULT_SHIPPING_FEE) || 30000,

  // Points System
  DAILY_CHECKIN_POINTS: Number(import.meta.env.VITE_DAILY_CHECKIN_POINTS) || 10,
  POINTS_TO_VND_RATE: Number(import.meta.env.VITE_POINTS_TO_VND_RATE) || 10,

  // Social Auth
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',

  // Payment Gateway
  VNPAY_RETURN_URL: import.meta.env.VITE_VNPAY_RETURN_URL || 'http://localhost:5173/payment/vnpay/return',
  MOMO_RETURN_URL: import.meta.env.VITE_MOMO_RETURN_URL || 'http://localhost:5173/payment/momo/return',

  // Analytics
  GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID || '',
  FB_PIXEL_ID: import.meta.env.VITE_FB_PIXEL_ID || '',

  // SEO
  SITE_URL: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
  SITE_TITLE: import.meta.env.VITE_SITE_TITLE || 'BookStore - Your Online Bookstore',
  SITE_DESCRIPTION: import.meta.env.VITE_SITE_DESCRIPTION || 'Buy books online with great deals and fast delivery',

  // Feature Flags
  ENABLE_SOCIAL_LOGIN: import.meta.env.VITE_ENABLE_SOCIAL_LOGIN === 'true',
  ENABLE_POINTS_SYSTEM: import.meta.env.VITE_ENABLE_POINTS_SYSTEM === 'true',
  ENABLE_REWARDS: import.meta.env.VITE_ENABLE_REWARDS === 'true',
  ENABLE_REVIEWS: import.meta.env.VITE_ENABLE_REVIEWS === 'true',
  ENABLE_QUESTIONS: import.meta.env.VITE_ENABLE_QUESTIONS === 'true',
  ENABLE_WISHLIST: import.meta.env.VITE_ENABLE_WISHLIST === 'true',
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  ENABLE_LOCAL_PAYMENT: import.meta.env.VITE_ENABLE_LOCAL_PAYMENT === 'true',

  // Debug
  ENABLE_LOGS: import.meta.env.VITE_ENABLE_LOGS === 'true',
  ENABLE_REDUX_DEVTOOLS: import.meta.env.VITE_ENABLE_REDUX_DEVTOOLS === 'true',

  // Cache
  CACHE_DURATION: Number(import.meta.env.VITE_CACHE_DURATION) || 300000,
  ENABLE_SERVICE_WORKER: import.meta.env.VITE_ENABLE_SERVICE_WORKER === 'true',

  // Helper methods
  isDevelopment: () => import.meta.env.DEV,
  isProduction: () => import.meta.env.PROD,
} as const;

export default env;