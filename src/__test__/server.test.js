const { io: Client } = require('socket.io-client')

test('connect websocket',()=>{
    const client = new Client('http://localhost:4444')
    client.on('connect', () => {
        expect(client.connected).toBe(true)
        client.disconnect()
    })
})

