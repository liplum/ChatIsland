import { start } from "./server.js"
import * as sourceMap from "source-map-support"

sourceMap.install()

await start({
  dbUri: "mongodb://localhost:27017",
  dbName: "chat_island",
  port: 8888
})
