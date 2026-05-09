import { memo } from 'react';
import { SearchWithSuggestions } from '../../common/SearchWithSuggestions';

interface SearchBarProps {
    placeholder: string;
}

export const SearchBar = memo(({ placeholder }: SearchBarProps) => (
    <div className="hidden lg:flex flex-1 max-w-2xl">
        <SearchWithSuggestions placeholder={placeholder} />
    </div>
));

SearchBar.displayName = 'SearchBar';