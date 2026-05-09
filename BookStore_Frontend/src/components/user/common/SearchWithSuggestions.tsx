import { useTranslation } from 'react-i18next';import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, BookOpen, User, Tag, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearchBooks } from '../../../hooks/user/useBooks';
import { useAppContext } from '../../../context/AppContext';
import type { BookResponse } from '../../../types/book.types';

interface SearchWithSuggestionsProps {
  placeholder?: string;
}

interface SearchResult {
  type: 'book' | 'author' | 'category' | 'isbn';
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  slug?: string;
}

export const SearchWithSuggestions = ({ placeholder }: SearchWithSuggestionsProps) => {const { t } = useTranslation();
  const { language } = useAppContext();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<any>(null);

  // Sử dụng hook để search
  const { data: searchData, isLoading } = useSearchBooks(debouncedQuery, 0, 10);

  const fuzzyMatch = (text: string, query: string): boolean => {
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();

    // 1. Exact substring match
    if (textLower.includes(queryLower)) {
      return true;
    }

    // 2. Match từng từ (word-by-word matching)
    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 0);
    const textWords = textLower.split(/\s+/);

    return queryWords.every((queryWord) =>
    textWords.some((textWord) => textWord.includes(queryWord))
    );
  };

  // Debounce query
  useEffect(() => {
    if (query.trim().length < 2) {
      setDebouncedQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  // Process search results
  useEffect(() => {
    if (!searchData?.content) {
      setSuggestions([]);
      return;
    }

    const results: SearchResult[] = [];
    const booksByTitle = new Set<string>();
    const authors = new Set<string>();
    const categories = new Set<string>();
    const isbns = new Set<string>();

    searchData.content.forEach((book: BookResponse) => {
      // Books by title
      if (fuzzyMatch(book.title, debouncedQuery)) {
        if (!booksByTitle.has(book.id)) {
          booksByTitle.add(book.id);
          results.push({
            type: 'book',
            id: book.id,
            title: book.title,
            subtitle: book.authors.map((a) => a.name).join(', '),
            image: book.coverImageUrl || undefined,
            slug: book.slug
          });
        }
      }

      // Authors
      book.authors.forEach((author) => {
        if (fuzzyMatch(author.name, debouncedQuery)) {
          if (!authors.has(author.id)) {
            authors.add(author.id);
            results.push({
              type: 'author',
              id: author.id,
              title: author.name,
              subtitle: `${language === 'vi' ? t("Common.tacGia") : 'Author'}`,
              image: author.avatarUrl || undefined
            });
          }
        }
      });

      // Categories
      if (fuzzyMatch(book.categoryName, debouncedQuery)) {
        if (!categories.has(book.categoryId.toString())) {
          categories.add(book.categoryId.toString());
          results.push({
            type: 'category',
            id: book.categoryId.toString(),
            title: book.categoryName,
            subtitle: `${language === 'vi' ? t("Common.theLoai") : 'Category'}`
          });
        }
      }

      // ISBN
      if (book.isbn && fuzzyMatch(book.isbn, debouncedQuery)) {
        if (!isbns.has(book.isbn)) {
          isbns.add(book.isbn);
          results.push({
            type: 'isbn',
            id: book.id,
            title: book.title,
            subtitle: `ISBN: ${book.isbn}`,
            image: book.coverImageUrl || undefined,
            slug: book.slug
          });
        }
      }
    });

    // Sort by priority
    results.sort((a, b) => {
      const order = { book: 1, author: 2, category: 3, isbn: 4 };
      return order[a.type] - order[b.type];
    });

    setSuggestions(results.slice(0, 8));
    setShowSuggestions(true);
  }, [searchData, debouncedQuery, language]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleSelectSuggestion = (suggestion: SearchResult) => {
    setShowSuggestions(false);
    setQuery('');

    switch (suggestion.type) {
      case 'book':
      case 'isbn':
        navigate(`/books/${suggestion.slug}`);
        break;
      case 'author':
        navigate(`/authors/${suggestion.id}`);
        break;
      case 'category':
        navigate(`/categories/${suggestion.id}`);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'book':
        return <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'author':
        return <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'category':
        return <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'isbn':
        return <Hash className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  const highlightMatch = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
                {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ?
        <mark key={i} className="bg-amber-200 dark:bg-amber-900/50 text-gray-900 dark:text-white">
                            {part}
                        </mark> :

        <span key={i}>{part}</span>

        )}
            </span>);

  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl">
            <form onSubmit={handleSearch}>
                <div className="relative">
                    <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 pr-24 rounded-full border-2 border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all outline-none" />
          

                    {/* Loading spinner */}
                    {isLoading &&
          <div className="absolute right-14 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                        </div>
          }

                    {/* Clear button */}
                    {query && !isLoading &&
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setDebouncedQuery('');
              setSuggestions([]);
              setShowSuggestions(false);
              inputRef.current?.focus();
            }}
            className="absolute right-14 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            
                            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
          }

                    {/* Search button */}
                    <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white p-2 rounded-full hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all">
            
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </form>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 &&
      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-[480px] overflow-y-auto">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                            {language === 'vi' ? t("Common.ketQuaTimKiem") : 'Search Results'}
                        </p>
                    </div>

                    {suggestions.map((suggestion, index) =>
        <button
          key={`${suggestion.type}-${suggestion.id}`}
          onClick={() => handleSelectSuggestion(suggestion)}
          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
          index === selectedIndex ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`
          }>
          
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                {getIcon(suggestion.type)}
                            </div>

                            {/* Image (if available) */}
                            {suggestion.image &&
          <img
            src={suggestion.image}
            alt={suggestion.title}
            className="w-10 h-10 object-cover rounded flex-shrink-0" />

          }

                            {/* Text */}
                            <div className="flex-1 text-left min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                    {highlightMatch(suggestion.title, query)}
                                </p>
                                {suggestion.subtitle &&
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {suggestion.subtitle}
                                    </p>
            }
                            </div>
                        </button>
        )}

                    {/* View all results */}
                    <button
          onClick={handleSearch}
          className="w-full px-4 py-3 text-center text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
          
                        {language === 'vi' ?
          `Xem tất cả kết quả cho "${query}"` :
          `View all results for "${query}"`
          }
                    </button>
                </div>
      }

            {/* No results */}
            {showSuggestions && !isLoading && debouncedQuery.length >= 2 && suggestions.length === 0 &&
      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    <div className="px-4 py-8 text-center">
                        <Search className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">
                            {language === 'vi' ? t("Common.khongTimThayKetQua") :

            'No results found'
            }
                        </p>
                    </div>
                </div>
      }
        </div>);

};