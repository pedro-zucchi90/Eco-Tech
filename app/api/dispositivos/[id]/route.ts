import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Dispositivo } from "@/lib/models/dispositivo"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()

    const dispositivo = await db
      .collection<Dispositivo>("dispositivos")
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

    if (!dispositivo || dispositivo.length === 0) {
      return NextResponse.json({ success: false, error: "Dispositivo não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: dispositivo[0] })
  } catch (error) {
    console.error("Erro ao buscar dispositivo:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar dispositivo" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, bateria, configuracao } = body

    const db = await getDatabase()

    const updateData: Partial<Dispositivo> = {
      updatedAt: new Date(),
    }

    if (status) updateData.status = status
    if (bateria !== undefined) updateData.bateria = bateria
    if (configuracao) updateData.configuracao = configuracao

    const result = await db
      .collection<Dispositivo>("dispositivos")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Dispositivo não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Dispositivo atualizado com sucesso" })
  } catch (error) {
    console.error("Erro ao atualizar dispositivo:", error)
    return NextResponse.json({ success: false, error: "Erro ao atualizar dispositivo" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()

    const result = await db.collection<Dispositivo>("dispositivos").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Dispositivo não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Dispositivo removido com sucesso" })
  } catch (error) {
    console.error("Erro ao remover dispositivo:", error)
    return NextResponse.json({ success: false, error: "Erro ao remover dispositivo" }, { status: 500 })
  }
}
