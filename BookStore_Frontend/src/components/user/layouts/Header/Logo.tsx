import { memo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

interface LogoProps {
    knowledge: string;
}

export const Logo = memo(({ knowledge }: LogoProps) => (
    <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
        <BookOpen className="w-10 h-10 text-amber-600 dark:text-amber-500 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-all group-hover:rotate-12" />
        <div>
            <span className="text-3xl font-serif font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 dark:from-amber-500 dark:via-orange-500 dark:to-amber-500 bg-clip-text text-transparent">
                BookStore
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">{knowledge}</p>
        </div>
    </Link>
));

Logo.displayName = 'Logo';