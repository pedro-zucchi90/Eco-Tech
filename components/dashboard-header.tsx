import Image from "next/image"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-lg flex-shrink-0">
              <Image src="/logo.png" alt="EcoTech" width={80} height={80} className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-lg sm:text-3xl font-bold text-foreground">EcoTech</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Dados para Gestão de Coleta Seletiva
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
