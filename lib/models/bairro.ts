import type { ObjectId } from "mongodb"

export interface Bairro {
  _id?: ObjectId
  nome: string
  cidade: string
  estado: string
  populacao?: number
  createdAt: Date
  updatedAt: Date
}

export const BairroSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "cidade", "estado"],
      properties: {
        nome: {
          bsonType: "string",
          description: "Nome do bairro é obrigatório",
        },
        cidade: {
          bsonType: "string",
          description: "Cidade é obrigatória",
        },
        estado: {
          bsonType: "string",
          description: "Estado é obrigatório",
        },
        populacao: {
          bsonType: "int",
          description: "População do bairro",
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
