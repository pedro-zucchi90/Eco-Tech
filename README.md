# EcoTech DataFlow - MVP

Sistema de gestão de coleta seletiva com rastreamento via QR Code, monitoramento IoT, gamificação e geração de relatórios.

## Funcionalidades

- **Cadastro de Pontos de Coleta**: Geração automática de QR Codes únicos
- **Registro de Coletas**: Via QR Code ou sensores IoT
- **Gamificação**: Sistema de pontos, níveis e badges para incentivar coletas
- **Registro Manual de Coletas**: Interface para gerar códigos de validação
- **Validação Mobile**: App mobile para validar coletas e ganhar pontos
- **Dashboard em Tempo Real**: Monitoramento de status e alertas
- **Simulador IoT**: Envio automático de dados de sensores
- **Relatórios**: Geração de PDFs com estatísticas consolidadas
- **API RESTful**: Endpoints completos para integração

## Tecnologias

- **Backend**: Next.js 15 + TypeScript
- **Banco de Dados**: MongoDB
- **Frontend**: React 19 + Tailwind CSS v4
- **QR Code**: qrcode library
- **PDF**: jsPDF + jsPDF-AutoTable
- **Atualização em Tempo Real**: SWR

## Instalação

1. Clone o repositório
2. Instale as dependências:

\`\`\`bash
npm install
\`\`\`

3. Configure as variáveis de ambiente:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edite `.env.local` e adicione sua connection string do MongoDB:

\`\`\`
MONGODB_URI=mongodb://localhost:27017/ecotech_dataflow
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

4. Execute o seed do banco de dados:

\`\`\`bash
npm run dev
# Em outro terminal:
node scripts/seed-database.ts
\`\`\`

5. Acesse o dashboard em `http://localhost:3000`

## Scripts Disponíveis

### Desenvolvimento

\`\`\`bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia servidor de produção
\`\`\`

### Banco de Dados

\`\`\`bash
node scripts/seed-database.ts    # Popula o banco com dados de teste
\`\`\`

### Simulador IoT

\`\`\`bash
node scripts/iot-simulator.ts    # Inicia o simulador de sensores
\`\`\`

### Testes

\`\`\`bash
node scripts/test-api.ts         # Testa todas as rotas da API
\`\`\`

## Estrutura da API

### Bairros

- `GET /api/bairros` - Lista todos os bairros
- `POST /api/bairros` - Cria novo bairro
- `GET /api/bairros/[id]` - Busca bairro específico

### Pontos de Coleta

- `GET /api/pontos-coleta` - Lista pontos de coleta
- `POST /api/pontos-coleta` - Cria novo ponto
- `GET /api/pontos-coleta/[id]` - Busca ponto específico
- `PUT /api/pontos-coleta/[id]` - Atualiza ponto
- `DELETE /api/pontos-coleta/[id]` - Remove ponto
- `GET /api/pontos-coleta/[id]/qrcode` - Gera QR Code do ponto

### Coletas

- `GET /api/coletas` - Lista coletas (com filtros)
- `POST /api/coletas` - Registra nova coleta
- `GET /api/coletas/[id]` - Busca coleta específica

### Dispositivos IoT

- `GET /api/dispositivos` - Lista dispositivos
- `POST /api/dispositivos` - Cadastra novo dispositivo
- `GET /api/dispositivos/[id]` - Busca dispositivo específico
- `PUT /api/dispositivos/[id]` - Atualiza dispositivo
- `DELETE /api/dispositivos/[id]` - Remove dispositivo

### IoT Data Ingestion

- `POST /api/iot/data` - Recebe dados de sensores

### Relatórios

- `GET /api/relatorios?tipo=diario|semanal|mensal` - Gera relatório
- `GET /api/relatorios/pdf?tipo=diario|semanal|mensal` - Dados para PDF

### Usuários (Gamificação)

- `GET /api/usuarios` - Lista usuários
- `POST /api/usuarios` - Cria novo usuário
- `GET /api/usuarios?email=email@example.com` - Busca por email

### Registros de Coleta (Gamificação)

- `GET /api/registros-coleta` - Lista registros
- `POST /api/registros-coleta` - Cria novo registro e gera código
- `POST /api/registros-coleta/validar` - Valida código e atualiza pontos

## Sistema de Gamificação

### Como Funciona

1. **Registrar Coleta**: No dashboard, clique em "Registrar Coleta"
2. **Selecionar Material**: Escolha o tipo de material e peso em kg
3. **Gerar Código**: Sistema gera código de 6 dígitos válido por 24h
4. **Validar**: Acesse `/validar` no celular e digite o código
5. **Ganhar Pontos**: Receba pontos (10 pontos por kg) e badges

### Sistema de Pontos

- **10 pontos por kg** de material coletado
- **Níveis**: A cada 100 pontos você sobe de nível
- **Badges**: Conquiste badges por marcos alcançados

### Badges Disponíveis

- 🌱 **Iniciante Eco**: Realize sua primeira coleta
- ♻️ **Coletor Ativo**: Realize 10 coletas
- 🦸 **Herói Verde**: Realize 50 coletas
- 🥉 **Bronze Sustentável**: Colete 50kg de material
- 🥈 **Prata Sustentável**: Colete 200kg de material
- 🥇 **Ouro Sustentável**: Colete 500kg de material

## Exemplos de Uso

### Registrar Coleta via QR Code

\`\`\`bash
curl -X POST http://localhost:3000/api/coletas \
  -H "Content-Type: application/json" \
  -d '{
    "qrCode": "PC-ABC123",
    "peso": 15.5,
    "tipoMaterial": "plástico",
    "nivel": 65,
    "operador": "João Silva"
  }'
\`\`\`

### Enviar Dados de Sensor

\`\`\`bash
curl -X POST http://localhost:3000/api/iot/data \
  -H "Content-Type: application/json" \
  -d '{
    "identificador": "SENSOR-001",
    "peso": 12.3,
    "nivel": 45,
    "tipoMaterial": "papel"
  }'
\`\`\`

### Criar Registro de Coleta (Gamificação)

\`\`\`bash
curl -X POST http://localhost:3000/api/registros-coleta \
  -H "Content-Type: application/json" \
  -d '{
    "tipoMaterial": "plastico",
    "pesoKg": 5.5
  }'
\`\`\`

### Validar Código de Coleta

\`\`\`bash
curl -X POST http://localhost:3000/api/registros-coleta/validar \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "123456",
    "usuarioId": "507f1f77bcf86cd799439011"
  }'
\`\`\`

### Gerar Relatório

\`\`\`bash
curl http://localhost:3000/api/relatorios?tipo=semanal
\`\`\`

## Paleta de Cores

- **Primária (Verde Ecológico)**: `#2ECC71`
- **Secundária (Verde Escuro)**: `#145A32`
- **Acento (Azul Clean)**: `#3498DB`
- **Alerta (Vermelho)**: `#E74C3C`
- **Aviso (Amarelo)**: `#F1C40F`

## Fluxo do Sistema

### Fluxo Tradicional (IoT)

1. **Cadastro**: Prefeitura cadastra pontos de coleta → QR Code gerado
2. **Coleta**: Operador escaneia QR Code ou sensor envia dados automaticamente
3. **Armazenamento**: Dados salvos no MongoDB
4. **Visualização**: Dashboard atualiza em tempo real
5. **Relatórios**: Geração automática de PDFs consolidados

### Fluxo de Gamificação

1. **Registro**: Usuário registra coleta no dashboard → Código gerado
2. **Validação**: Usuário valida código no app mobile
3. **Pontuação**: Sistema calcula pontos e verifica badges
4. **Atualização**: Dados do usuário atualizados em tempo real
5. **Engajamento**: Usuário visualiza progresso e conquistas

## Demonstração

O MVP inclui:

- 5 bairros cadastrados
- 8 pontos de coleta com QR Codes
- 8 dispositivos IoT simulados
- 5 usuários cadastrados
- 15 registros de coleta (5 pendentes, 10 validados)
- Histórico de 7 dias de coletas
- Dashboard funcional com atualização a cada 5 segundos
- Sistema de alertas para pontos cheios (≥80%)
- Geração de relatórios em PDF
- Sistema completo de gamificação com pontos e badges

## Páginas Disponíveis

- `/` - Dashboard principal com visão geral
- `/validar` - Página mobile para validar códigos de coleta

## Suporte

Para dúvidas ou problemas, consulte a documentação da API ou execute os scripts de teste.
