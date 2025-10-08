"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Loader2 } from "lucide-react"
import { useState } from "react"
import { gerarRelatorioPDF } from "@/lib/pdf-generator"

export function RelatoriosSection() {
  const [tipo, setTipo] = useState("diario")
  const [loading, setLoading] = useState(false)

  const gerarRelatorio = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/relatorios/pdf?tipo=${tipo}`)
      const data = await response.json()

      if (data.success) {
        const pdf = gerarRelatorioPDF(data.data)
        pdf.save(`relatorio-${tipo}-${new Date().toISOString().split("T")[0]}.pdf`)
      } else {
        alert("Erro ao gerar relatório")
      }
    } catch (error) {
      console.error("Erro ao gerar relatório:", error)
      alert("Erro ao gerar relatório")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Relatórios
        </CardTitle>
        <CardDescription>Gere relatórios consolidados de coleta seletiva</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-foreground">Período</label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diario">Diário (Hoje)</SelectItem>
                <SelectItem value="semanal">Semanal (Últimos 7 dias)</SelectItem>
                <SelectItem value="mensal">Mensal (Últimos 30 dias)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={gerarRelatorio} disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Gerar PDF
              </>
            )}
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <h4 className="mb-2 font-medium text-foreground">O relatório inclui:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Resumo geral de coletas e peso total</li>
            <li>• Estatísticas por bairro</li>
            <li>• Distribuição por tipo de material</li>
            <li>• Pontos sem coleta no período</li>
            <li>• Média de peso por ponto de coleta</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
