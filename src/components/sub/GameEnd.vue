<script type="text/jsx">
  export default {
    props: ['game'],
    methods: {
      renderPlayers() {
        const { players } = this.game
        // force clean ob
        return [].concat(players)
          .sort((p1, p2) => p2.user.score - p1.user.score)
          .map((player) => (<li>{player.user.name} - {player.user.score}</li>))
      },
      restart() {
        this.$parent.ws.sendJSON({ action: 'beginGame' })
      }
    },
    render() {
      return (
        <div class="game-end">
          <p class="title">游戏结束</p>
          <ul class="players">
            {this.renderPlayers()}
          </ul>
          <button class="button" onClick={ this.restart }>再开一局</button>
        </div>
      )
    }
  }
</script>

<style lang="scss" scoped="">
  .game-end {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #d19bb0;
    .title {
      margin-top: 1em;
      color: #d19bb0;
      font-size: 30px;
    }
    .players {
      margin-top: 1em;
    }
    .button {
      margin-top: 2em;
      padding: .6em 2em;
      background: #1f80c4;
      color: #fff;
      font-size: 28px;
      border-radius: 0;
    }
  }
</style>
