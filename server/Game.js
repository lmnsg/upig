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
    this.players = []
    this.drawer = 0
    this.imageData = null
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
    return this.word
  }
}
