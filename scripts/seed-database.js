const { MongoClient, ObjectId } = require("mongodb");

const MONGODB_URI = "mongodb://127.0.0.1:27017/ecotech_definitivo";

// Dados de seed
const usuarios = [
  {
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 98765-4321",
  },
  {
    nome: "Maria Santos",
    email: "maria.santos@email.com",
    telefone: "(11) 97654-3210",
  },
  {
    nome: "Pedro Oliveira",
    email: "pedro.oliveira@email.com",
    telefone: "(11) 96543-2109",
  },
  {
    nome: "Ana Costa",
    email: "ana.costa@email.com",
  },
  {
    nome: "Carlos Ferreira",
    email: "carlos.ferreira@email.com",
    telefone: "(11) 95432-1098",
  },
];

const bairros = [
  {
    nome: "Centro",
    cidade: "São Paulo",
    estado: "SP",
    populacao: 45000,
  },
  {
    nome: "Jardim Paulista",
    cidade: "São Paulo",
    estado: "SP",
    populacao: 32000,
  },
  {
    nome: "Vila Mariana",
    cidade: "São Paulo",
    estado: "SP",
    populacao: 28000,
  },
  {
    nome: "Pinheiros",
    cidade: "São Paulo",
    estado: "SP",
    populacao: 38000,
  },
  {
    nome: "Mooca",
    cidade: "São Paulo",
    estado: "SP",
    populacao: 25000,
  },
];

const pontosColeta = [
  {
    nome: "Praça da Sé - Ponto 1",
    endereco: "Praça da Sé, s/n - Centro",
    bairroNome: "Centro",
    latitude: -23.550164,
    longitude: -46.634043,
    tipoMaterial: ["plástico", "papel", "metal"],
    capacidadeMaxima: 100,
  },
  {
    nome: "Av. Paulista - Ponto 2",
    endereco: "Av. Paulista, 1578 - Bela Vista",
    bairroNome: "Centro",
    latitude: -23.561414,
    longitude: -46.656178,
    tipoMaterial: ["plástico", "papel", "vidro"],
    capacidadeMaxima: 120,
  },
  {
    nome: "Parque Ibirapuera - Entrada Principal",
    endereco: "Av. Pedro Álvares Cabral - Vila Mariana",
    bairroNome: "Vila Mariana",
    latitude: -23.587416,
    longitude: -46.657634,
    tipoMaterial: ["plástico", "papel", "metal", "vidro"],
    capacidadeMaxima: 150,
  },
  {
    nome: "Shopping Jardim Sul",
    endereco: "Av. Giovanni Gronchi, 5819 - Jardim Paulista",
    bairroNome: "Jardim Paulista",
    latitude: -23.628394,
    longitude: -46.719419,
    tipoMaterial: ["plástico", "papel"],
    capacidadeMaxima: 80,
  },
  {
    nome: "Largo da Batata",
    endereco: "Largo da Batata - Pinheiros",
    bairroNome: "Pinheiros",
    latitude: -23.561684,
    longitude: -46.690647,
    tipoMaterial: ["plástico", "papel", "metal"],
    capacidadeMaxima: 100,
  },
  {
    nome: "Parque da Mooca",
    endereco: "Rua Taquari, 549 - Mooca",
    bairroNome: "Mooca",
    latitude: -23.577621,
    longitude: -46.599277,
    tipoMaterial: ["plástico", "papel", "vidro", "metal"],
    capacidadeMaxima: 110,
  },
  {
    nome: "Terminal Pinheiros",
    endereco: "Av. Pedroso de Morais - Pinheiros",
    bairroNome: "Pinheiros",
    latitude: -23.561389,
    longitude: -46.690278,
    tipoMaterial: ["plástico", "papel"],
    capacidadeMaxima: 90,
  },
  {
    nome: "Mercado Municipal",
    endereco: "Rua da Cantareira, 306 - Centro",
    bairroNome: "Centro",
    latitude: -23.541389,
    longitude: -46.630278,
    tipoMaterial: ["plástico", "papel", "vidro"],
    capacidadeMaxima: 130,
  },
];

function generateQRCode(prefix = "PC") {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
}

async function seedDatabase() {
  console.log("=".repeat(60));
  console.log("SEED DATABASE - EcoTech DataFlow");
  console.log("=".repeat(60));
  console.log(`MongoDB URI: ${MONGODB_URI}`);
  console.log("=".repeat(60));

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("[v0] ✓ Conectado ao MongoDB");

    const db = client.db();

    // Limpar coleções existentes
    console.log("\n[v0] Limpando coleções existentes...");
    await db.collection("bairros").deleteMany({});
    await db.collection("pontos_coleta").deleteMany({});
    await db.collection("dispositivos").deleteMany({});
    await db.collection("coletas").deleteMany({});
    await db.collection("usuarios").deleteMany({});
    await db.collection("registros_coleta").deleteMany({});
    console.log("[v0] ✓ Coleções limpas");

    // Inserir usuários
    console.log("\n[v0] Inserindo usuários...");
    const usuariosData = usuarios.map((u) => ({
      ...u,
      pontos: 0,
      nivel: 1,
      badges: [],
      coletasRealizadas: 0,
      pesoTotalColetado: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const usuariosResult = await db.collection("usuarios").insertMany(usuariosData);
    console.log(`[v0] ✓ ${usuariosResult.insertedCount} usuários inseridos`);

    // Inserir bairros
    console.log("\n[v0] Inserindo bairros...");
    const bairrosData = bairros.map((b) => ({
      ...b,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const bairrosResult = await db.collection("bairros").insertMany(bairrosData);
    console.log(`[v0] ✓ ${bairrosResult.insertedCount} bairros inseridos`);

    // Criar mapa de bairros por nome
    const bairrosMap = new Map();
    const bairrosInserted = await db.collection("bairros").find({}).toArray();
    for (const bairro of bairrosInserted) {
      bairrosMap.set(bairro.nome, bairro._id);
    }

    // Inserir pontos de coleta
    console.log("\n[v0] Inserindo pontos de coleta...");
    const pontosData = pontosColeta.map((p) => ({
      nome: p.nome,
      endereco: p.endereco,
      bairroId: bairrosMap.get(p.bairroNome),
      latitude: p.latitude,
      longitude: p.longitude,
      qrCode: generateQRCode("PC"),
      status: "ativo",
      tipoMaterial: p.tipoMaterial,
      capacidadeMaxima: p.capacidadeMaxima,
      nivelAtual: Math.random() * 60, // 0-60% inicial
      pesoAtual: Math.random() * 40, // 0-40kg inicial
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const pontosResult = await db.collection("pontos_coleta").insertMany(pontosData);
    console.log(`[v0] ✓ ${pontosResult.insertedCount} pontos de coleta inseridos`);

    // Inserir dispositivos IoT
    console.log("\n[v0] Inserindo dispositivos IoT...");
    const pontosInserted = await db.collection("pontos_coleta").find({}).toArray();

    const dispositivosData = pontosInserted.map((ponto, index) => ({
      pontoColetaId: ponto._id,
      tipo: "sensor_peso",
      identificador: `SENSOR-${String(index + 1).padStart(3, "0")}`,
      status: "online",
      bateria: Math.floor(Math.random() * 30) + 70, // 70-100%
      configuracao: {
        intervaloLeitura: 10,
        unidade: "kg",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const dispositivosResult = await db.collection("dispositivos").insertMany(dispositivosData);
    console.log(`[v0] ✓ ${dispositivosResult.insertedCount} dispositivos inseridos`);

    // Inserir coletas históricas (últimos 7 dias)
    console.log("\n[v0] Inserindo coletas históricas...");
    const coletasData = [];
    const hoje = new Date();

    for (let dia = 7; dia >= 0; dia--) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - dia);

      // 2-5 coletas por dia para cada ponto
      for (const ponto of pontosInserted) {
        const numColetas = Math.floor(Math.random() * 4) + 2;

        for (let i = 0; i < numColetas; i++) {
          const horaColeta = new Date(data);
          horaColeta.setHours(Math.floor(Math.random() * 24));
          horaColeta.setMinutes(Math.floor(Math.random() * 60));

          const material = ponto.tipoMaterial[Math.floor(Math.random() * ponto.tipoMaterial.length)];

          coletasData.push({
            pontoColetaId: ponto._id,
            peso: Number.parseFloat((Math.random() * 15 + 5).toFixed(2)), // 5-20kg
            tipoMaterial: material,
            nivel: Number.parseFloat((Math.random() * 40 + 20).toFixed(2)), // 20-60%
            dataHora: horaColeta,
            origem: Math.random() > 0.3 ? "sensor" : "qrcode",
            createdAt: horaColeta,
          });
        }
      }
    }

    const coletasResult = await db.collection("coletas").insertMany(coletasData);
    console.log(`[v0] ✓ ${coletasResult.insertedCount} coletas históricas inseridas`);

    // Inserir registros de coleta de exemplo
    console.log("\n[v0] Inserindo registros de coleta de exemplo...");
    const usuariosInserted = await db.collection("usuarios").find({}).toArray();
    const registrosData = [];

    for (let i = 0; i < 5; i++) {
      const usuario = usuariosInserted[Math.floor(Math.random() * usuariosInserted.length)];
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const pesoKg = Number.parseFloat((Math.random() * 10 + 2).toFixed(1));
      const materiais = ["plastico", "papel", "vidro", "metal", "organico"];

      registrosData.push({
        codigo: String(Math.floor(100000 + Math.random() * 900000)),
        nomeUsuario: usuario.nome,
        emailUsuario: usuario.email,
        tipoMaterial: materiais[Math.floor(Math.random() * materiais.length)],
        pesoKg,
        pontosGanhos: Math.floor(pesoKg * 10),
        status: "pendente",
        dataRegistro: new Date(),
        expiresAt,
      });
    }

    for (let i = 0; i < 10; i++) {
      const usuario = usuariosInserted[Math.floor(Math.random() * usuariosInserted.length)];
      const dataRegistro = new Date();
      dataRegistro.setDate(dataRegistro.getDate() - Math.floor(Math.random() * 7));

      const dataValidacao = new Date(dataRegistro);
      dataValidacao.setMinutes(dataValidacao.getMinutes() + Math.floor(Math.random() * 120));

      const pesoKg = Number.parseFloat((Math.random() * 15 + 3).toFixed(1));
      const materiais = ["plastico", "papel", "vidro", "metal", "organico"];

      // Simular badges ganhos
      const badgesGanhos = [];
      if (Math.random() > 0.7) badgesGanhos.push("Iniciante Eco");
      if (Math.random() > 0.9) badgesGanhos.push("Bronze Sustentável");

      registrosData.push({
        codigo: String(Math.floor(100000 + Math.random() * 900000)),
        usuarioId: usuario._id,
        nomeUsuario: usuario.nome,
        emailUsuario: usuario.email,
        tipoMaterial: materiais[Math.floor(Math.random() * materiais.length)],
        pesoKg,
        pontosGanhos: Math.floor(pesoKg * 10),
        badgesGanhos: badgesGanhos.length > 0 ? badgesGanhos : undefined,
        status: "validado",
        dataRegistro,
        dataValidacao,
        validadoPor: "Sistema",
        expiresAt: new Date(dataRegistro.getTime() + 24 * 60 * 60 * 1000),
      });
    }

    const registrosResult = await db.collection("registros_coleta").insertMany(registrosData);
    console.log(`[v0] ✓ ${registrosResult.insertedCount} registros de coleta inseridos`);

    // Atualizar dados de gamificação dos usuários
    console.log("\n[v0] Atualizando dados de gamificação dos usuários...");
    const registrosValidados = await db
      .collection("registros_coleta")
      .find({ status: "validado", usuarioId: { $exists: true } })
      .toArray();

    for (const usuario of usuariosInserted) {
      const coletasUsuario = registrosValidados.filter((r) => r.usuarioId.equals(usuario._id));

      if (coletasUsuario.length > 0) {
        const pesoTotal = coletasUsuario.reduce((acc, r) => acc + r.pesoKg, 0);
        const pontosTotal = coletasUsuario.reduce((acc, r) => acc + r.pontosGanhos, 0);
        const nivel = Math.floor(pontosTotal / 100) + 1;

        // Verificar badges conquistados
        const badges = [];
        if (coletasUsuario.length >= 1) badges.push("iniciante");
        if (coletasUsuario.length >= 10) badges.push("coletor");
        if (pesoTotal >= 50) badges.push("peso_bronze");

        await db.collection("usuarios").updateOne(
          { _id: usuario._id },
          {
            $set: {
              pontos: pontosTotal,
              nivel,
              badges,
              coletasRealizadas: coletasUsuario.length,
              pesoTotalColetado: pesoTotal,
              updatedAt: new Date(),
            },
          }
        );
      }
    }
    console.log("[v0] ✓ Dados de gamificação atualizados");

    // Resumo final
    console.log("\n" + "=".repeat(60));
    console.log("RESUMO DO SEED");
    console.log("=".repeat(60));
    console.log(`Bairros: ${bairrosResult.insertedCount}`);
    console.log(`Pontos de Coleta: ${pontosResult.insertedCount}`);
    console.log(`Dispositivos IoT: ${dispositivosResult.insertedCount}`);
    console.log(`Coletas Históricas: ${coletasResult.insertedCount}`);
    console.log(`Usuários: ${usuariosResult.insertedCount}`);
    console.log(`Registros de Coleta: ${registrosResult.insertedCount}`);
    console.log("=".repeat(60));
    console.log("\n[v0] ✓ Seed concluído com sucesso!");
    console.log("\n[v0] Você pode agora:");
    console.log("  1. Acessar o dashboard em http://localhost:3000");
    console.log("  2. Validar coletas em http://localhost:3000/validar");
    console.log("  3. Executar o simulador IoT: node scripts/iot-simulator.ts");
    console.log("  4. Testar as rotas da API (veja scripts/test-api.ts)");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("\n[v0] ✗ Erro ao executar seed:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n[v0] Conexão com MongoDB fechada");
  }
}

// Executar seed
seedDatabase();
