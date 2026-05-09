const fs = require('fs');

function replaceInFile(filePath, searchRegex, replaceStr) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(searchRegex, replaceStr);
    fs.writeFileSync(filePath, content, 'utf8');
}

// 1
replaceInFile('src/components/admin/rewards/RewardFormModal.tsx', 
    /import \{ Upload, X, Plus \} from 'lucide-react';/, 
    "import { X, Plus } from 'lucide-react';");

// 2, 3, 4
replaceInFile('src/components/admin/users/UserDetailModal.tsx', 
    /import \{ User as UserIcon, Mail, Phone, Calendar, MapPin, Shield \} from 'lucide-react';/, 
    "import { Mail, Phone, MapPin } from 'lucide-react';");

// 5
replaceInFile('src/components/user/books/AnswerForm.tsx', 
    /export const AnswerForm = \(\{ _questionId, onSubmit, onCancel, submitting \}: AnswerFormProps\) => \{/, 
    "export const AnswerForm = ({ onSubmit, onCancel, submitting }: AnswerFormProps) => {");

// 6, 7
replaceInFile('src/components/user/books/ReviewForm.tsx', 
    /bookId,\s*orderId,\s*existingReview,/g, 
    "existingReview,");

// 8
replaceInFile('src/components/user/categories/CategoryFilters.tsx', 
    /import \{ Link \} from 'react-router-dom';/, 
    "");

// 9
replaceInFile('src/components/user/common/SearchWithSuggestions.tsx', 
    /closeSearch\(\);/g, 
    "closeSearch(false);");

// 10
replaceInFile('src/components/user/layouts/Header/Header.tsx', 
    /setIsSearchOpen\(\);/g, 
    "setIsSearchOpen(false);");

// 11
replaceInFile('src/components/user/layouts/Header/Logo.tsx', 
    /import React, \{ memo \} from 'react';/, 
    "import { memo } from 'react';");

// 12
replaceInFile('src/components/user/layouts/MainLayout.tsx', 
    /const _handleLogout = async \(\) => \{[\s\S]*?\n    \};\n/g, 
    "");
replaceInFile('src/components/user/layouts/MainLayout.tsx', 
    /const \{ logout \} = useAuth\(\);/g, 
    "");
replaceInFile('src/components/user/layouts/MainLayout.tsx', 
    /const navigate = useNavigate\(\);/g, 
    "");

// 13
replaceInFile('src/components/user/orders/PaymentMethodBadge.tsx', 
    /export const PaymentMethodBadge = \(\{ method, size = 'md' \}: PaymentMethodBadgeProps\) => \{const \{ t \} = useTranslation\(\);/, 
    "export const PaymentMethodBadge = ({ method, size = 'md' }: PaymentMethodBadgeProps) => {const { t } = useTranslation();\nif ((method as any) === 'LOCAL') return null;");

// 14
replaceInFile('src/components/user/points/RewardsShop.tsx', 
    /import \{ Gift, Star, Clock, Package \} from 'lucide-react';/, 
    "import { Gift, Star, Clock } from 'lucide-react';");
replaceInFile('src/components/user/points/RewardsShop.tsx', 
    /onConfirm=\{redeemReward\}/, 
    "onConfirm={async (id, addr, note) => { await redeemReward(id, addr, note); }}");

console.log("Done");
