<template>
  <div class="canvas">
    <canvas ref="canvas" :width="width" :height="width"></canvas>
    <button @click="undo" type="button">undo</button>
    <button @click="redo" type="button">redo</button>
    <input type="color">
  </div>
</template>

<style>
  canvas {
    display: block;
  }
  button {
    margin: 40px;
    width: 40px;
    height: 100px;
    font-size: 24px;
  }
</style>

<script>
  import Drew from './Drew'
  export default {
    name: 'Canvas',
    data() {
      return {
        width: window.innerWidth,
      }
    },
    methods: {
      undo() {
        this.drew.undo()
      },
      redo() {
        this.drew.redo()
      }
    },
    mounted() {
      this.drew = new Drew(this.$refs.canvas)
      console.log(this.drew)
    },
    directives: {
      drew: {
        bind(el, binding) {
          el.addEventListener('touchstart', () => {
            console.log(0)
          }, false)
          el.addEventListener('touchstart', () => {
            console.log(0)
          }, false)
        }
      }
    }
  }
</script>
