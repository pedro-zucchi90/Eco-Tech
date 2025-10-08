import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { PontoColeta } from "@/lib/models/ponto-coleta"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()

    const ponto = await db
      .collection<PontoColeta>("pontos_coleta")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "bairros",
            localField: "bairroId",
            foreignField: "_id",
            as: "bairro",
          },
        },
        { $unwind: { path: "$bairro", preserveNullAndEmptyArrays: true } },
      ])
      .toArray()

    if (!ponto || ponto.length === 0) {
      return NextResponse.json({ success: false, error: "Ponto de coleta não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: ponto[0] })
  } catch (error) {
    console.error("Erro ao buscar ponto de coleta:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar ponto de coleta" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nome, endereco, latitude, longitude, status, tipoMaterial, capacidadeMaxima } = body

    const db = await getDatabase()

    const updateData: Partial<PontoColeta> = {
      updatedAt: new Date(),
    }

    if (nome) updateData.nome = nome
    if (endereco) updateData.endereco = endereco
    if (latitude !== undefined) updateData.latitude = latitude
    if (longitude !== undefined) updateData.longitude = longitude
    if (status) updateData.status = status
    if (tipoMaterial) updateData.tipoMaterial = Array.isArray(tipoMaterial) ? tipoMaterial : [tipoMaterial]
    if (capacidadeMaxima !== undefined) updateData.capacidadeMaxima = capacidadeMaxima

    const result = await db
      .collection<PontoColeta>("pontos_coleta")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Ponto de coleta não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Ponto de coleta atualizado com sucesso" })
  } catch (error) {
    console.error("Erro ao atualizar ponto de coleta:", error)
    return NextResponse.json({ success: false, error: "Erro ao atualizar ponto de coleta" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()

    const result = await db.collection<PontoColeta>("pontos_coleta").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Ponto de coleta não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Ponto de coleta removido com sucesso" })
  } catch (error) {
    console.error("Erro ao remover ponto de coleta:", error)
    return NextResponse.json({ success: false, error: "Erro ao remover ponto de coleta" }, { status: 500 })
  }
}
