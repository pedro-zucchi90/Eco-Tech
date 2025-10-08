const API_URL = process.env.NEXT_PUBLIC_APP_URL;
const INTERVALO_ENVIO = 10000; // 10 segundos

// Definição do "tipo" DispositivoSimulado apenas como comentário para referência
// {
//   identificador: string,
//   pontoColetaId: string,
//   pesoAtual: number,
//   nivelAtual: number,
//   incrementoPeso: number,
//   incrementoNivel: number
// }

const dispositivos = [];

async function buscarDispositivos() {
  try {
    const response = await fetch(`${API_URL}/api/dispositivos`);
    const data = await response.json();

    if (data.success && data.data.length > 0) {
      dispositivos.length = 0;
      data.data.forEach((disp) => {
        dispositivos.push({
          identificador: disp.identificador,
          pontoColetaId: disp.pontoColetaId,
          pesoAtual: 0,
          nivelAtual: 0,
          incrementoPeso: Math.random() * 2 + 0.5, // 0.5 a 2.5 kg por leitura
          incrementoNivel: Math.random() * 5 + 2, // 2 a 7% por leitura
        });
      });
      console.log(`[v0] ${dispositivos.length} dispositivos carregados para simulação`);
    } else {
      console.log("[v0] Nenhum dispositivo encontrado. Aguardando cadastro...");
    }
  } catch (error) {
    console.error("[v0] Erro ao buscar dispositivos:", error);
  }
}

async function enviarLeitura(dispositivo) {
  try {
    // Incrementar valores simulados
    dispositivo.pesoAtual += dispositivo.incrementoPeso;
    dispositivo.nivelAtual += dispositivo.incrementoNivel;

    // Limitar valores máximos
    if (dispositivo.nivelAtual > 100) {
      dispositivo.nivelAtual = 100;
      dispositivo.pesoAtual = Math.min(dispositivo.pesoAtual, 100); // Assumindo capacidade máxima de 100kg
    }

    const payload = {
      identificador: dispositivo.identificador,
      peso: Number.parseFloat(dispositivo.pesoAtual.toFixed(2)),
      nivel: Number.parseFloat(dispositivo.nivelAtual.toFixed(2)),
      tipoMaterial: "misto",
    };

    const response = await fetch(`${API_URL}/api/iot/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.success) {
      console.log(`[v0] ✓ ${dispositivo.identificador}: Peso=${payload.peso}kg, Nível=${payload.nivel}%`);

      // Resetar quando atingir 100%
      if (dispositivo.nivelAtual >= 100) {
        console.log(`[v0] ⚠ ${dispositivo.identificador}: Recipiente cheio! Resetando...`);
        dispositivo.pesoAtual = 0;
        dispositivo.nivelAtual = 0;
      }
    } else {
      console.error(`[v0] ✗ Erro ao enviar dados: ${data.error}`);
    }
  } catch (error) {
    console.error(`[v0] ✗ Erro ao enviar leitura para ${dispositivo.identificador}:`, error);
  }
}

async function iniciarSimulacao() {
  console.log("=".repeat(60));
  console.log("SIMULADOR IoT - EcoTech DataFlow");
  console.log("=".repeat(60));
  console.log(`API URL: ${API_URL}`);
  console.log(`Intervalo de envio: ${INTERVALO_ENVIO / 1000}s`);
  console.log("=".repeat(60));

  // Buscar dispositivos inicialmente
  await buscarDispositivos();

  // Atualizar lista de dispositivos a cada 30 segundos
  setInterval(buscarDispositivos, 30000);

  // Enviar leituras periodicamente
  setInterval(async () => {
    if (dispositivos.length === 0) {
      console.log("[v0] Aguardando dispositivos...");
      return;
    }

    console.log(`\n[v0] Enviando leituras (${new Date().toLocaleTimeString()})...`);

    for (const dispositivo of dispositivos) {
      await enviarLeitura(dispositivo);
      // Pequeno delay entre envios
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }, INTERVALO_ENVIO);
}

// Iniciar simulação
iniciarSimulacao();

// Manter o processo rodando
process.on("SIGINT", () => {
  console.log("\n[v0] Simulador encerrado.");
  process.exit(0);
});
