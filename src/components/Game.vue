<template>
  <div class="board">
    <div class="header">
      <div v-show="roundTime && game.state === 'playing'" class="counter">{{ roundTime }}</div>
      <MyTitle :game="game"></MyTitle>
    </div>
    <div class="main" v-if="game">
      <MyCanvas ref="$canvas" v-if="ws" :ws="ws" :game="game" :is-drawer="isDrawer"></MyCanvas>
      <Barrage ref="barrage"></Barrage>
      <div v-show="showShade" class="shade"></div>
      <div v-show="game.state === 'ready'">
        <button v-if="isOwner" @click="beginGame" class="btn-beginning">
          {{ game.players.length > 1 ? '开始游戏' : '等待玩家加入' }}
        </button>
        <button v-if="!isOwner" class="btn-beginning">等待房主开始游戏</button>
      </div>
      <div class="round" v-show="showRound">
        第{{game.round.index}}回合
      </div>
      <RoundEnd v-if="game.state === 'roundEnd'" :game="game"></RoundEnd>
      <GameEnd v-if="game.state === 'end'" :game="game"></GameEnd>
    </div>

    <div v-if="game" class="players">
      <div class="player" :class="{ leave: player.state === 'leave' }" v-for="(player,$index) in game.players" track-by="$index">
        <i v-show="showHuabi($index)" class="iconfont icon-huabi"></i>
        <span class="name">{{ player.user.name === user.name ? '我' : player.user.name }}</span>
        <span class="grade">{{ player.score }}</span>
      </div>
    </div>

    <form class="footer" @submit.prevent="submitGuess">
      <input v-model="guess" :placeholder="isDrawer ? '不可提示哦' : '越早答对，分数越高哦'" class="chat-input" type="text">
      <button class="send-guess" type="submit">发送</button>
    </form>
    <div class="table"></div>
    <Register @done="join" v-model="showRegister"></Register>

    <div class="rank" v-show="showRank">

    </div>
  </div>
</template>

<script>
  import Canvas from './Canvas.vue'
  import Register from './sub/Register.vue'
  import RoundEnd from './sub/RoundEnd.vue'
  import { open } from '../client'
  import { storage } from '../util'
  import bus from '../bus'

  export default {
    data() {
      const owner = storage.getItem('owner')
      return {
        ws: null,
        showRound: false,
        showRegister: false,
        showRank: false,
        user: storage.getItem('user'),
        isOwner: owner && owner[this.$route.params.id],
        game: null,
        counter: 0,
        board: {
          width: 0,
          height: 0
        },
        guess: '',
        roundTime: 0,
        messages: []
      }
    },
    computed: {
      isDrawer() {
        if (!this.game || !this.user) return false
        const { round, players } = this.game
        if (!players[round.drawer]) return false
        return players[round.drawer].user.name === this.user.name
      },
      showShade() {
        const state = this.game.state
        if (state === 'end') return false
        return state === 'playing' ? !this.isDrawer : true
      }
    },
    watch: {
      'game.state'(state, old) {
        if (state === old) return
        this[state] && this[state]()
      },
      'game.round.index'(round, old) {
        if (!round || round === old || this.game.state !== 'playing') return
        this.showRound = true
        setTimeout(() => this.showRound = false, 1000)
      }
    },
    created() {
      this.initWS()
    },
    methods: {
      showHuabi(idx) {
        return this.game.state === 'playing' && idx === this.game.round.drawer
      },
      playing() {
        const $canvas = this.$refs.$canvas
        if (!$canvas) return
        $canvas.draw.clean()
        $canvas.draw._history = []
        this.messages = []
        if (this.isDrawer) {
          $canvas.setLine({
            color: $canvas.colors.hex,
            width: $canvas.nibs[$canvas.activeNibIndex]
          })
        }
      },
      end() {
        this.showRank = true
      },
      submitGuess() {
        const { isDrawer, game } = this
        if (isDrawer && game.state === 'playing') return
        this.ws.sendJSON({
          action: 'guess',
          guess: this.guess
        })
        this.guess = ''
      },
      beginGame() {
        this.ws.sendJSON({
          action: 'beginGame'
        })
      },
      join() {
        const user = this.user = storage.getItem('user')
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
      doDraw({ action, args }) {
        const draw = this.$refs.$canvas.draw
        const fn = draw[action]
        if (['touch', 'drawing'].indexOf(action) > -1) {
          const scale = draw.rect.width / args.pop()
          return fn.apply(draw, args.map((arg) => arg * scale))
        }
        fn && fn.apply(draw, args)
      },
      initWS() {
        const { id } = this.$route.params
        const ws = this.ws = open(`/${id}`)

        ws.addEventListener('close', () => setTimeout(() => this.initWS(), 500))
        ws.addEventListener('message', ({ data }) => {
          const msg = JSON.parse(data)
          const { action, game } = msg

          switch (action) {
            case 'game':
              this.game = game
              break

            case 'counting':
              this.roundTime = msg.time
              break

            case 'guess':
              this.$refs.barrage.shoot(`${msg.user.name}: ${msg.text}`)
              break

            case 'restore':
              const { history } = msg
              history.forEach((step) => this.doDraw(step))
              break

            default:
              if (this.isDrawer) return
              this.doDraw(msg)
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
      bus.$on('vote', (type) => this.ws.sendJSON({ action: 'vote', type }))
    },
    components: {
      MyCanvas: Canvas,
      MyTitle: require('./sub/Title.vue'),
      Register,
      RoundEnd,
      GameEnd: require('./sub/GameEnd.vue'),
      Barrage: require('./sub/Barrage.vue')
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
        font-size: 16px;
      }
      .counter {
        position: absolute;
        left: 10px;
        color: yellow;
        line-height: 40px;
        text-align: center;
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
        position: relative;
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
        margin-left: .3em;
        color: #d19bb0;
      }
      .icon-huabi {
        font-size: 12px;
        color: #d19bb0;
      }
    }
    .messages-box {
      margin: 10px 6px;
      padding: 6px 10px;
      flex: 1;
      font-size: 12px;
      border-radius: 4px;
      background: rgba(255, 255, 255, .5);
      color: #646464;
      overflow-y: scroll;
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
      .send-guess {
        margin-left: 20px;
        font-size: 14px;
        color: #fff;
      }
    }
    .round {
      position: absolute;
      left: 50%;
      top: 30%;
      transform: translate(-50%, 0);
      font: 24px STKaiti;
      color: #d19bb0;
    }
  }
</style>
