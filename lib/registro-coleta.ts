import type { ObjectId } from "mongodb"

export interface RegistroColeta {
  _id?: ObjectId
  codigo: string
  pontoColetaId?: ObjectId
  usuarioId?: ObjectId
  nomeUsuario: string
  emailUsuario: string
  tipoMaterial: string
  pesoKg: number
  pontosGanhos: number
  badgesGanhos?: string[]
  status: "pendente" | "validado" | "expirado"
  dataRegistro: Date
  dataValidacao?: Date
  validadoPor?: string
  expiresAt: Date
}

export const RegistroColetaSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo", "nomeUsuario", "emailUsuario", "tipoMaterial", "pesoKg", "status", "dataRegistro"],
      properties: {
        codigo: {
          bsonType: "string",
          description: "Código único de 6 dígitos",
        },
        pontoColetaId: {
          bsonType: "objectId",
        },
        usuarioId: {
          bsonType: "objectId",
        },
        nomeUsuario: {
          bsonType: "string",
          description: "Nome do usuário que registrou",
        },
        emailUsuario: {
          bsonType: "string",
          description: "Email do usuário que registrou",
        },
        tipoMaterial: {
          bsonType: "string",
          description: "Tipo de material coletado",
        },
        pesoKg: {
          bsonType: "double",
          description: "Peso em kg",
        },
        pontosGanhos: {
          bsonType: "int",
          description: "Pontos ganhos nesta coleta",
        },
        badgesGanhos: {
          bsonType: "array",
          items: {
            bsonType: "string",
          },
          description: "Badges conquistados nesta coleta",
        },
        status: {
          enum: ["pendente", "validado", "expirado"],
          description: "Status do registro",
        },
        dataRegistro: {
          bsonType: "date",
        },
        dataValidacao: {
          bsonType: "date",
        },
        validadoPor: {
          bsonType: "string",
        },
        expiresAt: {
          bsonType: "date",
          description: "Data de expiração do código",
        },
      },
    },
  },
}
