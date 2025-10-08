import type { ObjectId } from "mongodb"

export interface Usuario {
  _id?: ObjectId
  nome: string
  email: string
  telefone?: string
  pontos: number
  nivel: number
  badges: string[]
  coletasRealizadas: number
  pesoTotalColetado: number
  createdAt: Date
  updatedAt: Date
}

export interface Badge {
  id: string
  nome: string
  descricao: string
  icone: string
  requisito: number
  tipo: "coletas" | "peso" | "especial"
}

export const BADGES: Badge[] = [
  {
    id: "iniciante",
    nome: "Iniciante Eco",
    descricao: "Realize sua primeira coleta",
    icone: "🌱",
    requisito: 1,
    tipo: "coletas",
  },
  {
    id: "coletor",
    nome: "Coletor Ativo",
    descricao: "Realize 10 coletas",
    icone: "♻️",
    requisito: 10,
    tipo: "coletas",
  },
  {
    id: "heroi",
    nome: "Herói Verde",
    descricao: "Realize 50 coletas",
    icone: "🦸",
    requisito: 50,
    tipo: "coletas",
  },
  {
    id: "peso_bronze",
    nome: "Bronze Sustentável",
    descricao: "Colete 50kg de material",
    icone: "🥉",
    requisito: 50,
    tipo: "peso",
  },
  {
    id: "peso_prata",
    nome: "Prata Sustentável",
    descricao: "Colete 200kg de material",
    icone: "🥈",
    requisito: 200,
    tipo: "peso",
  },
  {
    id: "peso_ouro",
    nome: "Ouro Sustentável",
    descricao: "Colete 500kg de material",
    icone: "🥇",
    requisito: 500,
    tipo: "peso",
  },
]

export function calcularNivel(pontos: number): number {
  return Math.floor(pontos / 100) + 1
}

export function calcularPontos(pesoKg: number): number {
  return Math.floor(pesoKg * 10)
}

export const UsuarioSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "email", "pontos", "nivel"],
      properties: {
        nome: {
          bsonType: "string",
          description: "Nome do usuário",
        },
        email: {
          bsonType: "string",
          description: "Email do usuário",
        },
        telefone: {
          bsonType: "string",
        },
        pontos: {
          bsonType: "int",
          description: "Pontos acumulados",
        },
        nivel: {
          bsonType: "int",
          description: "Nível do usuário",
        },
        badges: {
          bsonType: "array",
          items: {
            bsonType: "string",
          },
          description: "IDs dos badges conquistados",
        },
        coletasRealizadas: {
          bsonType: "int",
          description: "Número de coletas realizadas",
        },
        pesoTotalColetado: {
          bsonType: "double",
          description: "Peso total coletado em kg",
        },
        createdAt: {
          bsonType: "date",
        },
        updatedAt: {
          bsonType: "date",
        },
      },
    },
  },
}
