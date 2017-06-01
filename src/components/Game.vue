<template>
  <div class="board">
    <div class="header">
      <div class="counter"></div>
      <div class="key">画：三个字，动物</div>
      <!--<span class="key">猜：</span>-->
    </div>
    <div class="main">
      <MyCanvas></MyCanvas>
    </div>

    <div class="footer">
      <input class="chat-input" type="text">
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
      this.board.height = this.board.width = window.innerWidth
    },
    components: {
      MyCanvas: Canvas
    }
  }
</script>

<style lang="scss" scoped>
  .main {
    flex: 1;
  }

  .board {
    background: repeating-linear-gradient(90deg, #e8bbcf, #e8bbcf 20px, #f2dee7 20px, #f2dee7 24px, #e8bbcf 24px, #e8bbcf 30px, #f2dee7 30px, #f2dee7 34px);
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;

    .header {
      display: flex;
      padding: 0 6px;
      height: 40px;
      background: #d19bb0;
      .key {
        flex: 1;
        text-align: center;
        line-height: 40px;
        color: #fff;
        font-size: 20px;
      }
    }
    .footer {
      display: flex;
      padding: 6px 20px;
      height: 40px;
      background: #1f80c4;

      .chat-input {
        display: block;
        padding: 0 6px;
        background: #fff;
        appearance: none;
        border: none;
        border-radius: 2px;
        flex: 2;
        font-size: 14px;
      }
    }
  }
</style>
