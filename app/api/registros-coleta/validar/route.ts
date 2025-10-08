import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { calcularNivel, BADGES } from "@/lib/usuario"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { codigo } = body

    if (!codigo) {
      return NextResponse.json({ success: false, error: "Código é obrigatório" }, { status: 400 })
    }

    const db = await getDatabase()

    // Buscar registro
    const registro = await db.collection("registros_coleta").findOne({ codigo })

    if (!registro) {
      return NextResponse.json({ success: false, error: "Código não encontrado" }, { status: 404 })
    }

    if (registro.status === "validado") {
      return NextResponse.json({ success: false, error: "Código já foi validado" }, { status: 400 })
    }

    if (new Date() > new Date(registro.expiresAt)) {
      await db.collection("registros_coleta").updateOne({ _id: registro._id }, { $set: { status: "expirado" } })
      return NextResponse.json({ success: false, error: "Código expirado" }, { status: 400 })
    }

    let usuario = await db.collection("usuarios").findOne({ email: registro.emailUsuario })

    if (!usuario) {
      // Create new user
      const novoUsuario = {
        nome: registro.nomeUsuario,
        email: registro.emailUsuario,
        pontos: 0,
        nivel: 1,
        badges: [],
        coletasRealizadas: 0,
        pesoTotalColetado: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await db.collection("usuarios").insertOne(novoUsuario)
      usuario = { _id: result.insertedId, ...novoUsuario }
    }

    const novosPontos = usuario.pontos + registro.pontosGanhos
    const novoNivel = calcularNivel(novosPontos)
    const novasColetas = usuario.coletasRealizadas + 1
    const novoPeso = usuario.pesoTotalColetado + registro.pesoKg

    // Verificar novos badges
    const novosBadges = [...usuario.badges]
    const badgesGanhos: string[] = []

    for (const badge of BADGES) {
      if (!novosBadges.includes(badge.id)) {
        if (badge.tipo === "coletas" && novasColetas >= badge.requisito) {
          novosBadges.push(badge.id)
          badgesGanhos.push(badge.nome)
        } else if (badge.tipo === "peso" && novoPeso >= badge.requisito) {
          novosBadges.push(badge.id)
          badgesGanhos.push(badge.nome)
        }
      }
    }

    await db.collection("usuarios").updateOne(
      { _id: usuario._id },
      {
        $set: {
          pontos: novosPontos,
          nivel: novoNivel,
          badges: novosBadges,
          coletasRealizadas: novasColetas,
          pesoTotalColetado: novoPeso,
          updatedAt: new Date(),
        },
      },
    )

    await db.collection("registros_coleta").updateOne(
      { _id: registro._id },
      {
        $set: {
          status: "validado",
          dataValidacao: new Date(),
          usuarioId: usuario._id,
          badgesGanhos,
        },
      },
    )

    // Atualizar ponto de coleta se existir
    if (registro.pontoColetaId) {
      const ponto = await db.collection("pontos_coleta").findOne({ _id: registro.pontoColetaId })
      if (ponto) {
        const novoPeso = ponto.pesoAtual + registro.pesoKg
        const novoNivel = (novoPeso / ponto.capacidadeMaxima) * 100

        await db.collection("pontos_coleta").updateOne(
          { _id: registro.pontoColetaId },
          {
            $set: {
              pesoAtual: novoPeso,
              nivelAtual: novoNivel,
              ultimaColeta: new Date(),
              updatedAt: new Date(),
            },
          },
        )
      }
    }

    const usuarioAtualizado = {
      pontos: novosPontos,
      nivel: novoNivel,
      badges: novosBadges,
      coletasRealizadas: novasColetas,
      pesoTotalColetado: novoPeso,
      pontosGanhos: registro.pontosGanhos,
      badgesGanhos,
    }

    return NextResponse.json({
      success: true,
      data: {
        registro: { ...registro, status: "validado", dataValidacao: new Date(), badgesGanhos },
        usuario: usuarioAtualizado,
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao validar código:", error)
    return NextResponse.json({ success: false, error: "Erro ao validar código" }, { status: 500 })
  }
}
