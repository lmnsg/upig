const WebSocket = require('ws')
const { games, Game, Player, State } = require('./Game')

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
        case 'join': {
          if (!game || !data) return
          const { players } = game
          const user = data.user

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
        }

        case 'beginGame':
          game.begin()
          broadcaster({ action: 'game', game })
          setTimeout(() => {
            game.pointOut = true
            broadcaster({ action: 'game', game })
          }, 15 * 1000)
          game.roundTimer = setTimeout(() => game.nextRound(), 90 * 1000)
          break

        case 'guess':
          const guess = data.guess
          const user = game.findPlayerByWs(ws).user

          if (guess === game.word.value) {
            // 猜对加分
            const roundScore = game.players.length - game.right
            user.score += roundScore
            game.right++
            broadcaster({ action: 'message', user, text: `猜对了! +${roundScore}分` })

            if (game.right >= game.players.length) {
              clearTimeout(game.roundTimer)
              game.nextRound()
            }
          } else {
            // 广播猜错的词
            broadcaster({ action: 'message', user, text: guess })
          }
          break
        default:
          broadcaster(data)
      }
    })

    ws.on('close', () => {
      const players = game.players
      const index = players.findIndex((player) => player.ws === ws)
      if (index > -1) {
        if (game.state === State.WAITING) {
          players.splice(index, 1)
        } else {
          players[index].state = 'leave'
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
