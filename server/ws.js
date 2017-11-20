import WebSocket from 'ws'
import { Game } from './game'
import { send } from '../util/ws'

const games = {}

module.exports = (server) => {
  const wss = new WebSocket.Server({ server })

  wss.on('connection', (ws, { url }) => {
    const uuid = url.slice(url.lastIndexOf('/') + 1)

    if (!games[uuid]) games[uuid] = new Game()
    const game = games[uuid]

    ws.on('message', (message) => {
      if (typeof message !== 'string') {
        console.log(message)
        return
      }
      const data = JSON.parse(message)

      switch (data.action) {
        case 'join': {
          if (!game || !data) return
          game.join(ws, data.user)
          break
        }

        case 'beginGame':
          game.begin()
          break

        case 'vote':
          game.vote(data)
          break

        case 'guess':
          game.guess(ws, data.guess)
          break
        default:
          game.round.history.push(data)
          game.$broadcast(data)
      }
    })

    ws.on('close', () => {
      const players = game.players
      const index = players.findIndex((player) => player.ws === ws)

      if (index > -1) {
        if (game.state === 'ready') {
          players.splice(index, 1)
        } else {
          players[index].state = 'leave'
        }
      }

      game.update()
    })
  })
}
