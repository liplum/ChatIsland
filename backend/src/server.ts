import express from "express"
import cors from "cors"
import { publicEncrypt } from "crypto"
import { type Db, MongoClient, ObjectId, type Int32 } from "mongodb"
import type WebSocket from "ws"
import { WebSocketServer } from "ws"
import { type IncomingMessage } from "http"
import { KError } from "./infrastructure.js"

interface ServerOptions {
  dbUri: string
  dbName: string
  port: number
}

interface ServerContext {
  db: Db
  port: number
}
type PublicKey = string

export async function start(options: ServerOptions) {
  const client = new MongoClient(options.dbUri)
  try {
    const db = client.db(options.dbName)
    await startServer({
      db,
      port: options.port
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

  async function isRegistered(publicKey: PublicKey): Promise<boolean> {
    const user = await users.findOne({ publicKey })
    return user != null
  }

  app.post("/register", async (req, res) => {
    const publicKey = req.body.publicKey
    if (await isRegistered(publicKey)) {
      return res.status(400).json({ error: KError.userAlreadyExists })
    }
    await users.insertOne({
      publicKey,
      chatRooms: []
    })
    res.status(200).end()
  })

  const server = app.listen(ctx.port, () => {
    console.log(`Server running at http://localhost:${ctx.port}`)
  })
  const connections = new Map<PublicKey, WebSocket>()
  const wss = new WebSocketServer({
    server, path: "/chat"
  })
  wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
    const publicKey = req.headers["publick-key"]
    // close the websocket if the user isn't registered.
    if (!publicKey || typeof publicKey !== "string") return ws.close()
    if (!await isRegistered(publicKey)) return ws.close()

    ws.on("message", async (msg) => {

    })
  })
}
