export default class Drew {
  _lineWidth = 2
  _lineColor = 'red'
  _history = []
  _redoQueue = []
  _lastX
  _lastY

  constructor ($canvas, ws) {
    this.$canvas = $canvas
    this.ws = ws
    this.ctx = $canvas.getContext('2d')
    this.rect = $canvas.getBoundingClientRect()
    this._history.push(this._getImageData())
    this.bindListener($canvas)
    this.init()

    ws.onmessage = ({ data }) => {
      const { type, clientX, clientY, width } = JSON.parse(data)
      let scale = 1

      if (width) {
        scale = $canvas.width / width
      }

      this[type](clientX * scale, clientY * scale)
    }
  }

  init () {
    const { ctx, _lineWidth, _lineColor } = this
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = _lineWidth
    ctx.strokeStyle = _lineColor
  }

  _getImageData () {
    const { ctx, $canvas } = this
    return ctx.getImageData(0, 0, $canvas.width, $canvas.height)
  }

  bindListener ($canvas) {
    $canvas.addEventListener('touchstart', ({ touches }) => {
      const { clientX, clientY } = touches[0]
      this.start(clientX, clientY)
      this.ws.send(JSON.stringify({
        type: 'start',
        clientX,
        clientY,
        width: this.$canvas.width
      }))
    }, { passive: true })

    $canvas.addEventListener('touchmove', ({ touches }) => {
      const { clientX, clientY } = touches[0]
      this.drawing(clientX, clientY)
      this.ws.send(JSON.stringify({
        type: 'drawing',
        clientX,
        clientY,
        width: this.$canvas.width
      }))
    }, { passive: true })

    $canvas.addEventListener('touchend', () => {
      this.drawingEnd()
      this.ws.send(JSON.stringify({
        type: 'drawingEnd'
      }))
    }, { passive: true })
  }

  start (x, y) {
    const { ctx, rect } = this
    const _x = x - rect.left
    const _y = y - rect.top

    ctx.beginPath()
    ctx.moveTo(_x, _y)
    ctx.lineTo(_x, _y + 0.01)
    ctx.stroke()

    this._lastX = _x
    this._lastY = _y
  }

  drawing (x, y) {
    const { ctx, rect } = this
    const _x = x - rect.left
    const _y = y - rect.top
    const dx = _x - this._lastX
    const dy = _y - this._lastY

    if (dx * dx + dy * dy < 4) return

    ctx.beginPath()
    ctx.moveTo(this._lastX, this._lastY)
    ctx.lineTo(_x, _y)
    ctx.stroke()

    this._lastX = _x
    this._lastY = _y
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

  setLineStyle({ width, color }) {
    if (width) this._lineWidth = width
    if (color) this._lineColor = color
    this.init()
  }
}
