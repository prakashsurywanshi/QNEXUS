import type { LucideIcon } from "lucide-react"
import * as React from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface WidgetRow {
  id: string | number
  title: React.ReactNode
  subtitle?: React.ReactNode
  meta?: React.ReactNode
  icon?: LucideIcon | null
  badge?: React.ReactNode
}

interface WidgetListProps {
  title: string
  icon?: LucideIcon | null
  rows: WidgetRow[]
  footer?: React.ReactNode
  emptyText?: string
  className?: string
  onRowClick?: (row: WidgetRow) => void
}

export function WidgetList({
  title,
  icon: Icon,
  rows,
  footer,
  emptyText = "Nothing here yet.",
  className,
  onRowClick,
}: WidgetListProps) {
  return (
    <Card className={cn("gap-0 py-0", className)}>
      <CardHeader className="border-b py-4">
        <CardTitle className="flex items-center gap-2 text-sm">
          {Icon && <Icon className="size-4 text-muted-foreground" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-2">
        {rows.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-muted-foreground">
            {emptyText}
          </p>
        ) : (
          <ul className="divide-y">
            {rows.map((row) => (
              <li
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "flex items-center gap-3 px-5 py-3",
                  onRowClick &&
                    "cursor-pointer transition-colors hover:bg-muted/50"
                )}
              >
                {row.icon && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    <row.icon className="size-4" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{row.title}</div>
                  {row.subtitle && (
                    <div className="truncate text-xs text-muted-foreground">
                      {row.subtitle}
                    </div>
                  )}
                </div>
                {row.badge && (
                  <div className="shrink-0">{row.badge}</div>
                )}
                {row.meta && (
                  <div className="shrink-0 text-sm font-medium tabular-nums">
                    {row.meta}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        {footer && <div className="border-t px-5 py-2">{footer}</div>}
      </CardContent>
    </Card>
  )
}