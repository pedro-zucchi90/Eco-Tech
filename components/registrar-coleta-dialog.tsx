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
import { useBairros } from "@/lib/hooks/use-bairros"

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
  const [bairroId, setBairroId] = useState("")

  const { bairros, isLoading: loadingBairros } = useBairros()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 🔹 Validação do nome (apenas letras e espaços)
    const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/
    if (!nomeRegex.test(nomeUsuario)) {
      alert("O nome deve conter apenas letras e espaços.")
      return
    }

    // 🔹 Validação do email (regex simples)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailUsuario)) {
      alert("Digite um email válido.")
      return
    }

    // 🔹 Validação do peso (máximo 100 kg)
    const pesoNum = Number.parseFloat(peso)
    if (pesoNum > 100) {
      alert("O peso máximo permitido por cadastro é de 100 kg.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/registros-coleta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeUsuario,
          emailUsuario,
          tipoMaterial,
          pesoKg: pesoNum,
          bairroId: bairroId || undefined,
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
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(codigoGerado)
        alert("Código copiado!")
      } else {
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
    setBairroId("")
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xs p-4">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Registrar Nova Coleta</DialogTitle>
        </DialogHeader>

        {!codigoGerado ? (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              <Input
                id="nome"
                type="text"
                placeholder="Nome do Usuário"
                value={nomeUsuario}
                onChange={(e) => setNomeUsuario(e.target.value)}
                required
                className="text-sm"
                autoComplete="off"
              />
              <Input
                id="email"
                type="email"
                placeholder="Email do Usuário"
                value={emailUsuario}
                onChange={(e) => setEmailUsuario(e.target.value)}
                required
                className="text-sm"
                autoComplete="off"
              />
              <Select value={bairroId} onValueChange={setBairroId} disabled={loadingBairros}>
                <SelectTrigger id="bairro" className="text-sm">
                  <SelectValue placeholder={loadingBairros ? "Carregando..." : "Bairro (opcional)"} />
                </SelectTrigger>
                <SelectContent>
                  {bairros.map((bairro: any) => (
                    <SelectItem key={bairro._id} value={bairro._id}>
                      {bairro.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={tipoMaterial} onValueChange={setTipoMaterial} required>
                <SelectTrigger id="tipo" className="text-sm">
                  <SelectValue placeholder="Tipo de Material" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_MATERIAL.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="peso"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="Peso (kg)"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                required
                className="text-sm"
                autoComplete="off"
              />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={loading} size="sm">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando código...
                </>
              ) : (
                "Gerar Código"
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-3">
            <Card className="border-primary bg-primary/5">
              <CardContent className="pt-4 pb-3 px-2">
                <div className="flex items-center justify-center gap-2 text-center">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Código gerado!
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="rounded bg-background px-3 py-2">
                    <span className="font-mono text-xl font-bold tracking-wider text-foreground">
                      {codigoGerado}
                    </span>
                  </span>
                  <Button size="icon" variant="outline" onClick={copiarCodigo}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Válido por 24h. Use no app mobile para validar.
                </p>
              </CardContent>
            </Card>
            <Button onClick={resetForm} className="w-full" variant="outline" size="sm">
              Nova Coleta
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}