import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { PontoColeta } from "@/lib/models/ponto-coleta"
import { generateUniqueCode } from "@/lib/qrcode-generator"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const bairroId = searchParams.get("bairroId")

    const db = await getDatabase()
    const query = bairroId ? { bairroId: new ObjectId(bairroId) } : {}

    const pontos = await db
      .collection<PontoColeta>("pontos_coleta")
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: "bairros",
            localField: "bairroId",
            foreignField: "_id",
            as: "bairro",
          },
        },
        { $unwind: { path: "$bairro", preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 } },
      ])
      .toArray()

    return NextResponse.json({ success: true, data: pontos })
  } catch (error) {
    console.error("Erro ao buscar pontos de coleta:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar pontos de coleta" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, endereco, bairroId, latitude, longitude, tipoMaterial, capacidadeMaxima } = body

    if (!nome || !endereco || !bairroId || !tipoMaterial || !capacidadeMaxima) {
      return NextResponse.json(
        {
          success: false,
          error: "Nome, endereço, bairroId, tipoMaterial e capacidadeMaxima são obrigatórios",
        },
        { status: 400 },
      )
    }

    const db = await getDatabase()

    // Verificar se o bairro existe
    const bairro = await db.collection("bairros").findOne({ _id: new ObjectId(bairroId) })
    if (!bairro) {
      return NextResponse.json({ success: false, error: "Bairro não encontrado" }, { status: 404 })
    }

    // Gerar código QR único
    const qrCode = generateUniqueCode("PC")

    const ponto: PontoColeta = {
      nome,
      endereco,
      bairroId: new ObjectId(bairroId),
      latitude,
      longitude,
      qrCode,
      status: "ativo",
      tipoMaterial: Array.isArray(tipoMaterial) ? tipoMaterial : [tipoMaterial],
      capacidadeMaxima,
      nivelAtual: 0,
      pesoAtual: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<PontoColeta>("pontos_coleta").insertOne(ponto)

    return NextResponse.json(
      {
        success: true,
        data: { _id: result.insertedId, ...ponto },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao criar ponto de coleta:", error)
    return NextResponse.json({ success: false, error: "Erro ao criar ponto de coleta" }, { status: 500 })
  }
}
