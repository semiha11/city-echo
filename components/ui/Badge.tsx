import * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = {
    default: "bg-primary hover:bg-primary/80 border-transparent text-primary-foreground",
    secondary: "bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground",
    destructive:
        "bg-destructive hover:bg-destructive/80 border-transparent text-destructive-foreground",
    outline: "text-foreground",
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants = {
        default: "bg-rose-500 text-white shadow hover:bg-rose-600/80",
        secondary: "bg-rose-100 text-rose-900 hover:bg-rose-100/80",
        destructive: "bg-red-500 text-white shadow hover:bg-red-600/80",
        outline: "text-gray-900 border border-gray-200",
    }

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        />
    )
}

export { Badge }
