import { Leaf } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary flex-shrink-0">
              <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-foreground">EcoTech DataFlow</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Sistema de Gestão de Coleta Seletiva
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm font-medium text-foreground">Prefeitura Municipal</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Dashboard de Monitoramento</p>
          </div>
        </div>
      </div>
    </header>
  )
}
