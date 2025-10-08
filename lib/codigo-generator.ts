export function gerarCodigoColeta(): string {
  // Gera código de 6 dígitos
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function verificarCodigoUnico(db: any, codigo: string): Promise<boolean> {
  const existe = await db.collection("registros_coleta").findOne({ codigo })
  return !existe
}

export async function gerarCodigoUnico(db: any): Promise<string> {
  let codigo = gerarCodigoColeta()
  let tentativas = 0

  while (!(await verificarCodigoUnico(db, codigo)) && tentativas < 10) {
    codigo = gerarCodigoColeta()
    tentativas++
  }

  return codigo
}
