import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Usuario } from "@/lib/usuario"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get("email")

    const db = await getDatabase()
    const query = email ? { email } : {}

    const usuarios = await db.collection<Usuario>("usuarios").find(query).sort({ pontos: -1 }).toArray()

    return NextResponse.json({ success: true, data: usuarios })
  } catch (error) {
    console.error("[v0] Erro ao buscar usuários:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar usuários" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, email, telefone } = body

    if (!nome || !email) {
      return NextResponse.json({ success: false, error: "Nome e email são obrigatórios" }, { status: 400 })
    }

    const db = await getDatabase()

    // Verificar se já existe
    const existente = await db.collection("usuarios").findOne({ email })
    if (existente) {
      return NextResponse.json({ success: false, error: "Email já cadastrado" }, { status: 400 })
    }

    const usuario: Usuario = {
      nome,
      email,
      telefone,
      pontos: 0,
      nivel: 1,
      badges: [],
      coletasRealizadas: 0,
      pesoTotalColetado: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Usuario>("usuarios").insertOne(usuario)

    return NextResponse.json(
      {
        success: true,
        data: { _id: result.insertedId, ...usuario },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Erro ao criar usuário:", error)
    return NextResponse.json({ success: false, error: "Erro ao criar usuário" }, { status: 500 })
  }
}
