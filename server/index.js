const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const WebSocket = require('ws')
const http = require('http')

const router = require('./router')
const { games, Game } = require('./Game')

const app = new Koa()
app.use(bodyParser)
const server = http.createServer(app.callback())

const wss = new WebSocket.Server({ server })
const clients = wss.clients

wss.on('connection', (ws, { url }) => {
  const uuid = url.slice(url.lastIndexOf('/') + 1)

  if (!games[uuid]) {
    games[uuid] = new Game()
  }

  console.log(games)

  ws.on('message', (message) => {
    let data = {}
    try {
      data = JSON.parse(message)
    } catch (e) {}

    switch (data.action) {
      case 'drawing':
      case 'start':
      case 'drawingEnd':
        const other = new Set(clients)
        other.delete(ws)
        other.forEach(ws => ws.send(message))
        break
    }
  })
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.on('error', console.error)

server.listen(8000, () => console.log('Listening on:' + server.address().port))
