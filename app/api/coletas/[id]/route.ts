import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Coleta } from "@/lib/models/coleta"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()

    const coleta = await db
      .collection<Coleta>("coletas")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "pontos_coleta",
            localField: "pontoColetaId",
            foreignField: "_id",
            as: "pontoColeta",
          },
        },
        { $unwind: { path: "$pontoColeta", preserveNullAndEmptyArrays: true } },
      ])
      .toArray()

    if (!coleta || coleta.length === 0) {
      return NextResponse.json({ success: false, error: "Coleta não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: coleta[0] })
  } catch (error) {
    console.error("Erro ao buscar coleta:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar coleta" }, { status: 500 })
  }
}
