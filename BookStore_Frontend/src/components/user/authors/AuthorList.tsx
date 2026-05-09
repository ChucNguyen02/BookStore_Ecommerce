import { Link } from 'react-router-dom';
import { Book, Calendar, Globe, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AuthorResponse } from '../../../types/author.types';

interface AuthorListProps {
  author: AuthorResponse;
}

export const AuthorList = ({ author }: AuthorListProps) => {
  const { t } = useTranslation();
  const prefix = 'AuthorList';

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
    }).format(date);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="flex flex-col sm:flex-row items-stretch">
        {/* Avatar */}
        <Link to={`/authors/${author.id}`} className="flex-shrink-0">
          <div className="w-full sm:w-48 h-48 sm:h-full relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center">
            {author.avatarUrl ? (
              <img
                src={author.avatarUrl}
                alt={author.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-4xl font-bold">
                {author.name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-3">
            <div className="flex-1">
              <Link to={`/authors/${author.id}`}>
                <h3 className="font-serif font-bold text-2xl text-gray-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {author.name}
                </h3>
              </Link>
            </div>

            {/* Book Count Badge */}
            {author.bookCount !== null && author.bookCount > 0 && (
              <div className="px-4 py-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 font-bold rounded-full flex items-center gap-2 self-start">
                <Book className="w-4 h-4" />
                {author.bookCount}
              </div>
            )}
          </div>

          {/* Bio */}
          {author.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
              {author.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            {author.nationality && (
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Globe className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                <span>{author.nationality}</span>
              </div>
            )}

            {author.birthDate && (
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span>
                  {t(`${prefix}.birth`)} {formatDate(author.birthDate)}
                </span>
              </div>
            )}
          </div>

          {/* View Button */}
          <div className="mt-auto pt-4">
            <Link
              to={`/authors/${author.id}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all shadow-md hover:shadow-lg group"
            >
              <span>{t(`${prefix}.viewWorks`)}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};