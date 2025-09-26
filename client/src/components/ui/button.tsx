import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
  " hover-elevate active-elevate-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary-border rounded-lg shadow-sm hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive-border rounded-lg shadow-sm hover:shadow-md",
        outline:
          "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground rounded-lg shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground border border-secondary-border rounded-lg shadow-sm hover:shadow-md",
        ghost:
          "border border-transparent hover:bg-accent hover:text-accent-foreground rounded-lg",
        success:
          "bg-success-green text-white border border-success-green/20 rounded-lg shadow-sm hover:shadow-md",
        warning:
          "bg-warning-orange text-white border border-warning-orange/20 rounded-lg shadow-sm hover:shadow-md",
      },
      size: {
        default: "min-h-10 px-4 py-2",
        sm: "min-h-8 px-3 text-xs",
        lg: "min-h-12 px-6 text-base",
        icon: "h-10 w-10",
        touch: "min-h-44 px-6", // Accessible touch target
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
