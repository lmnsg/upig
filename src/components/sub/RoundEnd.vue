<script type="text/jsx">
  import Dialog from './Dialog.vue'
  import bus from '../../bus'

  export default {
    props: ['game'],
    data() {
      return {
        ticket: 1
      }
    },
    methods: {
      count(type) {
        if (this.ticket) {
          this.ticket--
          this.game.feedback[type]++
          bus.$emit('vote', type)
        }
      }
    },
    watch: {
      'game.state'(state) {
        if (state === 'roundEnd') this.ticket = 1
      }
    },
    render() {
      const { feedback } = this.game

      return (
        <div class={{ 'round-end': true, show: this.game.state === 'roundEnd' }}>
          <p class="title">回合结束</p>
          <div class="actions">
            <button onClick={() => this.count('flowers')}>
              🌹
              <span class="count">{feedback.flowers}</span>
            </button>
            <button onClick={() => this.count('shit')}>
              💩
              <span class="count">{feedback.shit}</span>
            </button>
          </div>
        </div>
      )
    }
  }
</script>

<style lang="scss" scoped="">
  .round-end {
    display: none;
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    z-index: 3;
    text-align: center;
    color: #d19bb0;
    .title {
      margin-top: 2em;
      font: 24px STkaiti;
    }
    .actions {
      margin-top: 2em;
      font-size: 40px;
      button {
        margin: 0 1em;
        font-size: 40px;
      }
      .count {
        display: block;
        font-size: 20px;
        color: #d19bb0;
      }
    }
  }
  .round-end.show {
    display: block;
  }
</style>
