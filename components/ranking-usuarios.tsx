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
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  const usuariosOrdenados = [...usuarios].sort((a: any, b: any) => b.pontos - a.pontos).slice(0, 10)

  if (usuariosOrdenados.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
            Ranking de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <TrendingUp className="mb-4 h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
            <p className="text-base sm:text-lg font-medium text-foreground">Nenhum usuário cadastrado</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
          Ranking de Usuários - Top 10
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 sm:space-y-3">
          {usuariosOrdenados.map((usuario: any, index: number) => (
            <div
              key={usuario._id}
              className="flex items-center justify-between rounded-lg border bg-card p-3 sm:p-4 transition-colors hover:bg-accent gap-3"
            >
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <div
                  className={`flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted font-bold ${getMedalColor(index)}`}
                >
                  {index < 3 ? (
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <span className="text-sm sm:text-base">{index + 1}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground text-sm sm:text-base truncate">{usuario.nome}</p>
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                    <span>{usuario.coletasRealizadas} coletas</span>
                    <span>•</span>
                    <span>{usuario.pesoTotalColetado.toFixed(1)} kg</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    <span className="text-lg sm:text-2xl font-bold text-primary">{usuario.pontos}</span>
                  </div>
                  <Badge variant="secondary" className="mt-1 text-[10px] sm:text-xs">
                    Nível {usuario.nivel}
                  </Badge>
                </div>

                {usuario.badges && usuario.badges.length > 0 && (
                  <div className="hidden sm:flex gap-1">
                    {usuario.badges.slice(0, 3).map((badge: string) => (
                      <div key={badge} className="text-xl sm:text-2xl" title={badge}>
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
