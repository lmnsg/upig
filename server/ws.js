const WebSocket = require('ws')
const { games, Game, Player } = require('./Game')

module.exports = (server) => {
  const wss = new WebSocket.Server({ server })

  wss.on('connection', (ws, { url }) => {
    const uuid = url.slice(url.lastIndexOf('/') + 1)

    if (!games[uuid]) games[uuid] = new Game()
    const game = games[uuid]
    const sender = (() => (data) => send(ws, data))()
    const broadcaster = (() => (data) => broadcast(game.players, data))()

    sender({ action: 'game', game })

    ws.on('message', (message) => {
      const data = JSON.parse(message)

      switch (data.action) {
        case 'join':
          if (!game || !data) return
          const { players } = game
          const { user } = data

          let exist = players.findIndex(({ user: { name } }) => user.name === name)

          if (exist !== -1) {
            players[exist].state = ''
            game.players[exist].ws = ws
            return broadcaster({ action: 'game', game })
          }

          const player = new Player({ user: data.user, ws })

          if (data.isOwner) {
            // 房主在第一位
            game.players.unshift(player)
          } else {
            game.players.push(player)
          }

          broadcaster({ action: 'game', game })
          break

        case 'beginGame':
          game.state = 1
          game.drawer = getFirstDrawerByRandom(game.players)
          game.getWord()
          broadcaster({ action: 'beginGame', game })
          break

        default:
          broadcaster(data)
      }
    })

    ws.on('close', () => {
      const players = game.players
      const i = players.findIndex((player) => player.ws === ws)
      if (i > -1) {
        if (game.state === 0) {
          players.splice(i, 1)
        } else {
          players[i].state = 'leave'
        }
      }

      broadcaster({ action: 'game', game })
    })
  })
}

function broadcast (players, data) {
  players.forEach(({ ws }) => {
    ws.readyState === WebSocket.OPEN && send(ws, data)
  })
}

function send (ws, data) {
  ws.send(JSON.stringify(data, (key, val) => {
    if (key === 'queue') return Array.from(val)
    return val
  }))
}

function getFirstDrawerByRandom(players) {
  return Math.floor(Math.random() * players.length)
}
