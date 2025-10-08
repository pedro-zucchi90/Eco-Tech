"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUsuarios } from "@/lib/use-usuarios"
import { Trophy, Award, TrendingUp, Loader2 } from "lucide-react"

export function RankingUsuarios() {
  const { usuarios, isLoading } = useUsuarios()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  const usuariosOrdenados = [...usuarios].sort((a: any, b: any) => b.pontos - a.pontos).slice(0, 10)

  if (usuariosOrdenados.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Trophy className="h-4 w-4" />
            Ranking de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <TrendingUp className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Nenhum usuário cadastrado</p>
            <p className="text-xs text-muted-foreground">
              O ranking aparecerá aqui quando houver usuários ativos
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getMedalColor = (position: number) => {
    if (position === 0) return "text-yellow-500"
    if (position === 1) return "text-slate-400"
    if (position === 2) return "text-amber-600"
    return "text-muted-foreground"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Trophy className="h-4 w-4" />
          Top 10 Usuários
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {usuariosOrdenados.map((usuario: any, index: number) => (
            <div
              key={usuario._id}
              className="flex items-center justify-between rounded-md border bg-card px-2 py-2 sm:px-3 sm:py-2 transition-colors hover:bg-blue-50 gap-2"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted font-bold ${getMedalColor(index)}`}
                >
                  {index < 3 ? (
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <span className="text-xs sm:text-sm">{index + 1}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground text-xs sm:text-sm truncate">{usuario.nome}</p>
                  <div className="flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground">
                    <span>{usuario.coletasRealizadas} coletas</span>
                    <span>•</span>
                    <span>{usuario.pesoTotalColetado.toFixed(1)} kg</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3 text-primary" />
                    <span className="text-base sm:text-lg font-bold text-primary">{usuario.pontos}</span>
                  </div>
                  <Badge variant="secondary" className="mt-0.5 text-[9px] sm:text-xs px-1">
                    Nível {usuario.nivel}
                  </Badge>
                </div>
                {usuario.badges && usuario.badges.length > 0 && (
                  <div className="hidden sm:flex gap-0.5">
                    {usuario.badges.slice(0, 2).map((badge: string) => (
                      <div key={badge} className="text-lg sm:text-xl" title={badge}>
                        {badge === "iniciante" && "🌱"}
                        {badge === "coletor" && "♻️"}
                        {badge === "heroi" && "🦸"}
                        {badge === "peso_bronze" && "🥉"}
                        {badge === "peso_prata" && "🥈"}
                        {badge === "peso_ouro" && "🥇"}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
