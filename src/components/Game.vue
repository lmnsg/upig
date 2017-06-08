<template>
  <div class="board">
    <div class="header">
      <div class="counter"></div>
      <div class="key">{{ title }}</div>
      <!--<span class="key">猜：</span>-->
    </div>
    <div class="main">
      <MyCanvas ref="$canvas" v-if="ws" :ws="ws" :game="game" :is-owner="isOwner"></MyCanvas>
      <div v-show="game.state === 0 || !isOwner" class="shade"></div>
      <div v-show="game.state === 0">
        <button v-if="isOwner" @click="beginGame" class="btn-beginning">开始游戏</button>
        <button v-if="!isOwner" class="btn-beginning">等待房主开始游戏</button>
      </div>
    </div>

    <div v-if="game" class="players">
      <div class="player" :class="{ leave: player.state === 'leave' }" v-for="player in game.players">
        <span class="name">{{ player.user.name }}</span>
        <span class="grade">{{ player.grade }}</span>
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
      const owner = storage.getItem('owner')
      return {
        ws: null,
        showRegister: false,
        user: storage.getItem('user'),
        isOwner: owner && owner[this.$route.params.id],
        game: {},
        title: '快转发给好友吧！',
        board: {
          width: 0,
          height: 0
        }
      }
    },
    created() {
      this.initWS()
    },
    methods: {
      beginGame() {
        this.ws.sendJSON({
          action: 'beginGame'
        })
      },
      join() {
        const { user } = this
        if (user) {
          this.ws.sendJSON({
            action: 'join',
            user: this.user,
            isOwner: this.isOwner
          })
        } else {
          this.showRegister = true
        }
      },
      initWS() {
        const { id } = this.$route.params
        const ws = this.ws = open(`/${id}`)

        ws.addEventListener('close', () => setTimeout(() => this.initWS(), 500))
        ws.addEventListener('message', ({ data }) => {
          const { action, args, game } = JSON.parse(data)
          switch (action) {
            case 'game':
              this.game = game
              break

            case 'beginGame':
              this.game.state = 1
              break

            default:
              const draw = this.$refs.$canvas.draw
              const fn = draw[action]
              if (['touch', 'drawing'].indexOf(action) > -1) {
                const scale = draw.rect.width / args.pop()
                return fn.apply(draw, args.map((arg) => arg * scale))
              }

              fn && fn.apply(draw, args)
          }
        })

        return new Promise((resolve) => {
          ws.addEventListener('open', () => {
            this.join()
            resolve()
          })
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
  .board {
    background: repeating-linear-gradient(90deg, #e8bbcf, #e8bbcf 20px, #f2dee7 20px, #f2dee7 24px, #e8bbcf 24px, #e8bbcf 30px, #f2dee7 30px, #f2dee7 34px);
    display: flex;
    flex: 1;
    flex-direction: column;
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

    .main {
      position: relative;
      .shade {
        position: absolute;
        left: 0; right: 0; top: 0; bottom: 0;
        z-index: 2;
      }
      .btn-beginning {
        transform: translate(-50%, -50%);
        position: absolute;
        left: 50%;
        top: 50%;
        display: block;
        margin: 0 auto;
        width: 200px;
        height: 40px;
        background: #d19bb0;
        color: #fff;
        font-size: 16px;
        border-radius: 20px;
        z-index: 3;
      }
    }

    .players {
      flex: 1;
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
      .player.leave {
        opacity: .4;
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
