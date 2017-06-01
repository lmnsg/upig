<template>
  <div class="wrapper">
    <canvas class="canvas" ref="canvas" :width="width" :height="width"></canvas>
    <div class="tools" :class="{ active2: touchedTolls }" @touchstart="touchTools">
      <button class="iconfont icon-chexiao" @click="undo" type="button"></button>
      <button class="iconfont icon-chongzuo" @click="redo" type="button"></button>
      <Compact class="picker" v-model="colors"></Compact>
    </div>
  </div>
</template>

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
    &.active2 {
      opacity: 1;
    }
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

</style>
<style>
  .picker li {
    margin-right: -4px;
    width: 20px;
    height: 20px;
    border-radius: 15px;
  }
</style>

<script>
  import { Compact } from 'vue-color'
  import Drew from './Drew'
  import { open } from '../client'

  export default {
    name: 'Canvas',
    data() {
      return {
        width: window.innerWidth - 8,
        ws: open('/room'),
        colors: {
          hex: '#4d4d4d'
        },
        touchedTolls: false
      }
    },
    created() {
      this.$watch('colors.hex', (hex) => this.drew.setLineStyle({ color: hex }))
    },
    methods: {
      undo() {
        this.drew.undo()
        this.ws.send(JSON.stringify({
          type: 'undo'
        }))
      },
      redo() {
        this.drew.redo()
        this.ws.send(JSON.stringify({
          type: 'redo'
        }))
      },
      touchTools() {
        this.touchedTolls = true

        clearTimeout(this.touchedTollsTimer)
        this.touchedTollsTimer = setTimeout(() => {
          this.touchedTolls = false
        }, 3000)
      }
    },
    mounted() {
      this.drew = new Drew(this.$refs.canvas, this.ws)
      this.drew.setLineStyle({ color: this.colors.hex })
    },
    components: {
      Compact
    }
  }
</script>
