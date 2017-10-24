import words from '../word/db.json'

export default class Words {
  constructor () {
    this.init()
  }

  init() {
    this.words = words.sort(() => 0.5 - Math.random())
  }

  getWord() {
    if (this.words.length === 0) {
      this.init()
    }
    return this.words.shift()
  }
}
