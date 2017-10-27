import WebSocket from 'ws'
import Player from './Player'
import { send } from '../../util/ws'
import { def, delay } from '../../util/shared'
import WordPool from '../word'

export class Game {
  static time = 90
  static roundLoops = 2

  constructor() {
    this.state = 'ready'
    this.players = [] // 所有玩家
    this.round = {
      index: 0, // 回合数
      word: {},
      right: 0,  // 答对数
      pointOut: false,
      totalTimes: Game.time,
      drawer: 0,
      imageData: null,
      history: []
    }

    this.feedback = { // 回合结束的评价
      flowers: 0,
      shit: 0
    }

    def(this, 'words', new WordPool())
    def(this, 'roundTimer', null)
    def(this, 'roundTimer', null)
  }

  /**
   * 猜词
   * @param ws
   * @param text
   */
  guess(ws, text) {
    const player = this.findPlayerByWs(ws)
    const { players, round } = this

    // 猜错了
    if (text !== round.word.value) return this.$broadcast({ action: 'guess', user: player.user, text })

    // 猜对了
    const score = players.length - 1 - round.right
    player.score += score
    round.right++
    players[round.drawer].score++

    this.$broadcast({ action: 'guess', user: player.user, text: `猜对了! +${score}分` })

    // 全部答对
    if (round.right === players.length - 1) {
      this.roundEnd()
    }
  }

  /**
   * 回合倒计时
   */
  roundCounting() {
    const { round } = this
    this.roundTimer = setInterval(() => {
      this.$broadcast({ action: 'counting', time: --round.totalTimes })
      if (round.totalTimes === Game.time - 15) {
        // 15 秒后显示关键词提示
        this.round.pointOut = true
        this.update()
      } else if (round.totalTimes === 0) {
        // 90 秒后回合结束
        this.roundEnd()
      }
    }, 1000)
  }

  vote({ type }) {
    this.feedback[type]++
    this.update()
  }

  join(ws, user) {
    const { players } = this
    let exist = players.findIndex(({ user: { name } }) => user.name === name)

    if (exist !== -1) {
      players[exist].state = ''
      this.players[exist].ws = ws
      if (this.state === 'playing') {
        send(ws, { action: 'restore', history: this.round.history })
      }
      return this.update()
    }
    const player = new Player({ ws, user })

    if (user.isOwner) {
      // 房主在第一位
      this.players.unshift(player)
    } else {
      this.players.push(player)
    }

    this.update()
  }

  resetGameState() {
    this.round.index = 0
    this.players.forEach(({ user }) => user.score = 0)
  }

  begin() {
    this.resetGameState()
    this.nextRound()
  }

  end() {
    this.state = 'end'
    this.update()
  }

  resetRoundState() {
    const { feedback, round } = this
    this.state = 'playing'
    round.index++
    round.history.length = round.right = feedback.flowers = feedback.shit = 0
    round.totalTimes = Game.time
  }

  nextRound() {
    this.resetRoundState()
    this.nextDrawer()
    this.round.word = this.words.getWord()
    this.roundCounting()
    this.update()
  }

  update(task) {
    this.$broadcast({ action: 'game', game: this, task })
  }

  // 回合结束，展示积分
  roundEnd() {
    const { round } = this
    this.state = 'roundEnd'
    this.update()
    clearTimeout(this.roundTimer)
    if (round.index / this.players.length === Game.roundLoops) return this.end()
    delay(5, () => this.nextRound())
  }

  findPlayerByWs(ws) {
    return this.players.find((player) => ws === player.ws)
  }

  nextDrawer() {
    const { players, round } = this
    if (round.drawer === null) return round.drawer = Math.floor(Math.random() * players.length)
    if (round.drawer >= this.players.length - 1) {
      round.drawer = 0
    } else {
      round.drawer++
    }
  }

  $broadcast(data) {
    this.players.forEach(({ ws }) => ws.readyState === WebSocket.OPEN && send(ws, data))
  }
}
