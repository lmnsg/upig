<template>
  <div class="home">
    <button @click="start" class="start iconfont icon-kaishi"> 开始游戏 </button>
    <Register @done="go" v-model="showRegister"></Register>
  </div>
</template>

<script type="text/babel">
  import { storage } from '../util'
  import uuid from 'uuid'

  export default {
    data() {
      return {
        showRegister: false
      }
    },
    methods: {
      start() {
        const user = storage.getItem('user')

        if (user) {
          this.go()
        } else {
          this.showRegister = true
        }
      },
      go() {
        this.$router.push({ name: 'game', params: { uuid: uuid.v1() } })
      }
    },
    components: {
      Register: require('./sub/Register.vue')
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
