import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <Card className="shadow-none border">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-xl font-bold text-foreground leading-tight">{value}</p>
            {description && (
              <p className="text-[11px] text-muted-foreground truncate">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
