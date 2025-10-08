const API_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const results = [];

async function testEndpoint(endpoint, method, body) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    return {
      success: response.ok,
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
    };
  }
}

async function runTests() {
  console.log("=".repeat(60));
  console.log("TESTE DE API - EcoTech DataFlow");
  console.log("=".repeat(60));
  console.log(`API URL: ${API_URL}`);
  console.log("=".repeat(60));
  console.log("");

  // Teste 1: Listar bairros
  console.log("[v0] Testando GET /api/bairros...");
  const bairrosTest = await testEndpoint("/api/bairros", "GET");
  results.push({
    endpoint: "/api/bairros",
    method: "GET",
    status: bairrosTest.success ? "✓" : "✗",
    statusCode: bairrosTest.status,
    message: bairrosTest.success ? `${bairrosTest.data.data.length} bairros encontrados` : "Falha ao buscar bairros",
  });

  // Guardar ID do primeiro bairro para testes
  const bairroId = bairrosTest.data && bairrosTest.data.data && bairrosTest.data.data[0] && bairrosTest.data.data[0]._id;

  // Teste 2: Buscar bairro específico
  if (bairroId) {
    console.log(`[v0] Testando GET /api/bairros/${bairroId}...`);
    const bairroTest = await testEndpoint(`/api/bairros/${bairroId}`, "GET");
    results.push({
      endpoint: `/api/bairros/${bairroId}`,
      method: "GET",
      status: bairroTest.success ? "✓" : "✗",
      statusCode: bairroTest.status,
      message: bairroTest.success ? `Bairro: ${bairroTest.data.data.nome}` : "Falha ao buscar bairro",
    });
  }

  // Teste 3: Listar pontos de coleta
  console.log("[v0] Testando GET /api/pontos-coleta...");
  const pontosTest = await testEndpoint("/api/pontos-coleta", "GET");
  results.push({
    endpoint: "/api/pontos-coleta",
    method: "GET",
    status: pontosTest.success ? "✓" : "✗",
    statusCode: pontosTest.status,
    message: pontosTest.success
      ? `${pontosTest.data.data.length} pontos encontrados`
      : "Falha ao buscar pontos de coleta",
  });

  // Guardar ID do primeiro ponto para testes
  const pontoId = pontosTest.data && pontosTest.data.data && pontosTest.data.data[0] && pontosTest.data.data[0]._id;
  const qrCode = pontosTest.data && pontosTest.data.data && pontosTest.data.data[0] && pontosTest.data.data[0].qrCode;

  // Teste 4: Buscar ponto específico
  if (pontoId) {
    console.log(`[v0] Testando GET /api/pontos-coleta/${pontoId}...`);
    const pontoTest = await testEndpoint(`/api/pontos-coleta/${pontoId}`, "GET");
    results.push({
      endpoint: `/api/pontos-coleta/${pontoId}`,
      method: "GET",
      status: pontoTest.success ? "✓" : "✗",
      statusCode: pontoTest.status,
      message: pontoTest.success ? `Ponto: ${pontoTest.data.data.nome}` : "Falha ao buscar ponto",
    });

    // Teste 5: Buscar QR Code do ponto
    console.log(`[v0] Testando GET /api/pontos-coleta/${pontoId}/qrcode...`);
    const qrcodeTest = await testEndpoint(`/api/pontos-coleta/${pontoId}/qrcode`, "GET");
    results.push({
      endpoint: `/api/pontos-coleta/${pontoId}/qrcode`,
      method: "GET",
      status: qrcodeTest.success ? "✓" : "✗",
      statusCode: qrcodeTest.status,
      message: qrcodeTest.success ? `QR Code: ${qrcodeTest.data.data.qrCode}` : "Falha ao gerar QR Code",
    });
  }

  // Teste 6: Registrar coleta via QR Code
  if (qrCode) {
    console.log("[v0] Testando POST /api/coletas (via QR Code)...");
    const coletaTest = await testEndpoint("/api/coletas", "POST", {
      qrCode: qrCode,
      peso: 12.5,
      tipoMaterial: "plástico",
      nivel: 45,
      operador: "João Silva",
      origem: "qrcode",
    });
    results.push({
      endpoint: "/api/coletas",
      method: "POST",
      status: coletaTest.success ? "✓" : "✗",
      statusCode: coletaTest.status,
      message: coletaTest.success ? "Coleta registrada com sucesso" : "Falha ao registrar coleta",
    });
  }

  // Teste 7: Listar coletas
  console.log("[v0] Testando GET /api/coletas...");
  const coletasTest = await testEndpoint("/api/coletas", "GET");
  results.push({
    endpoint: "/api/coletas",
    method: "GET",
    status: coletasTest.success ? "✓" : "✗",
    statusCode: coletasTest.status,
    message: coletasTest.success ? `${coletasTest.data.data.length} coletas encontradas` : "Falha ao buscar coletas",
  });

  // Teste 8: Listar dispositivos
  console.log("[v0] Testando GET /api/dispositivos...");
  const dispositivosTest = await testEndpoint("/api/dispositivos", "GET");
  results.push({
    endpoint: "/api/dispositivos",
    method: "GET",
    status: dispositivosTest.success ? "✓" : "✗",
    statusCode: dispositivosTest.status,
    message: dispositivosTest.success
      ? `${dispositivosTest.data.data.length} dispositivos encontrados`
      : "Falha ao buscar dispositivos",
  });

  // Guardar identificador do primeiro dispositivo
  const dispositivoId = dispositivosTest.data && dispositivosTest.data.data && dispositivosTest.data.data[0] && dispositivosTest.data.data[0].identificador;

  // Teste 9: Enviar dados IoT
  if (dispositivoId) {
    console.log("[v0] Testando POST /api/iot/data...");
    const iotTest = await testEndpoint("/api/iot/data", "POST", {
      identificador: dispositivoId,
      peso: 15.3,
      nivel: 52,
      tipoMaterial: "papel",
    });
    results.push({
      endpoint: "/api/iot/data",
      method: "POST",
      status: iotTest.success ? "✓" : "✗",
      statusCode: iotTest.status,
      message: iotTest.success ? "Dados IoT processados com sucesso" : "Falha ao processar dados IoT",
    });
  }

  // Teste 10: Gerar relatório
  console.log("[v0] Testando GET /api/relatorios?tipo=diario...");
  const relatorioTest = await testEndpoint("/api/relatorios?tipo=diario", "GET");
  results.push({
    endpoint: "/api/relatorios?tipo=diario",
    method: "GET",
    status: relatorioTest.success ? "✓" : "✗",
    statusCode: relatorioTest.status,
    message: relatorioTest.success
      ? `Relatório: ${relatorioTest.data.data.resumo.totalColetas} coletas`
      : "Falha ao gerar relatório",
  });

  // Exibir resultados
  console.log("\n" + "=".repeat(60));
  console.log("RESULTADOS DOS TESTES");
  console.log("=".repeat(60));

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    console.log(`\n${result.status} ${result.method} ${result.endpoint}`);
    console.log(`   Status: ${result.statusCode}`);
    console.log(`   ${result.message}`);
  }

  const totalTests = results.length;
  const passedTests = results.filter(function(r) { return r.status === "✓"; }).length;
  const failedTests = totalTests - passedTests;

  console.log("\n" + "=".repeat(60));
  console.log(`Total: ${totalTests} testes`);
  console.log(`Passou: ${passedTests} ✓`);
  console.log(`Falhou: ${failedTests} ✗`);
  console.log("=".repeat(60));

  if (failedTests === 0) {
    console.log("\n[v0] ✓ Todos os testes passaram!");
  } else {
    console.log("\n[v0] ✗ Alguns testes falharam. Verifique a API.");
  }
}

// Executar testes
runTests();
