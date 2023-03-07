import express from "express"
import cors from "cors"
import { publicDecrypt } from "crypto"
import { type Db, MongoClient, ObjectId, type Int32 } from "mongodb"


interface ServerOptions {
  dbUri: string
  dbName: string
}

interface ServerContext {
  db: Db
}

export async function start(options: ServerOptions) {
  const client = new MongoClient(options.dbUri)
  try {
    const db = client.db(options.dbName)
    await startServer({
      db,
    })
  } catch (e) {
    client.close()
    console.log(e)
  }
}

async function startServer(ctx: ServerContext) {
  const app = express()
  app.use(cors())
  app.use(express.json())
  const users = ctx.db.collection("users")
  const chatRooms = ctx.db.collection("chat_rooms")
  const messages = ctx.db.collection("messages")
  app.post("/register", (req, res) => {

  })

  app.listen(8888, () => {
  })
}