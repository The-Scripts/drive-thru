import fs from 'fs'
import path from 'path'
import express from 'express'
import Router from 'express-promise-router'
import { Server } from 'socket.io'
import { createClient } from '@redis/client'
import { createAdapter } from '@socket.io/redis-adapter'

// Create router
const router = Router()

// Main route serves the index HTML
router.get('/', async (req, res, next) => {
    const distIndex = path.resolve('dist', 'index.html')
    const devIndex = path.resolve('index.html')
    try {
        if (fs.existsSync(distIndex)) {
            res.send(fs.readFileSync(distIndex, 'utf-8'))
            return
        }
        res.send(fs.readFileSync(devIndex, 'utf-8'))
    } catch (e) {
        next(e)
    }
})

// Everything else that's not index 404s
router.use('*', (req, res) => {
    res.status(404).send({ message: 'Not Found' })
})

// Create express app and listen on port 4444
const app = express()
app.use(express.static('dist'))
app.use(router)
const PORT = Number(process.env.PORT) || 4444
const server = app.listen(PORT, () => {
    console.log(`HTTP server listening on http://localhost:${PORT}`)
})

// Allow Socket.IO CORS in dev so Vite (default 3000) can connect
const ioServer = new Server(server, {
    cors: {
        origin: [
            /^https?:\/\/localhost:\d+$/,
            /^https?:\/\/127\.0\.0\.1:\d+$/,
            /^https?:\/\/[a-zA-Z0-9-]+-\d+\.app\.github\.dev$/,
        ],
        methods: ['GET', 'POST']
    }
})

// ---- Redis + tick ----
const TICK_RATE = Number(process.env.TICK_RATE || 20)
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const MOVES_CHANNEL = 'moves'
const PLAYERS_HASH = 'players'

let clients = {}
let pubClient
let subClient

async function initRealtime() {
    try {
        pubClient = createClient({ url: REDIS_URL })
        subClient = pubClient.duplicate()
        await pubClient.connect()
        await subClient.connect()
        ioServer.adapter(createAdapter(pubClient, subClient))

        // Preload z Redis
        try {
            const all = await pubClient.hGetAll(PLAYERS_HASH)
            clients = Object.fromEntries(
                Object.entries(all).map(([id, json]) => [id, JSON.parse(json)])
            )
        } catch (e) {
            console.error('Failed to preload players from Redis:', e)
        }

        // Subskrypcja ruchów
        await subClient.subscribe(MOVES_CHANNEL, (message) => {
            try {
                const evt = JSON.parse(message)
                if (evt.type === 'leave') {
                    delete clients[evt.id]
                } else if (evt.type === 'move') {
                    clients[evt.id] = { position: evt.position, rotation: evt.rotation, ts: evt.ts }
                }
            } catch (e) {
                console.error('Bad MOVES message:', message, e)
            }
        })

        // Snapshot tick (stała częstotliwość emisji do klientów)
        setInterval(() => {
            ioServer.sockets.emit('move', clients)
        }, 1000 / TICK_RATE)
    } catch (e) {
        console.error('Realtime init error:', e)
    }
}
initRealtime()

async function upsertPlayer(id, data) {
    const record = { position: data.position, rotation: data.rotation, ts: data.ts }
    clients[id] = record
    if (pubClient?.isOpen) {
        await pubClient.hSet(PLAYERS_HASH, id, JSON.stringify(record))
        await pubClient.publish(MOVES_CHANNEL, JSON.stringify({ type: 'move', id, ...record }))
    }
}

// ---- Socket handlers ----
ioServer.on('connection', (client) => {
    console.log(
        `User ${client.id} connected, there are currently ${ioServer.engine.clientsCount} users connected`
    )

    const initial = { position: [0, 0, 0], rotation: [0, 0, 0, 1], ts: Date.now() }
    upsertPlayer(client.id, initial).catch((e) => console.error('upsert init failed:', e))

    // Snapshot tylko dla nowego klienta
    ;(async () => {
        try {
            if (pubClient?.isOpen) {
                const all = await pubClient.hGetAll(PLAYERS_HASH)
                const snapshot = Object.fromEntries(
                    Object.entries(all).map(([id, json]) => [id, JSON.parse(json)])
                )
                ioServer.to(client.id).emit('move', snapshot)
            } else {
                ioServer.to(client.id).emit('move', clients)
            }
        } catch {
            ioServer.to(client.id).emit('move', clients)
        }
    })()

    // Throttle ~30 Hz na wejściu
    let lastUpdate = 0
    client.on('move', ({ rotation, position }) => {
        if (!Array.isArray(position) || position.length !== 3) return
        if (!Array.isArray(rotation) || rotation.length !== 4) return
        const now = Date.now()
        if (now - lastUpdate < 33) return
        lastUpdate = now
        upsertPlayer(client.id, { position, rotation, ts: now }).catch((e) =>
            console.error('Failed to upsert player:', e)
        )
    })

    client.on('disconnect', () => {
        console.log(
            `User ${client.id} disconnected, there are currently ${ioServer.engine.clientsCount} users connected`
        )
        delete clients[client.id]
        if (pubClient?.isOpen) {
            pubClient.hDel(PLAYERS_HASH, client.id).catch(() => {})
            pubClient.publish(MOVES_CHANNEL, JSON.stringify({ type: 'leave', id: client.id })).catch(() => {})
        }
    })

    client.on('chat:message', (msg) => {
        console.log(`Message from ${client.id}: ${msg.text}`);
        ioServer.emit('chat:message', msg);
    })
})

export { server, ioServer }