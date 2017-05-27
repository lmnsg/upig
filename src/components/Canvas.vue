<template>
  <div class="canvas">
    <canvas ref="canvas" :width="width" :height="width"></canvas>
    <Compact class="picker" v-model="colors"></Compact>
    <button @click="undo" type="button">undo</button>
    <button @click="redo" type="button">redo</button>
    <div></div>
  </div>
</template>

<style scoped>
  canvas {
    display: block;
    margin: 10px;
    border: 1px red solid;
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
    data() {
      return {
        width: window.innerWidth - 20,
        ws: open('/room'),
        colors: {
          hex: '#4d4d4d'
        }
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
