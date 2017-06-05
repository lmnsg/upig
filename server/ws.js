const WebSocket = require('ws')
const { games, Game, Player } = require('./Game')

module.exports = (server) => {
  const wss = new WebSocket.Server({ server })
  const clients = wss.clients

  wss.on('connection', (ws, { url }) => {
    const uuid = url.slice(url.lastIndexOf('/') + 1)

    if (!games[uuid]) games[uuid] = new Game()
    const game = games[uuid]

    send(ws, { action: 'game', game })

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

        case 'join':
          if (!game || !data) return
          const { players } = game
          const { user } = data

          let exist = players.findIndex(({ user: { name } }) => user.name === name)

          if (exist !== -1) {
            players[exist].ws = ws
            return
          }

          const player = new Player({ user: data.user, ws })

          game.players.push(player)

          game.players.forEach(({ ws }) => {
            if (ws.readyState === WebSocket.OPEN) send(ws, { action: 'game', game })
          })
          break
      }
    })

    ws.on('close', () => {
      game.players = game.players.filter((player) => player.ws !== ws)
      broadcast(game.players, { action: 'game', game })
    })
  })
}

function broadcast (players, data) {
  players.forEach(({ ws }) => ws.readyState === WebSocket.OPEN && send(ws, data))
}

function send (ws, data) {
  ws.send(JSON.stringify(data))
}
