<script type="text/jsx">
  export default {
    data() {
      return {
        duration: 3000,
        speed: 0,
        delayQueue: []
      }
    },
    render() {
      return (
        <div class="barrage">
          <ul ref="wrapper" class="list"/>
        </div>
      )
    },
    methods: {
      shoot(bullet) {
        const { delayQueue, $refs, duration } = this
        const $wrapper = $refs.wrapper
        const last = Array.from($wrapper.querySelectorAll('.bullet')).pop()
        delayQueue.push(this.getDelay(last))

        const next = document.createElement('li')
        next.innerText = bullet
        next.classList.add('bullet')
        next.style.animation = `bullet ${duration}ms linear ${delayQueue.reduce((prev, next) => prev += next)}ms`
        $wrapper.appendChild(next)
      },
      getDelay(last) {
        if (!last) return 0
        const lastWidth = last.clientWidth
        const left = last.offsetLeft
        const range = left + lastWidth + 20 - this.width

        if (range <= 0) {
          return 0
        } else {
          return range / ((this.width + lastWidth) / this.duration)
        }
      }
    },
    mounted() {
      const { clientWidth } = this.$refs.wrapper
      this.width = clientWidth

      this.$refs.wrapper.addEventListener('animationend', (e) => {
        this.delayQueue.shift()
        this.$refs.wrapper.removeChild(e.target)
      })
    }
  }
</script>

<style lang="scss">
  .barrage {
    position: absolute;
    left: 0; right: 0; top: 0;
    z-index: 3;
    .bullet {
      position: absolute;
      left: 100%;
      top: 1em;
      display: inline-block;
      padding: 0 .8em;
      height: 2em;
      line-height: 1.8em;
      font-size: 12px;
      border-radius: 1em;
      border: 1px solid #d09aaf;
      color: #1f80c4;
      white-space: nowrap;
      animation-fill-mode: forwards;
    }
  }

  @keyframes bullet {
    from {
      left: 100%;
      transform: translate(0, 0);
    }

    to {
      left: 0;
      transform: translate(-100%, 0);
    }
  }
</style>
