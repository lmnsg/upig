<script type="text/jsx">
  export default {
    render() {
      return (
        <div class="dialog">
          {this.$slots.default}
        </div>
      )
    }
  }
</script>

<style scoped="">
  .dialog {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, .3);
  }
</style>
