const fs = require('fs');

function replaceInFileRegex(filePath, searchRegex, replaceStr) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(searchRegex, replaceStr);
    fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFileRegex('src/components/admin/rewards/RewardFormModal.tsx', /import { Upload, X, Plus } from 'lucide-react';/, "import { X, Plus } from 'lucide-react';");

replaceInFileRegex('src/components/admin/users/UserDetailModal.tsx', /import { User as UserIcon, Mail, Phone, Calendar, MapPin, Shield } from 'lucide-react';/, "import { Mail, Phone, MapPin } from 'lucide-react';");

replaceInFileRegex('src/components/user/books/AnswerForm.tsx', /export const AnswerForm = \(\{ questionId, onSubmit, onCancel, submitting \}: AnswerFormProps\) => \{/, "export const AnswerForm = ({ _questionId, onSubmit, onCancel, submitting }: AnswerFormProps) => {");

replaceInFileRegex('src/components/user/books/ReviewForm.tsx', /export const ReviewForm = \(\{ bookId, orderId, onSubmit, onCancel, isSubmitting \}: ReviewFormProps\) => \{/, "export const ReviewForm = ({ _bookId, _orderId, onSubmit, onCancel, isSubmitting }: ReviewFormProps) => {");

replaceInFileRegex('src/components/user/categories/CategoryFilters.tsx', /import { Link, useSearchParams } from 'react-router-dom';/, "import { useSearchParams } from 'react-router-dom';");

replaceInFileRegex('src/components/user/common/SearchWithSuggestions.tsx', /closeSearch\(\);/, "closeSearch(false);");

replaceInFileRegex('src/components/user/layouts/Header/Header.tsx', /setIsSearchOpen\(\);/, "setIsSearchOpen(false);");

replaceInFileRegex('src/components/user/layouts/Header/Logo.tsx', /import React from 'react';/, "");

replaceInFileRegex('src/components/user/layouts/MainLayout.tsx', /const _handleLogout = async \(\) => \{[\s\S]*?toast\.error\('Failed to logout'\);\n        }\n    };\n/m, "");

replaceInFileRegex('src/components/user/orders/PaymentMethodBadge.tsx', /export const PaymentMethodBadge = \(\{ method \}: PaymentMethodBadgeProps\) => \{/, "export const PaymentMethodBadge = ({ method }: PaymentMethodBadgeProps) => { if (method === 'LOCAL' as any) return null;");

replaceInFileRegex('src/components/user/points/RewardsShop.tsx', /import { Gift, Star, Clock, Package } from 'lucide-react';/, "import { Gift, Star, Clock } from 'lucide-react';");
replaceInFileRegex('src/components/user/points/RewardsShop.tsx', /onRedeem: \(rewardId: string, shippingAddress\?: string, note\?: string\) => Promise<boolean>;/, "onRedeem: (rewardId: string, shippingAddress?: string, note?: string) => Promise<any>;");

