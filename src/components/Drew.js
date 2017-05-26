export default class Drew {
  _lineWidth = 2
  _lineColor = 'red'
  _history = []
  _redoQueue = []
  _lastX
  _lastY

  constructor ($canvas) {
    this.$canvas = $canvas
    this.ctx = $canvas.getContext('2d')
    this.rect = $canvas.getBoundingClientRect()
    this._history.push(this._getImageData())
    this.bindListener($canvas)
    this.init()
  }

  init () {
    const { ctx, _lineWidth, _lineColor } = this
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = _lineWidth
    ctx.strokeStyle = _lineColor
  }

  _getImageData () {
    const { ctx, rect } = this
    return ctx.getImageData(0, 0, rect.width, rect.height)
  }

  bindListener ($canvas) {
    $canvas.addEventListener('touchstart', ({ touches }) => this.start(touches[0]), { passive: true })

    $canvas.addEventListener('touchmove', ({ touches }) => this.drawing(touches[0]), { passive: true })

    $canvas.addEventListener('touchend', () => this.drawingEnd(), { passive: true })
  }

  start ({ clientX, clientY }) {
    const { ctx, rect } = this
    const x = clientX - rect.left
    const y = clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + 0.01)
    ctx.stroke()

    this._lastX = x
    this._lastY = y
  }

  drawing ({ clientX, clientY }) {
    const { ctx, rect } = this
    const x = clientX - rect.left
    const y = clientY - rect.top
    const dx = x - this._lastX
    const dy = y - this._lastY

    if (dx * dx + dy * dy < 4) return

    ctx.beginPath()
    ctx.moveTo(this._lastX, this._lastY)
    ctx.lineTo(x, y)
    ctx.stroke()

    this._lastX = x
    this._lastY = y
  }

  drawingEnd () {
    this._history.push(this._getImageData())
  }

  clear () {
    const { ctx, rect } = this
    ctx.clearRect(0, 0, rect.width, rect.height)
  }

  undo () {
    const { ctx, _history, _redoQueue } = this

    this.clear()

    if (_history.length > 1) {
      _redoQueue.push(_history.pop())
      ctx.putImageData(_history[_history.length - 1], 0, 0)
    }
  }

  redo () {
    const { ctx, _history, _redoQueue } = this

    if (_redoQueue.length) {
      this.clear()
      ctx.putImageData(_redoQueue[_redoQueue.length - 1], 0, 0)
      _history.push(_redoQueue.pop())
    }
  }
}
