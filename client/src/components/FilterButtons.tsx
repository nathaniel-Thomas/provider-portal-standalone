import { useState } from 'react';

interface FilterButtonsProps {
  filters?: { id: string; label: string; count?: number }[];
  onFilterChange?: (filterId: string) => void;
  defaultFilter?: string;
}

export default function FilterButtons({
  filters = [
    { id: 'available', label: 'Available' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'completed', label: 'Completed' }
  ],
  onFilterChange,
  defaultFilter = 'available'
}: FilterButtonsProps) {
  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);

  const handleFilterClick = (filterId: string) => {
    setSelectedFilter(filterId);
    onFilterChange?.(filterId);
    // Filter change handled by parent component
  };

  return (
    <div className="bg-card border border-card-border p-3 rounded-lg" data-testid="filter-buttons">
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-2"
        role="tablist"
        aria-label="Job status filters"
      >
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => handleFilterClick(filter.id)}
            className={`filter-btn rounded-lg text-sm font-medium px-3 py-3 min-h-44 relative transition-all duration-200 text-center flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              selectedFilter === filter.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground'
            }`}
            data-testid={`button-filter-${filter.id}`}
            role="tab"
            aria-selected={selectedFilter === filter.id}
            aria-controls={`panel-${filter.id}`}
            aria-label={filter.count ? `${filter.label}: ${filter.count} jobs` : `${filter.label} jobs`}
          >
            <span className="flex items-center gap-2">
              {filter.label}
              {filter.count && (
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white text-xs font-bold"
                  aria-label={`${filter.count} new`}
                >
                  {filter.count}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}