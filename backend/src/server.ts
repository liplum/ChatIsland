import express from "express"
import cors from "cors"
import { publicEncrypt } from "crypto"
import { type Db, MongoClient, ObjectId, type Int32 } from "mongodb"
import { Server, WebSocket } from 'ws'
import { IncomingMessage } from "http"
import { KError } from "./infrastructure.js"

interface ServerOptions {
  dbUri: string
  dbName: string
}

interface ServerContext {
  db: Db
}
type PublicKey = string
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

  app.post("/register", async (req, res) => {
    const publicKey = req.body.publicKey
    if (await users.findOne({ publicKey }) != null) {
      return res.status(400).json({ error: KError.userAlreadyExists })
    }
    await users.insertOne({
      publicKey,
      chatRooms: []
    })
  })

  const server = app.listen(8888, () => {
    console.log("Server running at http://localhost:8888")
  })
  const connections = new Map<PublicKey, WebSocket>()
  const wss = new Server({
    server, path: "/chat"
  })
  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {

    ws.on("message", async (msg) => {

    })


  })
}