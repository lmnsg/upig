const fs = require('fs')
const path = require('path')

const words = fs.readFileSync(path.resolve(__dirname, './db.txt')).toString().split(' ').map((value) => ({ value, type: '' }))

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
