import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Bairro } from "@/lib/models/bairro"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const bairro = await db.collection<Bairro>("bairros").findOne({ _id: new ObjectId(id) })

    if (!bairro) {
      return NextResponse.json({ success: false, error: "Bairro não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: bairro })
  } catch (error) {
    console.error("Erro ao buscar bairro:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar bairro" }, { status: 500 })
  }
}
