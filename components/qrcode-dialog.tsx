"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface QRCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pontoId: string
  pontoNome: string
  qrCode: string
}

export function QRCodeDialog({ open, onOpenChange, pontoId, pontoNome, qrCode }: QRCodeDialogProps) {
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && !qrCodeImage) {
      fetchQRCode()
    }
  }, [open])

  const fetchQRCode = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/pontos-coleta/${pontoId}/qrcode`)
      const data = await response.json()
      if (data.success) {
        setQrCodeImage(data.data.qrCodeImage)
      }
    } catch (error) {
      console.error("Erro ao buscar QR Code:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeImage) return

    const link = document.createElement("a")
    link.href = qrCodeImage
    link.download = `qrcode-${qrCode}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-balance">QR Code - {pontoNome}</DialogTitle>
          <DialogDescription>Código: {qrCode}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {loading ? (
            <div className="flex h-64 w-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : qrCodeImage ? (
            <img
              src={qrCodeImage || "/placeholder.svg"}
              alt={`QR Code ${qrCode}`}
              className="h-64 w-64 rounded-lg border border-border"
            />
          ) : (
            <div className="flex h-64 w-64 items-center justify-center rounded-lg border border-border bg-muted">
              <p className="text-sm text-muted-foreground">QR Code não disponível</p>
            </div>
          )}
          <Button onClick={downloadQRCode} disabled={!qrCodeImage} className="w-full gap-2">
            <Download className="h-4 w-4" />
            Baixar QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
