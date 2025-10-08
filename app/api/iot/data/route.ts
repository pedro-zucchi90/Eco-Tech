import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Dispositivo } from "@/lib/models/dispositivo"
import type { Coleta } from "@/lib/models/coleta"
import type { PontoColeta } from "@/lib/models/ponto-coleta"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dispositivoId, identificador, peso, nivel, tipoMaterial = "misto" } = body

    if (!identificador || peso === undefined || nivel === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Identificador, peso e nivel são obrigatórios",
        },
        { status: 400 },
      )
    }

    const db = await getDatabase()

    // Buscar dispositivo pelo ID ou identificador
    let dispositivo: Dispositivo | null = null

    if (dispositivoId) {
      dispositivo = await db.collection<Dispositivo>("dispositivos").findOne({ _id: new ObjectId(dispositivoId) })
    } else {
      dispositivo = await db.collection<Dispositivo>("dispositivos").findOne({ identificador })
    }

    if (!dispositivo) {
      return NextResponse.json({ success: false, error: "Dispositivo não encontrado" }, { status: 404 })
    }

    // Atualizar status do dispositivo
    await db.collection<Dispositivo>("dispositivos").updateOne(
      { _id: dispositivo._id },
      {
        $set: {
          status: "online",
          ultimaLeitura: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    // Registrar coleta automática
    const coleta: Coleta = {
      pontoColetaId: dispositivo.pontoColetaId,
      peso,
      tipoMaterial,
      nivel,
      dataHora: new Date(),
      origem: "sensor",
      createdAt: new Date(),
    }

    const result = await db.collection<Coleta>("coletas").insertOne(coleta)

    // Atualizar ponto de coleta
    await db.collection<PontoColeta>("pontos_coleta").updateOne(
      { _id: dispositivo.pontoColetaId },
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
        message: "Dados IoT recebidos e processados com sucesso",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao processar dados IoT:", error)
    return NextResponse.json({ success: false, error: "Erro ao processar dados IoT" }, { status: 500 })
  }
}
