export default class Draw {
  constructor ($canvas) {
    this._lineWidth = 2
    this._lineColor = 'red'
    this._history = []
    this._redoQueue = []
    this._lastX = 0
    this._lastY = 0
    this._points = []
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
      this.touch(x, y)
    }, { passive: true })

    $canvas.addEventListener('touchmove', (e) => {
      e.preventDefault()
      const { x, y } = getXY(e.touches[0])
      this.drawing(x, y)
    })

    $canvas.addEventListener('touchend', () => {
      this.drawingEnd()
    }, { passive: true })
  }

  touch (x, y) {
    const { ctx } = this
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + 0.01)
    ctx.stroke()

    this._lastX = x
    this._lastY = y

    this._points.push({ x, y })
  }

  drawing (x, y) {
    const { ctx, _lastX, _lastY, _points } = this
    const dx = x - _lastX
    const dy = y - _lastY

    if (dx * dx + dy * dy < 4) return

    ctx.beginPath()
    ctx.moveTo(_points[0].x, _points[0].y)
    _points.push({ x, y })

    for (let i = 0; i < _points.length - 1; i++) {
      ctx.quadraticCurveTo(_points[i].x, _points[i].y, (_points[i].x + _points[i + 1].x) / 2, (_points[i].y + _points[i + 1].y) / 2)
    }

    ctx.stroke()

    this._lastX = x
    this._lastY = y
  }

  drawingEnd () {
    this._history.push(this._getImageData())
    this._points = []
  }

  _clear () {
    const { ctx, rect } = this
    ctx.clearRect(0, 0, rect.width, rect.height)
  }

  clean() {
    this._history.push(this._getImageData())
    this._clear()
  }

  undo () {
    const { ctx, _history, _redoQueue } = this
    this._clear()
    if (_history.length > 1) {
      _redoQueue.push(_history.pop())
      ctx.putImageData(_history[_history.length - 1], 0, 0)
    }
  }

  redo () {
    const { ctx, _history, _redoQueue } = this

    if (_redoQueue.length) {
      this._clear()
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
