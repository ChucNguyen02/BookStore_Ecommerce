import { Link } from 'react-router-dom';
import { Book, Calendar, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AuthorResponse } from '../../../types/author.types';

interface AuthorCardProps {
  author: AuthorResponse;
  index: number;
}

export const AuthorCard = ({ author, index }: AuthorCardProps) => {
  const { t } = useTranslation();
  const prefix = 'AuthorCard';

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
    }).format(date);
  };

  return (
    <Link
      to={`/authors/${author.id}`}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden stagger-item border border-transparent hover:border-amber-500 dark:hover:border-amber-400"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Avatar Section */}
      <div className="relative h-48 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center">
        {author.avatarUrl ? (
          <img
            src={author.avatarUrl}
            alt={author.name}
            className="w-32 h-32 rounded-full object-cover ring-4 ring-white dark:ring-gray-800 shadow-xl group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-5xl font-bold ring-4 ring-white dark:ring-gray-800 shadow-xl group-hover:scale-110 transition-transform duration-500">
            {author.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Name */}
        <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 text-center">
          {author.name}
        </h3>

        {/* Stats */}
        <div className="space-y-2 mb-4">
          {author.bookCount !== null && (
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <Book className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span className="font-medium">
                {author.bookCount} {t(`${prefix}.books`)}
              </span>
            </div>
          )}

          {author.nationality && (
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <Globe className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              <span>{author.nationality}</span>
            </div>
          )}

          {author.birthDate && (
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <span>
                {t(`${prefix}.birthYear`)}: {formatDate(author.birthDate)}
              </span>
            </div>
          )}
        </div>

        {/* Bio Preview */}
        {author.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center line-clamp-3 leading-relaxed">
            {author.bio}
          </p>
        )}
      </div>
    </Link>
  );
};