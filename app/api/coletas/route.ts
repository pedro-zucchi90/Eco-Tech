import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Coleta } from "@/lib/models/coleta"
import type { PontoColeta } from "@/lib/models/ponto-coleta"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pontoColetaId = searchParams.get("pontoColetaId")
    const dataInicio = searchParams.get("dataInicio")
    const dataFim = searchParams.get("dataFim")

    const db = await getDatabase()
    const query: any = {}

    if (pontoColetaId) {
      query.pontoColetaId = new ObjectId(pontoColetaId)
    }

    if (dataInicio || dataFim) {
      query.dataHora = {}
      if (dataInicio) query.dataHora.$gte = new Date(dataInicio)
      if (dataFim) query.dataHora.$lte = new Date(dataFim)
    }

    const coletas = await db
      .collection<Coleta>("coletas")
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: "pontos_coleta",
            localField: "pontoColetaId",
            foreignField: "_id",
            as: "pontoColeta",
          },
        },
        { $unwind: { path: "$pontoColeta", preserveNullAndEmptyArrays: true } },
        { $sort: { dataHora: -1 } },
      ])
      .toArray()

    return NextResponse.json({ success: true, data: coletas })
  } catch (error) {
    console.error("Erro ao buscar coletas:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar coletas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrCode, pontoColetaId, peso, tipoMaterial, nivel, operador, observacoes, origem = "qrcode" } = body

    const db = await getDatabase()
    let ponto: PontoColeta | null = null

    // Buscar ponto de coleta por QR Code ou ID
    if (qrCode) {
      ponto = await db.collection<PontoColeta>("pontos_coleta").findOne({ qrCode })
    } else if (pontoColetaId) {
      ponto = await db.collection<PontoColeta>("pontos_coleta").findOne({ _id: new ObjectId(pontoColetaId) })
    }

    if (!ponto) {
      return NextResponse.json({ success: false, error: "Ponto de coleta não encontrado" }, { status: 404 })
    }

    if (!peso || !tipoMaterial || nivel === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Peso, tipoMaterial e nivel são obrigatórios",
        },
        { status: 400 },
      )
    }

    const coleta: Coleta = {
      pontoColetaId: ponto._id!,
      peso,
      tipoMaterial,
      nivel,
      dataHora: new Date(),
      operador,
      observacoes,
      origem,
      createdAt: new Date(),
    }

    const result = await db.collection<Coleta>("coletas").insertOne(coleta)

    // Atualizar o ponto de coleta com os novos dados
    await db.collection<PontoColeta>("pontos_coleta").updateOne(
      { _id: ponto._id },
      {
        $set: {
          pesoAtual: peso,
          nivelAtual: nivel,
          ultimaColeta: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json(
      {
        success: true,
        data: { _id: result.insertedId, ...coleta },
        message: "Coleta registrada com sucesso",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao registrar coleta:", error)
    return NextResponse.json({ success: false, error: "Erro ao registrar coleta" }, { status: 500 })
  }
}
