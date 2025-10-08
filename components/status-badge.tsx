import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"

interface StatusBadgeProps {
  nivel: number
  status?: string
}

export function StatusBadge({ nivel, status }: StatusBadgeProps) {
  if (status === "inativo" || status === "manutencao") {
    return (
      <Badge variant="secondary" className="gap-1">
        <AlertCircle className="h-3 w-3" />
        {status === "inativo" ? "Inativo" : "Manutenção"}
      </Badge>
    )
  }

  if (nivel >= 80) {
    return (
      <Badge variant="destructive" className="gap-1 bg-destructive text-destructive-foreground">
        <AlertCircle className="h-3 w-3" />
        Cheio
      </Badge>
    )
  }

  if (nivel >= 50) {
    return (
      <Badge className="gap-1 bg-warning text-warning-foreground">
        <AlertTriangle className="h-3 w-3" />
        Médio
      </Badge>
    )
  }

  return (
    <Badge variant="default" className="gap-1 bg-primary text-primary-foreground">
      <CheckCircle className="h-3 w-3" />
      Normal
    </Badge>
  )
}
