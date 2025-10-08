"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2, Trophy, Award, TrendingUp, Home } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ValidarPage() {
  const [codigo, setCodigo] = useState("")
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<any>(null)
  const [erro, setErro] = useState<string | null>(null)

  const handleValidar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro(null)
    setResultado(null)

    try {
      const response = await fetch("/api/registros-coleta/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      })

      const data = await response.json()

      if (data.success) {
        setResultado(data.data)
        setCodigo("")
      } else {
        setErro(data.error)
      }
    } catch (error) {
      console.error("[v0] Erro ao validar:", error)
      setErro("Erro ao validar código")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setResultado(null)
    setErro(null)
    setCodigo("")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-3 sm:p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2 sm:space-y-3">
          <CardTitle className="text-xl sm:text-2xl">Validar Coleta</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Digite o código de 6 dígitos para validar sua coleta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!resultado ? (
            <form onSubmit={handleValidar} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="codigo" className="text-sm sm:text-base">
                  Código de Coleta
                </Label>
                <Input
                  id="codigo"
                  type="text"
                  placeholder="000000"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="text-center font-mono text-xl sm:text-2xl tracking-widest"
                  required
                />
              </div>

              {erro && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive bg-destructive/10 p-3 text-xs sm:text-sm text-destructive">
                  <XCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{erro}</span>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading || codigo.length !== 6}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validando...
                  </>
                ) : (
                  "Validar Coleta"
                )}
              </Button>

              <Link href="/" className="block">
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Home className="h-4 w-4" />
                  Voltar ao Dashboard
                </Button>
              </Link>
            </form>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-primary bg-primary/10 p-3 sm:p-4 text-center">
                <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                <div>
                  <p className="text-base sm:text-lg font-bold text-foreground">Coleta Validada!</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Parabéns pela contribuição</p>
                </div>
              </div>

              {resultado.usuario && (
                <div className="space-y-3">
                  <Card className="border-primary/50 bg-primary/5">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          <span className="text-sm sm:text-base font-medium">Pontos Ganhos</span>
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-primary">
                          +{resultado.usuario.pontosGanhos}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <Card>
                      <CardContent className="pt-3 sm:pt-4">
                        <div className="text-center">
                          <TrendingUp className="mx-auto mb-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <p className="text-[10px] sm:text-xs text-muted-foreground">Nível</p>
                          <p className="text-lg sm:text-xl font-bold">{resultado.usuario.nivel}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-3 sm:pt-4">
                        <div className="text-center">
                          <Award className="mx-auto mb-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <p className="text-[10px] sm:text-xs text-muted-foreground">Pontos</p>
                          <p className="text-lg sm:text-xl font-bold">{resultado.usuario.pontos}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-3 sm:pt-4">
                        <div className="text-center">
                          <CheckCircle2 className="mx-auto mb-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <p className="text-[10px] sm:text-xs text-muted-foreground">Coletas</p>
                          <p className="text-lg sm:text-xl font-bold">{resultado.usuario.coletasRealizadas}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {resultado.usuario.badgesGanhos && resultado.usuario.badgesGanhos.length > 0 && (
                    <Card className="border-2 border-primary bg-primary/5">
                      <CardContent className="pt-3 sm:pt-4">
                        <p className="mb-2 sm:mb-3 text-center text-xs sm:text-sm font-medium">
                          🎉 Novos Badges Conquistados!
                        </p>
                        <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                          {resultado.usuario.badgesGanhos.map((badgeNome: string, index: number) => (
                            <Badge key={index} variant="secondary" className="gap-1 text-xs sm:text-sm">
                              {badgeNome}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={resetForm} variant="outline" className="flex-1 bg-transparent">
                  Validar Outro
                </Button>
                <Link href="/" className="flex-1">
                  <Button className="w-full gap-2">
                    <Home className="h-4 w-4" />
                    Ver Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
