<template>
  <div class="main">
    <div class="board">
      <div class="wrapper" ref="wrapper" :style="{ width: board.width - 0 + 12 + 'px' }">
        <MyCanvas :board="board"></MyCanvas>
      </div>
      <div class="board-border" :style="{ width: board.width + 'px' }"></div>
      <div class="footer">
        <input class="chat-input" type="text">
      </div>
    </div>
    <div class="table"></div>
  </div>
</template>

<script>
  import Canvas from './Canvas.vue'

  export default {
    data() {
      return {
        board: {
          width: 0,
          height: 0
        }
      }
    },
    mounted() {
      const height = this.board.height = window.innerWidth
      this.board.width = height
    },
    components: {
      MyCanvas: Canvas
    }
  }
</script>

<style lang="scss" scoped>
  .board {
    position: absolute;
    left: 0; right: 0; top: 0; bottom: 0;
    background: repeating-linear-gradient(90deg, #e8bbcf, #e8bbcf 20px, #f2dee7 20px, #f2dee7 24px, #e8bbcf 24px, #e8bbcf 30px, #f2dee7 30px, #f2dee7 34px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .wrapper {
      position: relative;
      margin: 20px auto 0;
      flex: 1;
      border: 6px #945a44 solid;
      background: #fff;
      border-radius: 4px;
      overflow-y: hidden;
      z-index: 2;
    }
    .board-border {
      margin: 0 auto;
      height: 20px;
      background: #7a4533;
      transform: scaleY(1.2) perspective(1em) rotateX(5deg);
      transform-origin: bottom;
      position: relative;
      z-index: 1;
    }
    .footer {
      display: flex;
      padding: 6px 20px;
      height: 40px;
      background: #1f80c4;

      .chat-input {
        display: block;
        padding: 0 6px;
        appearance: none;
        border: none;
        border-radius: 2px;
        flex: 2;
        font-size: 14px;
      }
    }
  }
</style>
