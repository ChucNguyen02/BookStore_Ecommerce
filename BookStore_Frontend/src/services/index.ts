import addressService from './address.service';
import aiService from './ai.service';
import apiClient from './api.client';
import authService from './auth.service';
import authorService from './author.service';
import bookService from './book.service';
import cartService from './cart.service';
import categoryService from './category.service';
import fileUploadService from './file_upload.service';
import notificationService from './notification.service';
import orderService from './order.service';
import pointsService from './points.service';
import questionService from './question.service';
import reviewService from './review.service';
import rewardService from './reward.service';
import statisticsService from './statistics.service';
import userService from './user.service';
import viewHistoryService from './view_history.service';
import voucherService from './voucher.service';
import wishlistService from './wishlist.service';

import userStatisticsService from './user_statistics.service';

// Admin services
import adminOrderService from './admin_order.service';
import adminRewardService from './admin_reward.service';
import adminVoucherService from './admin_voucher.service';
import adminPointsService from './admin_points.service';
import adminUserPointsService from './admin_user_points.service';
import adminUserService from './admin_user.service';
import adminWishlistService from './admin_wishlist.service';
import orderItemService from './order_item.service';
import paymentService from './payment.service';


import multiAccountManager from './multiAccountManager';

// Re-exports
export { apiClient } from './api.client';
export { addressService } from './address.service';
export { aiService } from './ai.service';
export { authService } from './auth.service';
export { authorService } from './author.service';
export { bookService } from './book.service';
export { cartService } from './cart.service';
export { categoryService } from './category.service';
export { fileUploadService } from './file_upload.service';
export { notificationService } from './notification.service';
export { orderService } from './order.service';
export { pointsService } from './points.service';
export { questionService } from './question.service';
export { reviewService } from './review.service';
export { rewardService } from './reward.service';
export { statisticsService } from './statistics.service';
export { userService } from './user.service';
export { viewHistoryService } from './view_history.service';
export { voucherService } from './voucher.service';
export { wishlistService } from './wishlist.service';
export { adminOrderService } from './admin_order.service';
export { adminRewardService } from './admin_reward.service';
export { adminVoucherService } from './admin_voucher.service';
export { adminPointsService } from './admin_points.service';
export { adminUserPointsService } from './admin_user_points.service';
export { adminUserService } from './admin_user.service';
export { adminWishlistService } from './admin_wishlist.service';
export { orderItemService } from './order_item.service';
export { paymentService } from './payment.service';

export { userStatisticsService } from './user_statistics.service';

export { multiAccountManager } from './multiAccountManager';

export const api = {
  api: apiClient,
  address: addressService,
  ai: aiService,
  auth: authService,
  author: authorService,
  book: bookService,
  cart: cartService,
  category: categoryService,
  fileUpload: fileUploadService,
  notification: notificationService,
  order: orderService,
  points: pointsService,
  question: questionService,
  review: reviewService,
  reward: rewardService,
  statistics: statisticsService,
  user: userService,
  viewHistory: viewHistoryService,
  voucher: voucherService,
  wishlist: wishlistService,
  adminOrder: adminOrderService,
  adminReward: adminRewardService,
  adminVoucher: adminVoucherService,
  adminPoints: adminPointsService,
  adminUserPoints: adminUserPointsService,
  adminUser: adminUserService,
  adminWishlist: adminWishlistService,
  orderItem: orderItemService,
  payment: paymentService,
  userStatistics: userStatisticsService,
  multiAccountManager: multiAccountManager,
} as const;