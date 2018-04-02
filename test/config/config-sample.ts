import {FullConfig} from "../src/config-types"

export const localConfig: FullConfig = {
  database: {
    host: "localhost",
    database: "",
    devMode: true,
    username: "postgres",
    password: "dev",
    dialect: "postgres"
  },
  ethereum: {
    client: {
      http: ""
    }
  },
  bitcoin: {
    "host": "localhost",
    "user": "",
    "pass": "",
    "port": 8332,
  }
}