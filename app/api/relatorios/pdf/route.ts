import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tipo = searchParams.get("tipo") || "diario"
    const dataInicio = searchParams.get("dataInicio")
    const dataFim = searchParams.get("dataFim")

    // Buscar dados do relatório
    const baseUrl = process.env.APP_URL || "http://localhost:3000"
    let url = `${baseUrl}/api/relatorios?tipo=${tipo}`

    if (dataInicio) url += `&dataInicio=${dataInicio}`
    if (dataFim) url += `&dataFim=${dataFim}`

    const response = await fetch(url)
    const data = await response.json()

    if (!data.success) {
      return NextResponse.json({ success: false, error: "Erro ao buscar dados do relatório" }, { status: 500 })
    }

    const relatorio = data.data

    // Formatar período
    const periodoInicio = new Date(relatorio.periodo.inicio).toLocaleDateString("pt-BR")
    const periodoFim = new Date(relatorio.periodo.fim).toLocaleDateString("pt-BR")
    const periodoTexto = `${periodoInicio} a ${periodoFim}`

    // Preparar dados para o PDF
    const pdfData = {
      periodo: periodoTexto,
      totalColetas: relatorio.resumo.totalColetas,
      pesoTotal: relatorio.resumo.pesoTotal,
      pontosAtivos: relatorio.resumo.pontosAtivos,
      coletasPorBairro: relatorio.coletasPorBairro,
      coletasPorMaterial: relatorio.coletasPorMaterial,
      pontosSemColeta: relatorio.pontosSemColeta,
    }

    // Retornar dados para geração do PDF no cliente
    return NextResponse.json({
      success: true,
      data: pdfData,
    })
  } catch (error) {
    console.error("Erro ao preparar PDF:", error)
    return NextResponse.json({ success: false, error: "Erro ao preparar PDF" }, { status: 500 })
  }
}
