import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { WebSocketServer } from 'ws';
import { KError } from "./infrastructure.js";
export async function start(options) {
    const client = new MongoClient(options.dbUri);
    try {
        const db = client.db(options.dbName);
        await startServer({
            db,
        });
    }
    catch (e) {
        client.close();
        console.log(e);
    }
}
async function startServer(ctx) {
    const app = express();
    app.use(cors());
    app.use(express.json());
    const users = ctx.db.collection("users");
    const chatRooms = ctx.db.collection("chat_rooms");
    const messages = ctx.db.collection("messages");
    async function isRegistered(publicKey) {
        const user = await users.findOne({ publicKey });
        return user != null;
    }
    app.post("/register", async (req, res) => {
        const publicKey = req.body.publicKey;
        if (await isRegistered(publicKey)) {
            return res.status(400).json({ error: KError.userAlreadyExists });
        }
        await users.insertOne({
            publicKey,
            chatRooms: []
        });
        res.status(200).end();
    });
    const server = app.listen(8888, () => {
        console.log("Server running at http://localhost:8888");
    });
    const connections = new Map();
    const wss = new WebSocketServer({
        server, path: "/chat"
    });
    wss.on("connection", async (ws, req) => {
        const publicKey = req.headers["publick-key"];
        if (!publicKey || typeof publicKey !== "string")
            return ws.close();
        if (!await isRegistered(publicKey))
            return ws.close();
        ws.on("message", async (msg) => {
        });
    });
}
//# sourceMappingURL=server.js.map