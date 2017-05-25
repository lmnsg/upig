let _lastX
let _lastY

export default class Drew {
  lineWidth = 2
  lineColor = 'red'
  history = []

  constructor ($canvas) {
    this.$canvas = $canvas
    this.ctx = $canvas.getContext('2d')
    this.rect = $canvas.getBoundingClientRect()
    this.bindListener($canvas)
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

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = this.lineWidth
    ctx.strokeStyle = this.lineColor

    ctx.moveTo(x, y)
    ctx.lineTo(x, y + 0.01)
    ctx.stroke()

    _lastX = x
    _lastY = y
  }

  drawing ({ clientX, clientY }) {
    const { ctx, rect } = this
    const x = clientX - rect.left
    const y = clientY - rect.top
    const dx = x - _lastX
    const dy = y - _lastY

    if (dx * dx + dy * dy < 4) return

    ctx.beginPath()
    ctx.moveTo(_lastX, _lastY)
    ctx.lineTo(x, y)
    ctx.stroke()

    _lastX = x
    _lastY = y
  }

  drawingEnd () {
    const { ctx, rect } = this
    this.history.push(ctx.getImageData(0, 0, rect.width, rect.height))
  }

  undo () {
    const { ctx, rect } = this
    ctx.clearRect(0, 0, rect.width, rect.height)
    ctx.putImageData(this.history[this.history.length - 2], 0, 0)
  }
}
