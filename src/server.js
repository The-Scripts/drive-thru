import fs from 'fs'
import path from 'path'
import express from 'express'
import Router from 'express-promise-router'
import { Server } from 'socket.io'

// Create router
const router = Router()

// Main route serves the index HTML
router.get('/', async (req, res, next) => {
  // Prefer built index from dist if available (production), else fall back to dev index.html
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
const HOST = process.env.HOST || '0.0.0.0'
const server = app.listen(PORT, HOST, () => {
  const hostShown = HOST === '0.0.0.0' ? '0.0.0.0' : HOST
  console.log(`HTTP server listening on http://${hostShown}:${PORT}`)
})

// Allow Socket.IO CORS (configurable via ALLOWED_ORIGINS)
// ALLOWED_ORIGINS can be a comma-separated list, e.g. "http://ip1:3000,http://ip2:4444"
// If unset or "*", all origins are allowed (useful for LAN/Hamachi/dev)
const allowedOrigins = (() => {
  const env = process.env.ALLOWED_ORIGINS
  if (!env || env.trim() === '' || env.trim() === '*') return true
  return env.split(',').map(s => s.trim())
})()

const ioServer = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
})

let clients = {}

// Socket app msgs
ioServer.on('connection', (client) => {
  console.log(
    `User ${client.id} connected, there are currently ${ioServer.engine.clientsCount} users connected`
  )

  // Add a new client indexed by id
  clients[client.id] = {
    position: [0, 0, 0],
    rotation: [0, 0, 0, 1],
  }

  ioServer.sockets.emit('move', clients)

  // client.on('state:request', () => {
  //   ioServer.to(client.id).emit('state', clients)
  // })

  client.on('move', ({ rotation, position }) => {
    if (!clients[client.id]) {
      clients[client.id] = { position: [0, 0, 0], rotation: [0, 0, 0, 1] }
    }
    clients[client.id].position = position
    clients[client.id].rotation = rotation

    ioServer.sockets.emit('move', clients)
  })

  client.on('disconnect', () => {
    console.log(
      `User ${client.id} disconnected, there are currently ${ioServer.engine.clientsCount} users connected`
    )

    // Delete this client from the object
    delete clients[client.id]

    ioServer.sockets.emit('move', clients)
  })

  client.on('chat:message', (msg) => {
    console.log(`Message from ${client.id}: ${msg.text}`)
    ioServer.emit('chat:message', msg)
  })
})

export { server, ioServer }