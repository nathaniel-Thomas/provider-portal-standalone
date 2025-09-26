import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        available: [
          "bg-primary/10 text-primary border-primary/20",
          "status-available"
        ],
        scheduled: [
          "bg-warning-yellow/10 text-warning-yellow border-warning-yellow/20",
          "status-scheduled"
        ],
        "in-progress": [
          "bg-warning-orange/10 text-warning-orange border-warning-orange/20",
          "status-in-progress"
        ],
        completed: [
          "bg-success-green/10 text-success-green border-success-green/20",
          "status-completed"
        ],
        pending: [
          "bg-muted text-muted-foreground border-border"
        ],
        error: [
          "bg-destructive/10 text-destructive border-destructive/20"
        ],
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "available",
      size: "default",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  icon?: React.ReactNode
  pulse?: boolean
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, variant, size, icon, pulse, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          statusBadgeVariants({ variant, size }),
          pulse && "animate-pulse",
          className
        )}
        role="status"
        aria-label={typeof children === 'string' ? children : undefined}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </div>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge, statusBadgeVariants }