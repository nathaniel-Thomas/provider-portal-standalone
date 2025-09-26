import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ 
  placeholder = "Search bookings...", 
  onSearch 
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div 
      className="mt-4 mb-6 h-12 bg-card rounded-xl flex items-center px-4 gap-3 hover-elevate cursor-pointer"
      data-testid="search-bookings"
      onClick={() => document.getElementById('search-input')?.focus()}
    >
      <Search className="h-5 w-5 text-muted-foreground" />
      {query ? (
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white focus:outline-none"
          placeholder={placeholder}
          data-testid="input-search"
        />
      ) : (
        <p className="text-sm text-muted-foreground" onClick={() => document.getElementById('search-input')?.focus()}>
          {placeholder}
        </p>
      )}
    </div>
  );
}