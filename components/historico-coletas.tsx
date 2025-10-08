"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRegistrosColeta } from "@/lib/use-registros-coleta"
import { CheckCircle2, Package, Calendar, User, Award, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

const MATERIAL_COLORS: Record<string, string> = {
  plastico: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  papel: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  vidro: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  metal: "bg-slate-500/10 text-slate-700 border-slate-500/20",
  organico: "bg-green-500/10 text-green-700 border-green-500/20",
  eletronico: "bg-purple-500/10 text-purple-700 border-purple-500/20",
}

const MATERIAL_LABELS: Record<string, string> = {
  plastico: "Plástico",
  papel: "Papel",
  vidro: "Vidro",
  metal: "Metal",
  organico: "Orgânico",
  eletronico: "Eletrônico",
}

export function HistoricoColetas() {
  const { registros, isLoading } = useRegistrosColeta()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (registros.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
            Histórico de Coletas Validadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="mb-4 h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
            <p className="text-base sm:text-lg font-medium text-foreground">Nenhuma coleta validada ainda</p>
            <p className="text-xs sm:text-sm text-muted-foreground px-4">
              As coletas validadas aparecerão aqui com informações de pontos e gamificação
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
          Histórico de Coletas Validadas ({registros.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {registros.map((registro: any) => (
            <Card key={registro._id} className="border-2">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm sm:text-base font-semibold text-foreground">{registro.nomeUsuario}</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20 text-xs">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Validado
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                        <Badge className={`text-xs ${MATERIAL_COLORS[registro.tipoMaterial] || ""}`}>
                          {MATERIAL_LABELS[registro.tipoMaterial] || registro.tipoMaterial}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="font-medium">{registro.pesoKg} kg</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs">
                          {formatDistanceToNow(new Date(registro.dataValidacao), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs sm:text-sm">
                      <span className="text-muted-foreground">Código:</span>
                      <code className="rounded bg-muted px-2 py-1 font-mono text-[10px] sm:text-xs">
                        {registro.codigo}
                      </code>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t pt-3 sm:border-t-0 sm:pt-0">
                    <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 sm:px-4">
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <div className="text-left sm:text-right">
                        <p className="text-xl sm:text-2xl font-bold text-primary">+{registro.pontosGanhos}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">pontos</p>
                      </div>
                    </div>

                    {registro.badgesGanhos && registro.badgesGanhos.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {registro.badgesGanhos.map((badge: string) => (
                          <Badge key={badge} variant="secondary" className="text-[10px] sm:text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
