"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2, CheckCircle2, Copy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const TIPOS_MATERIAL = [
  { value: "plastico", label: "Plástico" },
  { value: "papel", label: "Papel" },
  { value: "vidro", label: "Vidro" },
  { value: "metal", label: "Metal" },
  { value: "organico", label: "Orgânico" },
  { value: "eletronico", label: "Eletrônico" },
]

export function RegistrarColetaDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [codigoGerado, setCodigoGerado] = useState<string | null>(null)
  const [nomeUsuario, setNomeUsuario] = useState("")
  const [emailUsuario, setEmailUsuario] = useState("")
  const [tipoMaterial, setTipoMaterial] = useState("")
  const [peso, setPeso] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/registros-coleta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeUsuario,
          emailUsuario,
          tipoMaterial,
          pesoKg: Number.parseFloat(peso),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setCodigoGerado(data.data.codigo)
      } else {
        alert("Erro ao gerar código: " + data.error)
      }
    } catch (error) {
      console.error("[v0] Erro ao registrar coleta:", error)
      alert("Erro ao registrar coleta")
    } finally {
      setLoading(false)
    }
  }

  const copiarCodigo = async () => {
    if (!codigoGerado) return

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(codigoGerado)
        alert("Código copiado!")
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea")
        textArea.value = codigoGerado
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
          document.execCommand("copy")
          alert("Código copiado!")
        } catch (err) {
          console.error("[v0] Fallback copy failed:", err)
          alert("Não foi possível copiar. Código: " + codigoGerado)
        } finally {
          textArea.remove()
        }
      }
    } catch (err) {
      console.error("[v0] Erro ao copiar:", err)
      alert("Não foi possível copiar. Código: " + codigoGerado)
    }
  }

  const resetForm = () => {
    setCodigoGerado(null)
    setNomeUsuario("")
    setEmailUsuario("")
    setTipoMaterial("")
    setPeso("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 text-sm sm:text-base">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Registrar Coleta</span>
          <span className="sm:hidden">Registrar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Registrar Nova Coleta</DialogTitle>
        </DialogHeader>

        {!codigoGerado ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Usuário</Label>
              <Input
                id="nome"
                type="text"
                placeholder="Ex: João Silva"
                value={nomeUsuario}
                onChange={(e) => setNomeUsuario(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email do Usuário</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ex: joao@email.com"
                value={emailUsuario}
                onChange={(e) => setEmailUsuario(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Material</Label>
              <Select value={tipoMaterial} onValueChange={setTipoMaterial} required>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_MATERIAL.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="Ex: 5.5"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando código...
                </>
              ) : (
                "Gerar Código de Coleta"
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Card className="border-2 border-primary bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-2 text-center">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Código gerado com sucesso!</p>
                </div>
                <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row">
                  <div className="rounded-lg bg-background px-4 py-3 sm:px-6 sm:py-4">
                    <p className="font-mono text-2xl sm:text-4xl font-bold tracking-wider text-foreground">
                      {codigoGerado}
                    </p>
                  </div>
                  <Button size="icon" variant="outline" onClick={copiarCodigo}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Válido por 24 horas. Use este código no app mobile para validar a coleta.
                </p>
              </CardContent>
            </Card>

            <Button onClick={resetForm} className="w-full bg-transparent" variant="outline">
              Registrar Nova Coleta
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
