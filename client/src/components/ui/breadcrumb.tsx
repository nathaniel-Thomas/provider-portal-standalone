import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  id: string
  label: string
  href?: string
  onClick?: () => void
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
  maxItems?: number
}

const Breadcrumb = React.forwardRef<HTMLNavElement, BreadcrumbProps>(
  ({ items, className, showHome = true, maxItems = 3, ...props }, ref) => {
    // Show only the last `maxItems` items plus home if needed
    const visibleItems = React.useMemo(() => {
      let processedItems = [...items]

      if (processedItems.length > maxItems) {
        processedItems = [
          ...processedItems.slice(0, 1), // Keep first item
          { id: 'ellipsis', label: '...' }, // Add ellipsis
          ...processedItems.slice(-maxItems + 1) // Keep last items
        ]
      }

      return processedItems
    }, [items, maxItems])

    if (items.length <= 1 && !showHome) return null

    return (
      <nav
        ref={ref}
        className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
        aria-label="Breadcrumb navigation"
        {...props}
      >
        {showHome && items.length > 0 && items[0].id !== 'home' && (
          <>
            <Home className="h-4 w-4" />
            <ChevronRight className="h-4 w-4" />
          </>
        )}

        {visibleItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {item.id === 'ellipsis' ? (
              <span className="px-2">...</span>
            ) : (
              <>
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className={cn(
                      "hover:text-foreground transition-colors",
                      index === visibleItems.length - 1 && "text-foreground font-medium"
                    )}
                    aria-current={index === visibleItems.length - 1 ? "page" : undefined}
                  >
                    {item.label}
                  </button>
                ) : (
                  <span
                    className={cn(
                      index === visibleItems.length - 1 && "text-foreground font-medium"
                    )}
                    aria-current={index === visibleItems.length - 1 ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </>
            )}

            {index < visibleItems.length - 1 && item.id !== 'ellipsis' && (
              <ChevronRight className="h-4 w-4" />
            )}
          </React.Fragment>
        ))}
      </nav>
    )
  }
)

Breadcrumb.displayName = "Breadcrumb"

export { Breadcrumb, type BreadcrumbItem }