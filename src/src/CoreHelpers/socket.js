import { io } from 'socket.io-client'

function resolveSocketUrl() {
  // 1) Explicit override by env
  if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL

  // 2) GitHub Codespaces: map subdomain to 4444 port endpoint
  const { location } = window
  const host = location.host // e.g. myspace-3000.app.github.dev
  const isCodespaces = host.endsWith('.app.github.dev')
  if (isCodespaces) {
    // Replace trailing -<port> with -4444
    const url = new URL(location.href)
    const newHost = host.replace(/-(\d+)\.app\.github\.dev$/, '-4444.app.github.dev')
    url.host = newHost
    url.protocol = 'https:'
    return url.origin
  }

  // 3) Local dev default
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
