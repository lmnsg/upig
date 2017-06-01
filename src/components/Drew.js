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
      const { type, x, y, width } = JSON.parse(data)
      let scale = 1

      if (width) {
        scale = this.rect.width / width
      }

      this[type](x * scale, y * scale)
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
    const { rect } = this
    const getXY = (touch) => {
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      }
    }

    $canvas.addEventListener('touchstart', ({ touches }) => {
      const { x, y } = getXY(touches[0])
      this.start(x, y)
      this.ws.send(JSON.stringify({
        type: 'start',
        x,
        y,
        width: rect.width
      }))
    }, { passive: true })

    $canvas.addEventListener('touchmove', (e) => {
      e.preventDefault()
      const { x, y } = getXY(e.touches[0])
      this.drawing(x, y)
      this.ws.send(JSON.stringify({
        type: 'drawing',
        x,
        y,
        width: rect.width
      }))
    })

    $canvas.addEventListener('touchend', () => {
      this.drawingEnd()
      this.ws.send(JSON.stringify({
        type: 'drawingEnd'
      }))
    }, { passive: true })
  }

  start (x, y) {
    const { ctx } = this
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + 0.01)
    ctx.stroke()

    this._lastX = x
    this._lastY = y
  }

  drawing (x, y) {
    const { ctx, _lastX, _lastY } = this
    const dx = x - _lastX
    const dy = y - _lastY

    if (dx * dx + dy * dy < 4) return

    ctx.beginPath()
    ctx.moveTo(_lastX, _lastY)
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

  setLineStyle ({ width, color }) {
    if (width) this._lineWidth = width
    if (color) this._lineColor = color
    this.init()
  }
}
