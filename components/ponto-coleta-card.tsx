"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Weight, Gauge, Calendar, QrCode } from "lucide-react"
import { StatusBadge } from "./status-badge"
import { useState } from "react"
import { QRCodeDialog } from "./qrcode-dialog"

interface PontoColetaCardProps {
  ponto: {
    _id: string
    nome: string
    endereco: string
    qrCode: string
    status: string
    tipoMaterial: string[]
    capacidadeMaxima: number
    nivelAtual: number
    pesoAtual: number
    ultimaColeta?: string
    bairro?: {
      nome: string
    }
  }
}

export function PontoColetaCard({ ponto }: PontoColetaCardProps) {
  const [showQRCode, setShowQRCode] = useState(false)

  const formatDate = (date?: string) => {
    if (!date) return "Nunca"
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate">{ponto.nome}</CardTitle>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground truncate">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{ponto.endereco}</span>
              </div>
              {ponto.bairro && (
                <Badge variant="outline" className="mt-1 text-[10px] px-2 py-0.5">
                  {ponto.bairro.nome}
                </Badge>
              )}
            </div>
            <StatusBadge nivel={ponto.nivelAtual} status={ponto.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded bg-muted px-2 py-1 flex-1 min-w-0">
              <Weight className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Peso</span>
              <span className="font-semibold text-foreground text-xs truncate">{ponto.pesoAtual.toFixed(1)} kg</span>
            </div>
            <div className="flex items-center gap-1 rounded bg-muted px-2 py-1 flex-1 min-w-0">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Nível</span>
              <span className="font-semibold text-foreground text-xs truncate">{ponto.nivelAtual.toFixed(0)}%</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Última:</span>
            <span className="font-medium text-foreground truncate">{formatDate(ponto.ultimaColeta)}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {ponto.tipoMaterial.map((material) => (
              <Badge key={material} variant="secondary" className="text-[10px] px-2 py-0.5">
                {material}
              </Badge>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 bg-transparent mt-1"
            onClick={() => setShowQRCode(true)}
          >
            <QrCode className="h-4 w-4" />
            QR Code
          </Button>
        </CardContent>
      </Card>

      <QRCodeDialog
        open={showQRCode}
        onOpenChange={setShowQRCode}
        pontoId={ponto._id}
        pontoNome={ponto.nome}
        qrCode={ponto.qrCode}
      />
    </>
  )
}
