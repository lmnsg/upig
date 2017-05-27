const Koa = require('koa')
const router = require('./router')
const WebSocket = require('ws')
const http = require('http')

const app = new Koa()
app.listen()
const server = http.createServer(app.callback())

const wss = new WebSocket.Server({ server })
const clients = wss.clients

wss.on('connection', (ws, req) => {
  ws.on('message', function incoming(message) {
    const other = new Set(clients)
    other.delete(ws)
    other.forEach(ws => ws.send(message))
  })
})

app
  .use(router.routes())
  .use(router.allowedMethods())

server.listen(8000, () => console.log('Listening on:' + server.address().port))
