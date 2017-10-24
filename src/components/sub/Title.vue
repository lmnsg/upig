<script type="text/jsx">
  export default {
    props: ['game'],
    computed: {
      title() {
        const { game, $parent } = this
        if (!game || ['end', 'roundEnd'].indexOf(game.state) !== -1) return
        if (game.state === 'ready') return '快转发给好友吧！'

        const { pointOut, word } = game.round
        const { type, value } = word
        return $parent.isDrawer
          ? `我画: ${value}`
          : `提示: ${pointOut ? `${type}, ${value.length}个字` : word.value.length + '个字'}`
      }
    },
    render() {
      return (<div class="title">{this.title}</div>)
    }
  }
</script>

<style scoped="">
  .title {
    flex: 1;
    color: #fff;
    text-align: center;
    line-height: 40px;
  }
</style>
