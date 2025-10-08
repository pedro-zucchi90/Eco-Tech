"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRegistrosColeta } from "@/lib/use-registros-coleta"
import { CheckCircle2, Package, Calendar, User, Award, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"

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

const PAGE_SIZE = 5

export function HistoricoColetas() {
  const { registros, isLoading } = useRegistrosColeta()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (registros.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
            Histórico de Coletas Validadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <Package className="mb-2 h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
            <p className="text-base sm:text-lg font-medium text-foreground">Nenhuma coleta validada ainda</p>
            <p className="text-xs sm:text-sm text-muted-foreground px-2">
              As coletas validadas aparecerão aqui com informações de pontos e gamificação
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const registrosVisiveis = registros.slice(0, visibleCount)
  const temMais = visibleCount < registros.length

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
          Histórico de Coletas Validadas ({registros.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {registrosVisiveis.map((registro: any) => (
            <div
              key={registro._id}
              className="flex flex-col sm:flex-row items-center sm:items-stretch gap-2 border rounded-lg px-3 py-2 bg-card"
            >
              {/* Linha superior: Usuário, Material, Peso, Data */}
              <div className="flex flex-1 flex-wrap items-center gap-2 min-w-0">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-foreground truncate max-w-[120px]">{registro.nomeUsuario}</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20 text-[10px] sm:text-xs px-1 py-0.5">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Validado
                </Badge>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-1">
                  <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                  <Badge className={`text-[10px] sm:text-xs px-1 py-0.5 ${MATERIAL_COLORS[registro.tipoMaterial] || ""}`}>
                    {MATERIAL_LABELS[registro.tipoMaterial] || registro.tipoMaterial}
                  </Badge>
                </div>
                <span className="hidden sm:inline">•</span>
                <span className="font-medium text-xs sm:text-sm">{registro.pesoKg} kg</span>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-[10px] sm:text-xs">
                    {formatDistanceToNow(new Date(registro.dataValidacao), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
                <span className="hidden sm:inline">•</span>
                <span className="text-muted-foreground text-[10px] sm:text-xs">Código:</span>
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:text-xs">
                  {registro.codigo}
                </code>
              </div>
              {/* Linha inferior: Pontos e Badges */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1 rounded bg-primary/10 px-2 py-1">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-base sm:text-lg font-bold text-primary">+{registro.pontosGanhos}</span>
                </div>
                {registro.badgesGanhos && registro.badgesGanhos.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {registro.badgesGanhos.map((badge: string) => (
                      <Badge key={badge} variant="secondary" className="text-[10px] sm:text-xs px-1 py-0.5">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {temMais && (
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="text-sm"
            >
              Carregar mais
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
