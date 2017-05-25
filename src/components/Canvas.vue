<template>
  <div class="canvas">
    <canvas ref="canvas" :width="width" :height="width"></canvas>
    <button @click="undo" type="button">undo</button>
  </div>
</template>

<style>
  canvas {
    display: block;
  }
  button {
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
        drew: {}
      }
    },
    methods: {
      undo() {
        this.drew.undo()
      }
    },
    mounted() {
      this.drew = new Drew(this.$refs.canvas)
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
