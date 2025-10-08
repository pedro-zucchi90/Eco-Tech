import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Dispositivo } from "@/lib/models/dispositivo"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pontoColetaId = searchParams.get("pontoColetaId")

    const db = await getDatabase()
    const query = pontoColetaId ? { pontoColetaId: new ObjectId(pontoColetaId) } : {}

    const dispositivos = await db
      .collection<Dispositivo>("dispositivos")
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
        { $sort: { createdAt: -1 } },
      ])
      .toArray()

    return NextResponse.json({ success: true, data: dispositivos })
  } catch (error) {
    console.error("Erro ao buscar dispositivos:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar dispositivos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pontoColetaId, tipo, identificador, bateria, configuracao } = body

    if (!pontoColetaId || !tipo || !identificador) {
      return NextResponse.json(
        {
          success: false,
          error: "pontoColetaId, tipo e identificador são obrigatórios",
        },
        { status: 400 },
      )
    }

    const db = await getDatabase()

    // Verificar se o ponto de coleta existe
    const ponto = await db.collection("pontos_coleta").findOne({ _id: new ObjectId(pontoColetaId) })
    if (!ponto) {
      return NextResponse.json({ success: false, error: "Ponto de coleta não encontrado" }, { status: 404 })
    }

    // Verificar se já existe um dispositivo com esse identificador
    const dispositivoExistente = await db.collection<Dispositivo>("dispositivos").findOne({ identificador })
    if (dispositivoExistente) {
      return NextResponse.json(
        { success: false, error: "Já existe um dispositivo com esse identificador" },
        { status: 400 },
      )
    }

    const dispositivo: Dispositivo = {
      pontoColetaId: new ObjectId(pontoColetaId),
      tipo,
      identificador,
      status: "offline",
      bateria,
      configuracao,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Dispositivo>("dispositivos").insertOne(dispositivo)

    return NextResponse.json(
      {
        success: true,
        data: { _id: result.insertedId, ...dispositivo },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao criar dispositivo:", error)
    return NextResponse.json({ success: false, error: "Erro ao criar dispositivo" }, { status: 500 })
  }
}
