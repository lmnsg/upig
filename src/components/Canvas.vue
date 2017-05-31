<template>
  <div class="canvas-wrapper" ref="wrapper">
    <canvas v-if="board.width" class="drewver" ref="canvas" :width="board.width" :height="board.height"></canvas>
    <Compact class="picker" v-model="colors"></Compact>
    <button @click="undo" type="button">undo</button>
    <button @click="redo" type="button">redo</button>
    <div></div>
  </div>
</template>

<style scoped>
  .canvas-wrapper {
    width: 100%;
    height: 100%;
  }
  .drewver {
  }
  button {
    margin: 40px;
    width: 40px;
    height: 100px;
    font-size: 24px;
  }

  .picker {
    width: 245px;
    height: 25px;
    margin: 0 auto;
    overflow: hidden;
  }
</style>

<script>
  import { Compact } from 'vue-color'
  import Drew from './Drew'
  import { open } from '../client'

  export default {
    name: 'Canvas',
    props: ['board'],
    data() {
      return {
        width: 0,
        height: 0,
        ws: open('/room'),
        colors: {
          hex: '#4d4d4d'
        }
      }
    },
    created() {
      this.$watch('colors.hex', (hex) => this.drew.setLineStyle({ color: hex }))
      this.$watch('board.width', (width) => {
        if (width > 0) {
          this.$nextTick(() => {
            this.drew = new Drew(this.$refs.canvas, this.ws)
            this.drew.setLineStyle({ color: this.colors.hex })
          })
        }
      })
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
      }
    },
    mounted() {
    },
    components: {
      Compact
    }
  }
</script>
