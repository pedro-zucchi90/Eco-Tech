import type { ObjectId } from "mongodb"

export interface Coleta {
  _id?: ObjectId
  pontoColetaId: ObjectId
  peso: number
  tipoMaterial: string
  nivel: number
  dataHora: Date
  operador?: string
  observacoes?: string
  origem: "qrcode" | "sensor" | "manual"
  createdAt: Date
}

export const ColetaSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["pontoColetaId", "peso", "tipoMaterial", "nivel", "dataHora", "origem"],
      properties: {
        pontoColetaId: {
          bsonType: "objectId",
          description: "ID do ponto de coleta",
        },
        peso: {
          bsonType: "double",
          description: "Peso coletado em kg",
        },
        tipoMaterial: {
          bsonType: "string",
          description: "Tipo de material coletado",
        },
        nivel: {
          bsonType: "double",
          description: "Nível do recipiente (0-100)",
        },
        dataHora: {
          bsonType: "date",
          description: "Data e hora da coleta",
        },
        operador: {
          bsonType: "string",
          description: "Nome do operador",
        },
        observacoes: {
          bsonType: "string",
        },
        origem: {
          enum: ["qrcode", "sensor", "manual"],
          description: "Origem do registro",
        },
        createdAt: {
          bsonType: "date",
        },
      },
    },
  },
}
