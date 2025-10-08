import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface RelatorioData {
  periodo: string
  totalColetas: number
  pesoTotal: number
  pontosAtivos: number
  coletasPorBairro: Array<{
    bairro: string
    coletas: number
    peso: number
  }>
  coletasPorMaterial: Array<{
    material: string
    coletas: number
    peso: number
  }>
  pontosSemColeta: Array<{
    nome: string
    endereco: string
    ultimaColeta: string
  }>
}

export function gerarRelatorioPDF(data: RelatorioData): jsPDF {
  const doc = new jsPDF()

  // Cabeçalho
  doc.setFillColor(46, 204, 113) // Verde EcoTech
  doc.rect(0, 0, 210, 40, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.text("EcoTech DataFlow", 105, 20, { align: "center" })

  doc.setFontSize(14)
  doc.text("Relatório de Coleta Seletiva", 105, 30, { align: "center" })

  // Resetar cor do texto
  doc.setTextColor(0, 0, 0)

  // Informações do período
  doc.setFontSize(12)
  doc.text(`Período: ${data.periodo}`, 14, 50)
  doc.text(`Data de geração: ${new Date().toLocaleDateString("pt-BR")}`, 14, 57)

  // Resumo geral
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Resumo Geral", 14, 70)

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")

  const resumoY = 78
  doc.text(`Total de Coletas: ${data.totalColetas}`, 14, resumoY)
  doc.text(`Peso Total Coletado: ${data.pesoTotal.toFixed(2)} kg`, 14, resumoY + 7)
  doc.text(`Pontos Ativos: ${data.pontosAtivos}`, 14, resumoY + 14)

  // Tabela: Coletas por Bairro
  let currentY = resumoY + 25

  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Coletas por Bairro", 14, currentY)

  autoTable(doc, {
    startY: currentY + 5,
    head: [["Bairro", "Coletas", "Peso (kg)"]],
    body: data.coletasPorBairro.map((item) => [item.bairro, item.coletas.toString(), item.peso.toFixed(2)]),
    theme: "grid",
    headStyles: { fillColor: [46, 204, 113] },
  })

  currentY = (doc as any).lastAutoTable.finalY + 15

  // Tabela: Coletas por Material
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Coletas por Tipo de Material", 14, currentY)

  autoTable(doc, {
    startY: currentY + 5,
    head: [["Material", "Coletas", "Peso (kg)"]],
    body: data.coletasPorMaterial.map((item) => [item.material, item.coletas.toString(), item.peso.toFixed(2)]),
    theme: "grid",
    headStyles: { fillColor: [52, 152, 219] },
  })

  // Pontos sem coleta (se houver)
  if (data.pontosSemColeta.length > 0) {
    currentY = (doc as any).lastAutoTable.finalY + 15

    // Adicionar nova página se necessário
    if (currentY > 250) {
      doc.addPage()
      currentY = 20
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Pontos sem Coleta no Período", 14, currentY)

    autoTable(doc, {
      startY: currentY + 5,
      head: [["Nome", "Endereço", "Última Coleta"]],
      body: data.pontosSemColeta.map((item) => [item.nome, item.endereco, item.ultimaColeta]),
      theme: "grid",
      headStyles: { fillColor: [231, 76, 60] },
    })
  }

  // Rodapé
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setTextColor(128, 128, 128)
    doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: "center" })
    doc.text("EcoTech DataFlow - Sistema de Gestão de Coleta Seletiva", 105, 285, { align: "center" })
  }

  return doc
}
