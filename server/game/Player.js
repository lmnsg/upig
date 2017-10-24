import { def } from '../../util/shared'

export default class Player {
  constructor({ user, ws }) {
    this.user = user
    this.score = 0

    def(this, 'ws', ws)
  }
}
