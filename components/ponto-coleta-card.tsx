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
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-balance">{ponto.nome}</CardTitle>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="text-pretty">{ponto.endereco}</span>
              </div>
              {ponto.bairro && (
                <Badge variant="outline" className="mt-2">
                  {ponto.bairro.nome}
                </Badge>
              )}
            </div>
            <StatusBadge nivel={ponto.nivelAtual} status={ponto.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
              <Weight className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Peso Atual</p>
                <p className="font-semibold text-foreground">{ponto.pesoAtual.toFixed(1)} kg</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Nível</p>
                <p className="font-semibold text-foreground">{ponto.nivelAtual.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Última coleta:</span>
            <span className="font-medium text-foreground">{formatDate(ponto.ultimaColeta)}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {ponto.tipoMaterial.map((material) => (
              <Badge key={material} variant="secondary" className="text-xs">
                {material}
              </Badge>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 bg-transparent"
            onClick={() => setShowQRCode(true)}
          >
            <QrCode className="h-4 w-4" />
            Ver QR Code
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
