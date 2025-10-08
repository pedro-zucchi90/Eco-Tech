"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { PontoColetaCard } from "@/components/ponto-coleta-card"
import { StatsCard } from "@/components/stats-card"
import { RelatoriosSection } from "@/components/relatorios-section"
import { RegistrarColetaDialog } from "@/components/registrar-coleta-dialog"
import { HistoricoColetas } from "@/components/historico-coletas"
import { RankingUsuarios } from "@/components/ranking-usuarios"
import { usePontosColeta } from "@/lib/hooks/use-pontos-coleta"
import { useColetas } from "@/lib/hooks/use-coletas"
import { useRegistrosColeta } from "@/lib/use-registros-coleta"
import { useUsuarios } from "@/lib/use-usuarios"
import { MapPin, Weight, TrendingUp, AlertCircle, Loader2, QrCode, Award, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  const { pontos, isLoading: loadingPontos } = usePontosColeta()
  const { coletas, isLoading: loadingColetas } = useColetas()
  const { registros, isLoading: loadingRegistros } = useRegistrosColeta()
  const { usuarios, isLoading: loadingUsuarios } = useUsuarios()

  console.log("[v0] Pontos carregados:", pontos)
  console.log("[v0] Coletas carregadas:", coletas)
  console.log("[v0] Registros carregados:", registros)
  console.log("[v0] Usuários carregados:", usuarios)

  if (loadingPontos || loadingColetas || loadingRegistros || loadingUsuarios) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const totalPontos = pontos.length
  const pontosAtivos = pontos.filter((p: any) => p.status === "ativo").length
  const pontosCheios = pontos.filter((p: any) => p.nivelAtual >= 80).length
  const pesoTotal = pontos.reduce((acc: number, p: any) => acc + p.pesoAtual, 0)

  const totalUsuarios = usuarios.length
  const totalPontosGamificacao = usuarios.reduce((acc: number, u: any) => acc + u.pontos, 0)
  const coletasValidadas = registros.length

  // Calcular coletas de hoje
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const coletasHoje = coletas.filter((c: any) => new Date(c.dataHora) >= hoje).length

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      
      <main className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Visão Geral</h2>
            <p className="text-sm text-muted-foreground">Monitoramento em tempo real dos pontos de coleta</p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Link href="/validar" className="flex-1 sm:flex-none">
              <Button variant="outline" size="lg" className="w-full gap-2 bg-transparent text-sm sm:text-base">
                <QrCode className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Validar Código</span>
                <span className="sm:hidden">Validar</span>
              </Button>
            </Link>
            <div className="flex-1 sm:flex-none">
              <RegistrarColetaDialog />
            </div>
          </div>
        </div>

        <div className="mb-6 sm:mb-8 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Pontos de Coleta"
            value={totalPontos}
            icon={MapPin}
            description={`${pontosAtivos} ativos`}
          />
          <StatsCard
            title="Peso Total Coletado"
            value={`${pesoTotal.toFixed(1)} kg`}
            icon={Weight}
            description="Acumulado atual"
          />
          <StatsCard title="Coletas Hoje" value={coletasHoje} icon={TrendingUp} description="Registros automáticos" />
          <StatsCard title="Pontos Cheios" value={pontosCheios} icon={AlertCircle} description="Requerem atenção" />
        </div>

        <div className="mb-6 sm:mb-8">
          <RelatoriosSection />
        </div>


        <div className="mb-6 sm:mb-8">
          <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-foreground">Estatísticas de Gamificação</h3>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
            <StatsCard
              title="Usuários Ativos"
              value={totalUsuarios}
              icon={Users}
              description="Participando do programa"
            />
            <StatsCard
              title="Pontos Totais"
              value={totalPontosGamificacao}
              icon={Award}
              description="Acumulados pelos usuários"
            />
            <StatsCard
              title="Coletas Validadas"
              value={coletasValidadas}
              icon={TrendingUp}
              description="Com código confirmado"
            />
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <RankingUsuarios />
        </div>

        <div className="mb-6 sm:mb-8">
          <HistoricoColetas />
        </div>


        {pontosCheios > 0 && (
          <Card className="mb-6 sm:mb-8 border-destructive bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base text-destructive">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                Atenção: {pontosCheios} {pontosCheios === 1 ? "ponto requer" : "pontos requerem"} coleta urgente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {pontos
                  .filter((p: any) => p.nivelAtual >= 80)
                  .map((ponto: any) => (
                    <PontoColetaCard key={ponto._id} ponto={ponto} />
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Todos os Pontos de Coleta</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Atualização automática a cada 5 segundos</p>
        </div>

        {pontos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
              <MapPin className="mb-4 h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
              <p className="text-base sm:text-lg font-medium text-foreground">Nenhum ponto de coleta cadastrado</p>
              <p className="text-xs sm:text-sm text-muted-foreground text-center px-4">
                Use a API para cadastrar pontos de coleta e começar o monitoramento
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {pontos.map((ponto: any) => (
              <PontoColetaCard key={ponto._id} ponto={ponto} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
