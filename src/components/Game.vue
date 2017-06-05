<template>
  <div class="board">
    <div class="header">
      <div class="counter"></div>
      <div class="key">{{ title }}</div>
      <!--<span class="key">猜：</span>-->
    </div>
    <div class="main">
      <MyCanvas v-if="ws" :ws="ws"></MyCanvas>
      <div v-if="game" class="players">
        <div class="player" v-for="player in game.players">
          <span class="name">{{ player.user.name }}</span>
          <span class="grade">{{ player.grade }}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <input class="chat-input" type="text">
    </div>
    <div class="table"></div>
    <Register @done="join" v-model="showRegister"></Register>
  </div>
</template>

<script>
  import Canvas from './Canvas.vue'
  import Register from './sub/Register.vue'
  import { open } from '../client'
  import { storage } from '../util'

  export default {
    data() {
      return {
        ws: null,
        showRegister: false,
        user: null,
        game: null,
        title: '请转发邀请好友加入游戏',
        board: {
          width: 0,
          height: 0
        }
      }
    },
    created() {
      const { id } = this.$route.params
      const ws = this.ws = open(`/${id}`)
      const user = storage.getItem('user')

      if (!user) {
        this.showRegister = true
      } else {
        ws.addEventListener('open', () => this.join(user))
      }

      ws.addEventListener('message', ({ data }) => {
        const _data = JSON.parse(data)
        if (_data.action === 'game') this.game = _data.game
      })
    },
    methods: {
      join(user) {
        this.user = user
        this.ws.sendJSON({
          action: 'join',
          user
        })
      }
    },
    mounted() {
      this.board.height = this.board.width = window.innerWidth
    },
    components: {
      MyCanvas: Canvas,
      Register
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

    .players {
      .player {
        display: inline-block;
        margin: 6px 0 0 10px;
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        border: 1px #d19bb0 solid;
        background: #fff;
        border-radius: 15px;
        font-size: 12px;
        color: #666;
      }
      .grade {
        font-size: 14px;
        color: #d19bb0;
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
