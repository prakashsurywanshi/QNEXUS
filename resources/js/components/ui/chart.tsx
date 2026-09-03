import * as React from "react"
import { Tooltip as RechartsTooltip } from "recharts"

interface ChartConfig {
  label: string
  color: string
}

interface ChartContainerProps {
  config: Record<string, ChartConfig>
  className?: string
  children: React.ReactNode
}

function ChartContainer({ config, className, children }: ChartContainerProps) {
  const cssVars = Object.entries(config).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      acc[`--color-${key}`] = value.color
      return acc
    },
    {}
  )

  return (
    <div style={cssVars} className={className}>
      {children}
    </div>
  )
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{ name?: string; value?: number | string }>
  label?: string
  labelFormatter?: (label: string) => string
  formatter?: (value: number, name: string) => string
}

function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
  formatter,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-md backdrop-blur">
      {label && (
        <div className="mb-1 text-xs font-medium text-muted-foreground">
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => {
          if (typeof entry.value !== "number") {
            return null
          }
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="font-medium">{entry.name ?? ""}</span>
              <span className="ml-auto font-semibold">
                {formatter ? formatter(entry.value, entry.name ?? "") : entry.value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChartTooltip() {
  return (
    <RechartsTooltip
      cursor={false}
      content={<ChartTooltipContent />}
    />
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }