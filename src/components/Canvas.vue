<template>
  <div class="canvas">
    <canvas ref="canvas" :width="width" :height="width"></canvas>
  </div>
</template>

<style>
  canvas {
    display: block;
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
