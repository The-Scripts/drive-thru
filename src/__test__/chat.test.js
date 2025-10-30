const { io: Client } = require('socket.io-client')

jest.setTimeout(10000)

function connectClient(url = 'http://localhost:4444') {
    return new Promise((resolve, reject) => {
        const client = new Client(url, { transports: ['websocket'] })
        const timer = setTimeout(() => reject(new Error('connect timeout')), 5000)
        client.on('connect', () => {
            clearTimeout(timer)
            resolve(client)
        })
        client.on('connect_error', (err) => {
            clearTimeout(timer)
            reject(err)
        })
    })
}

function disconnectSafe(client) {
    try { client.removeAllListeners(); client.disconnect() } catch {}
}

describe('chat:message', () => {
    let c1, c2

    afterEach(() => {
        if (c1) disconnectSafe(c1)
        if (c2) disconnectSafe(c2)
        c1 = undefined
        c2 = undefined
    })

    test('broadcasts messages to all connected clients', async () => {
        c1 = await connectClient()
        c2 = await connectClient()

        const msg = { id: 't1', name: c1.id, text: 'Hello from test' }

        const receivedByC2 = new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('c2 did not receive message')), 4000)
            c2.on('chat:message', (payload) => {
                try {
                    expect(payload).toMatchObject({ id: msg.id, text: msg.text })
                    resolve(payload)
                } catch (e) {
                    reject(e)
                } finally {
                    clearTimeout(timer)
                }
            })
        })

        c1.emit('chat:message', msg)

        const payload = await receivedByC2
        expect(payload.name).toBeDefined()
    })

    test('sender also receives its own message (echo)', async () => {
    c1 = await connectClient()

    const msg = { id: 't2', name: c1.id, text: 'Echo check' }

    const receivedByC1 = new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('c1 did not receive echo')), 4000)
        c1.on('chat:message', (payload) => {
            try {
                if (payload.id === msg.id) {
                expect(payload.text).toBe(msg.text)
                resolve()
            }
            } catch (e) {
                reject(e)
            } finally {
                clearTimeout(timer)
            }
        })
    })

    c1.emit('chat:message', msg)
    await receivedByC1
  })
})
