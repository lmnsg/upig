<template>
  <div class="wrapper">
    <canvas class="canvas" ref="canvas" :width="width" :height="width"></canvas>
    <div class="tools" :class="{ active: touchedTolls, transparent: !isOwner }" @touchstart="touchTools">
      <button class="iconfont icon-chexiao" @click="undo" type="button"></button>
      <button class="iconfont icon-chongzuo" @click="redo" type="button"></button>
      <Compact class="picker" v-model="colors"></Compact>
    </div>
  </div>
</template>

<script>
  import { Compact } from 'vue-color'
  import Draw from './Drew'

  export default {
    name: 'Canvas',
    props: ['ws', 'game', 'isOwner'],
    data() {
      return {
        width: window.innerWidth - 8,
        colors: {
          hex: '#4d4d4d'
        },
        touchedTolls: false
      }
    },
    created() {
      this.$watch('colors.hex', (hex) => {
        this.draw.setLineStyle({ color: hex })
        this.ws.sendJSON({
          action: 'setLineStyle',
          data: [{ color: hex }]
        })
      })
    },
    methods: {
      undo() {
        this.draw.undo()
        this.ws.send(JSON.stringify({
          action: 'undo'
        }))
      },
      redo() {
        this.draw.redo()
        this.ws.send(JSON.stringify({
          action: 'redo'
        }))
      },
      touchTools() {
        this.touchedTolls = true

        clearTimeout(this.touchedTollsTimer)
        this.touchedTollsTimer = setTimeout(() => {
          this.touchedTolls = false
        }, 3000)
      },
      listenDraw() {
        const { ws, draw, $refs: { canvas } } = this

        canvas.addEventListener('touchstart', () => {
          ws.sendJSON({
            action: 'touch',
            args: [draw._lastX, draw._lastY, draw.rect.width]
          })
        }, { passive: true })

        canvas.addEventListener('touchmove', () => {
          ws.sendJSON({
            action: 'drawing',
            args: [draw._lastX, draw._lastY, draw.rect.width]
          })
        }, { passive: true })

        canvas.addEventListener('touchend', () => {
          ws.sendJSON({
            action: 'drawingEnd'
          })
        }, { passive: true })
      },
      listenWS() {
        const { ws, draw } = this

        ws.addEventListener('message', ({ data }) => {
          const { action, args } = JSON.parse(data)
          const fn = draw[action]
          if (['touch', 'drawing'].indexOf(action) > -1) {
            const scale = draw.rect.width / args.pop()
            return fn.apply(draw, args.map((arg) => arg * scale))
          }

          fn && fn.apply(draw, args)
        })
      }
    },
    mounted() {
      const { $refs: { canvas } } = this
      const draw = this.draw = new Draw(canvas)
      this.listenDraw()
      this.listenWS()
      draw.setLineStyle({ color: this.colors.hex })
    },
    components: {
      Compact
    }
  }
</script>

<style lang="scss" scoped>
  .wrapper {
    padding: 6px 4px;
    background: #945a44;
  }

  .canvas {
    display: block;
    border-radius: 4px;
    background: #fff;
  }

  .tools {
    position: relative;
    display: flex;
    margin-top: -30px;
    padding: 0 6px;
    height: 30px;
    opacity: .3;
    transition: opacity .6s;
    -webkit-transform: translate3d(0, 0, 0);

    .picker {
      width: 202px;
      height: 25px;
      margin: 0 0 0 auto;
      box-shadow: none;
      overflow: hidden;
    }

    button {
      margin-right: 16px;
      line-height: 30px;
      color: #d19bb0;
      font-size: 24px;
    }
  }

  .tools.transparent {
    opacity: 0;
  }

  .tools.active {
    opacity: 1;
  }

</style>
<style>
  .picker li {
    margin-right: -4px;
    width: 20px;
    height: 20px;
    border-radius: 15px;
  }
</style>
