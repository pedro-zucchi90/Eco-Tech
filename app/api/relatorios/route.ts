import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Coleta } from "@/lib/models/coleta"
import type { PontoColeta } from "@/lib/models/ponto-coleta"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tipo = searchParams.get("tipo") || "diario" // diario, semanal, mensal
    const dataInicio = searchParams.get("dataInicio")
    const dataFim = searchParams.get("dataFim")

    const db = await getDatabase()

    // Calcular período baseado no tipo
    let inicio: Date
    let fim: Date = new Date()

    if (dataInicio && dataFim) {
      inicio = new Date(dataInicio)
      fim = new Date(dataFim)
    } else {
      switch (tipo) {
        case "semanal":
          inicio = new Date()
          inicio.setDate(inicio.getDate() - 7)
          break
        case "mensal":
          inicio = new Date()
          inicio.setMonth(inicio.getMonth() - 1)
          break
        case "diario":
        default:
          inicio = new Date()
          inicio.setHours(0, 0, 0, 0)
          break
      }
    }

    // Buscar coletas no período
    const coletas = await db
      .collection<Coleta>("coletas")
      .aggregate([
        {
          $match: {
            dataHora: {
              $gte: inicio,
              $lte: fim,
            },
          },
        },
        {
          $lookup: {
            from: "pontos_coleta",
            localField: "pontoColetaId",
            foreignField: "_id",
            as: "pontoColeta",
          },
        },
        { $unwind: "$pontoColeta" },
        {
          $lookup: {
            from: "bairros",
            localField: "pontoColeta.bairroId",
            foreignField: "_id",
            as: "bairro",
          },
        },
        { $unwind: "$bairro" },
      ])
      .toArray()

    // Buscar todos os pontos ativos
    const pontosAtivos = await db.collection<PontoColeta>("pontos_coleta").find({ status: "ativo" }).toArray()

    // Calcular estatísticas
    const totalColetas = coletas.length
    const pesoTotal = coletas.reduce((acc, c) => acc + c.peso, 0)

    // Coletas por bairro
    const coletasPorBairro = coletas.reduce(
      (acc, c: any) => {
        const bairroNome = c.bairro.nome
        if (!acc[bairroNome]) {
          acc[bairroNome] = { bairro: bairroNome, coletas: 0, peso: 0 }
        }
        acc[bairroNome].coletas++
        acc[bairroNome].peso += c.peso
        return acc
      },
      {} as Record<string, { bairro: string; coletas: number; peso: number }>,
    )

    // Coletas por material
    const coletasPorMaterial = coletas.reduce(
      (acc, c) => {
        const material = c.tipoMaterial
        if (!acc[material]) {
          acc[material] = { material, coletas: 0, peso: 0 }
        }
        acc[material].coletas++
        acc[material].peso += c.peso
        return acc
      },
      {} as Record<string, { material: string; coletas: number; peso: number }>,
    )

    // Pontos sem coleta no período
    const pontosComColeta = new Set(coletas.map((c: any) => c.pontoColetaId.toString()))
    const pontosSemColeta = pontosAtivos
      .filter((p) => !pontosComColeta.has(p._id!.toString()))
      .map((p) => ({
        nome: p.nome,
        endereco: p.endereco,
        ultimaColeta: p.ultimaColeta ? new Date(p.ultimaColeta).toLocaleDateString("pt-BR") : "Nunca",
      }))

    // Média de peso por ponto
    const mediaPesoPorPonto = pontosAtivos.length > 0 ? pesoTotal / pontosAtivos.length : 0

    const relatorio = {
      periodo: {
        inicio: inicio.toISOString(),
        fim: fim.toISOString(),
        tipo,
      },
      resumo: {
        totalColetas,
        pesoTotal: Number.parseFloat(pesoTotal.toFixed(2)),
        pontosAtivos: pontosAtivos.length,
        mediaPesoPorPonto: Number.parseFloat(mediaPesoPorPonto.toFixed(2)),
      },
      coletasPorBairro: Object.values(coletasPorBairro).sort((a, b) => b.peso - a.peso),
      coletasPorMaterial: Object.values(coletasPorMaterial).sort((a, b) => b.peso - a.peso),
      pontosSemColeta,
    }

    return NextResponse.json({ success: true, data: relatorio })
  } catch (error) {
    console.error("Erro ao gerar relatório:", error)
    return NextResponse.json({ success: false, error: "Erro ao gerar relatório" }, { status: 500 })
  }
}
