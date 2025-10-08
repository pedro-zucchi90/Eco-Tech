import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Bairro } from "@/lib/models/bairro"

export async function GET() {
  try {
    const db = await getDatabase()
    const bairros = await db.collection<Bairro>("bairros").find({}).sort({ nome: 1 }).toArray()

    return NextResponse.json({ success: true, data: bairros })
  } catch (error) {
    console.error("Erro ao buscar bairros:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar bairros" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, cidade, estado, populacao } = body

    if (!nome || !cidade || !estado) {
      return NextResponse.json({ success: false, error: "Nome, cidade e estado são obrigatórios" }, { status: 400 })
    }

    const db = await getDatabase()
    const bairro: Bairro = {
      nome,
      cidade,
      estado,
      populacao,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Bairro>("bairros").insertOne(bairro)

    return NextResponse.json(
      {
        success: true,
        data: { _id: result.insertedId, ...bairro },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao criar bairro:", error)
    return NextResponse.json({ success: false, error: "Erro ao criar bairro" }, { status: 500 })
  }
}
