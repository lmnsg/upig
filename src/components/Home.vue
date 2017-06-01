<template>
  <div class="home">
    <button @click="start" class="start iconfont icon-kaishi"> 开始游戏 </button>
  </div>
</template>

<script type="text/babel">
  import { storage } from '../util'

  export default {
    methods: {
      start() {
        const user = storage.getItem('user')

        if (user) {
          this.go(user.id)
        } else {
          // todo 注册
        }
      },
      go(id) {
        this.$router.push({ name: 'game', params: { id } })
      }
    }
  }
</script>

<style scoped>
  .home {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: #d19bb0;
  }

  .start {
    display: block;
    width: 200px;
    height: 40px;
    background: #1f80c4;
    color: #fff;
    border-radius: 20px;
  }
</style>
