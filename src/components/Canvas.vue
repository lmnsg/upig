<template>
  <div class="wrapper">
    <canvas class="canvas" ref="canvas" :width="width" :height="width"></canvas>
    <div class="tools" :class="{ active: touchedTolls, transparent: !isDrawer }" @touchstart="touchTools">
      <div class="row">
        <button class="iconfont icon-clear clean" @click="clear"></button>
        <div class="nibs">
          <div class="nib-wrap" v-for="(nib, index) in nibs" @click="activeNibIndex = index">
          <span :class="{ active: index === activeNibIndex }"
                :style="{ width: nib * 2 + 'px', height: nib * 2 + 'px', background: colors.hex }">
          </span>
          </div>
        </div>
      </div>
      <div class="row">
        <button class="iconfont icon-chexiao" @click="undo" type="button"></button>
        <button class="iconfont icon-chongzuo" @click="redo" type="button"></button>
        <Compact class="picker" v-model="colors"></Compact>
      </div>
    </div>
  </div>
</template>

<script>
  import { Compact } from 'vue-color'
  import Draw from './Draw'

  export default {
    name: 'Canvas',
    props: ['ws', 'game', 'isDrawer'],
    data() {
      return {
        width: window.innerWidth - 8,
        colors: {
          hex: '#4d4d4d'
        },
        nibs: [2, 4, 6, 8],
        activeNibIndex: 0,
        touchedTolls: false
      }
    },
    created() {
      this.$watch('colors.hex', (hex) => {
        this.draw.setLineStyle({ color: hex })
        this.ws.sendJSON({
          action: 'setLineStyle',
          args: [{ color: hex }]
        })
      })
      this.$watch('activeNibIndex', (index) => {
        this.draw.setLineStyle({ width: this.nibs[index] })
        this.ws.sendJSON({
          action: 'setLineStyle',
          args: [{ width: this.nibs[index] }]
        })
      })
    },
    methods: {
      clear() {
        const clear = window.confirm('清空画布咯?')
        if (clear) {
          this.draw.clean()
        }
        this.ws.sendJSON({
          action: 'clean'
        })
      },
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
        const { draw, $refs: { canvas } } = this

        canvas.addEventListener('touchstart', () => {
          this.ws.sendJSON({
            action: 'touch',
            args: [draw._lastX, draw._lastY, draw.rect.width]
          })
        }, { passive: true })

        canvas.addEventListener('touchmove', () => {
          this.ws.sendJSON({
            action: 'drawing',
            args: [draw._lastX, draw._lastY, draw.rect.width]
          })
        }, { passive: true })

        canvas.addEventListener('touchend', () => {
          this.ws.sendJSON({
            action: 'drawingEnd'
          })
        }, { passive: true })
      }
    },
    mounted() {
      const { $refs: { canvas } } = this
      const draw = this.draw = new Draw(canvas)
      this.listenDraw()
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
    margin-top: -60px;
    padding: 0 6px;
    height: 60px;
    opacity: 1;
    transition: opacity .6s;
    -webkit-transform: translate3d(0, 0, 0);

    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .clean {
    }
    .nibs {
      flex: 1;
      font-size: 0;
      width: 100px;
      text-align: right;
      .nib-wrap {
        display: inline-block;
        width: 20px;
        height: 20px;
        vertical-align: middle;
        line-height: 20px;
      }

      span {
        position: relative;
        display: inline-block;
        margin-left: 4px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
      }
      span.active {
        &::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 100%;
          background: #fff;
          transform: scale(.5) translate(-100%, -100%);
          border-radius: 50%;
        }

      }
    }

    .picker {
      width: 202px;
      height: 25px;
      margin: -5px 0 0 auto;
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
