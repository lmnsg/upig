import Words from './Words'
import { words } from './word.json'
exports.games = {}

exports.Player = class Player {
  constructor ({ user, grade, ws }) {
    this.user = user
    this.grade = grade || 0

    Object.defineProperty(this, 'ws', {
      value: ws,
      writable: true,
      configurable: true,
      enumerable: false
    })
  }
}

exports.Game = class Game {
  constructor () {
    this.state = 0
    this.totalTimes = 90
    this.players = []
    this.drawer = 0
    this.drawerOrder = []
    this.imageData = null
    this.pointOut = false
    this._words = []
    this.words = []
    this.word = ''

    Object.defineProperties(this, {
      _words: {
        value: [],
        writable: true,
        configurable: true,
        enumerable: false
      },
      words: {
        value: [],
        writable: true,
        configurable: true,
        enumerable: false
      }
    })
  }

  getWord () {
    if (!this._words.length) this._words = new Words(words, this.players.length)
    if (!this.words.length) this.words = this._words.getWords()
    this.word = this.words.pop()
    return this
  }

  findPlayerByWs (ws) {
    return this.players.find((player) => ws === player.ws)
  }

  nextDrawer() {
    if (this.drawer >= this.players.length - 1) {
      this.drawer = 0
    } else {
      this.drawer++
    }
    return this
  }

  /**
   * 生成 drawer 队列
   * @returns {Game}
   */
  getFirstDrawer () {
    const { players } = this
    this.drawer = Math.floor(Math.random() * players.length)
    return this
  }

  begin () {
    this.genDrawerOrder()
      .getDrawer()
      .getWord()
      .state = 1
  }
}
