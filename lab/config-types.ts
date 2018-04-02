import { GeneralDatabaseConfig } from "../../vineyard-ground/source/index"

export interface VillageDatabaseConfig extends GeneralDatabaseConfig {
  devMode?: boolean
}

export interface FullConfig {
  database: VillageDatabaseConfig,
  ethereum: {
    client: {
      http: string
    }
  }
  bitcoin: {
    host: string
    username: string
    password: string
    port: number
  }
}