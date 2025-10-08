import type { ObjectId } from "mongodb"

export interface Dispositivo {
  _id?: ObjectId
  pontoColetaId: ObjectId
  tipo: "sensor_peso" | "sensor_nivel" | "camera" | "beacon"
  identificador: string
  status: "online" | "offline" | "erro"
  ultimaLeitura?: Date
  bateria?: number
  configuracao?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export const DispositivoSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["pontoColetaId", "tipo", "identificador", "status"],
      properties: {
        pontoColetaId: {
          bsonType: "objectId",
          description: "ID do ponto de coleta",
        },
        tipo: {
          enum: ["sensor_peso", "sensor_nivel", "camera", "beacon"],
          description: "Tipo do dispositivo",
        },
        identificador: {
          bsonType: "string",
          description: "Identificador único do dispositivo",
        },
        status: {
          enum: ["online", "offline", "erro"],
          description: "Status do dispositivo",
        },
        ultimaLeitura: {
          bsonType: "date",
        },
        bateria: {
          bsonType: "int",
          description: "Nível de bateria (0-100)",
        },
        configuracao: {
          bsonType: "object",
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
