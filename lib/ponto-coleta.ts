import type { ObjectId } from "mongodb"

export interface PontoColeta {
  _id?: ObjectId
  nome: string
  endereco: string
  bairroId: ObjectId
  latitude?: number
  longitude?: number
  qrCode: string
  status: "ativo" | "inativo" | "manutencao"
  tipoMaterial: string[]
  capacidadeMaxima: number
  nivelAtual: number
  pesoAtual: number
  ultimaColeta?: Date
  createdAt: Date
  updatedAt: Date
}

export const PontoColetaSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "endereco", "bairroId", "qrCode", "status", "tipoMaterial"],
      properties: {
        nome: {
          bsonType: "string",
          description: "Nome do ponto de coleta",
        },
        endereco: {
          bsonType: "string",
          description: "Endereço completo",
        },
        bairroId: {
          bsonType: "objectId",
          description: "ID do bairro",
        },
        latitude: {
          bsonType: "double",
        },
        longitude: {
          bsonType: "double",
        },
        qrCode: {
          bsonType: "string",
          description: "Código QR único do ponto",
        },
        status: {
          enum: ["ativo", "inativo", "manutencao"],
          description: "Status do ponto de coleta",
        },
        tipoMaterial: {
          bsonType: "array",
          items: {
            bsonType: "string",
          },
          description: "Tipos de material aceitos",
        },
        capacidadeMaxima: {
          bsonType: "double",
          description: "Capacidade máxima em kg",
        },
        nivelAtual: {
          bsonType: "double",
          description: "Nível atual em porcentagem (0-100)",
        },
        pesoAtual: {
          bsonType: "double",
          description: "Peso atual em kg",
        },
        ultimaColeta: {
          bsonType: "date",
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
