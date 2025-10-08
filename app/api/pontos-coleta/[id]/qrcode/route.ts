import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { PontoColeta } from "@/lib/models/ponto-coleta"
import { generateQRCode } from "@/lib/qrcode-generator"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()

    const ponto = await db.collection<PontoColeta>("pontos_coleta").findOne({ _id: new ObjectId(id) })

    if (!ponto) {
      return NextResponse.json({ success: false, error: "Ponto de coleta não encontrado" }, { status: 404 })
    }

    // Gerar QR Code com o código do ponto
    const qrCodeDataURL = await generateQRCode(ponto.qrCode)

    return NextResponse.json({
      success: true,
      data: {
        qrCode: ponto.qrCode,
        qrCodeImage: qrCodeDataURL,
        pontoId: ponto._id,
        nome: ponto.nome,
      },
    })
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error)
    return NextResponse.json({ success: false, error: "Erro ao gerar QR Code" }, { status: 500 })
  }
}
