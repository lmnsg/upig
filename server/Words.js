export default class Words {
  constructor (words, players) {
    this.words = words.sort(() => 0.5 - Math.random())
    this.players = players
  }

  /**
   * 取出对应 players 个数的词
   * @returns {undefined}
   */
  getWords() {
    return this.words.length ? this.words.splice(0, this.players) : undefined
  }
}
