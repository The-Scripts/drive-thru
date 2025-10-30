import { io } from 'socket.io-client'

function resolveSocketUrl() {
  if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL

  const { location } = window
  const host = location.host
  const isCodespaces = host.endsWith('.app.github.dev')
  if (isCodespaces) {
    const url = new URL(location.href)
    const newHost = host.replace(/-(\d+)\.app\.github\.dev$/, '-4444.app.github.dev')
    url.host = newHost
    url.protocol = 'https:'
    return url.origin
  }

  return 'http://localhost:4444'
}

const url = resolveSocketUrl()

export const socket = io(url, {
  autoConnect: true,
  transports: ['websocket']
})

export function onMoves(callback) {
  socket.on('move', callback)
}

export function emitMove({ id, position, rotation }) {
  socket.emit('move', { id, position, rotation })
}

export function onChatMessage(callback) {
  socket.on('chat:message', callback)
}

export function sendChatMessage(msg) {
  socket.emit('chat:message', msg)
}
