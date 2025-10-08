import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { RegistroColeta } from "@/lib/registro-coleta"
import { gerarCodigoUnico } from "@/lib/codigo-generator"
import { calcularPontos } from "@/lib/usuario"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")

    const db = await getDatabase()
    const query = status ? { status } : {}

    const registros = await db
      .collection<RegistroColeta>("registros_coleta")
      .find(query)
      .sort({ dataRegistro: -1 })
      .toArray()

    return NextResponse.json({ success: true, data: registros })
  } catch (error) {
    console.error("[v0] Erro ao buscar registros:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar registros" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nomeUsuario, emailUsuario, tipoMaterial, pesoKg, pontoColetaId, bairroId } = body

    if (!nomeUsuario || !emailUsuario || !tipoMaterial || !pesoKg) {
      return NextResponse.json(
        { success: false, error: "Nome, email, tipo de material e peso são obrigatórios" },
        { status: 400 },
      )
    }

    const db = await getDatabase()

    // Gerar código único
    const codigo = await gerarCodigoUnico(db)

    // Calcular pontos
    const pontosGanhos = calcularPontos(pesoKg)

    // Código expira em 24 horas
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    const registro: RegistroColeta = {
      codigo,
      nomeUsuario,
      emailUsuario,
      tipoMaterial,
      pesoKg,
      pontosGanhos,
      status: "pendente",
      dataRegistro: new Date(),
      expiresAt,
    }

    if (pontoColetaId) {
      registro.pontoColetaId = new ObjectId(pontoColetaId)
    }

    if (bairroId) {
      registro.bairroId = new ObjectId(bairroId)
    }

    const result = await db.collection<RegistroColeta>("registros_coleta").insertOne(registro)

    return NextResponse.json(
      {
        success: true,
        data: { _id: result.insertedId, ...registro },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Erro ao criar registro:", error)
    return NextResponse.json({ success: false, error: "Erro ao criar registro" }, { status: 500 })
  }
}
