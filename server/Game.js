exports.games = {}

exports.Player = class Player {
  constructor ({ user, grade, ws }) {
    this.user = user
    this.grade = grade || 0

    Object.defineProperty(this, 'ws', {
      value: ws,
      configurable: false,
      enumerable: false
    })
  }
}

exports.Game = class Game {
  constructor () {
    this.state = 0
    this.players = []
    this.imageData = null
  }
}
