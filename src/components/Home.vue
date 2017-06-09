<template>
  <div class="home">
    <button @click="start" class="start iconfont icon-kaishi"> 开始游戏 </button>
    <Register @done="go" v-model="showRegister"></Register>
  </div>
</template>

<script>
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
        const id = uuid.v1()
        this.$router.push({ name: 'game', params: { id } })
        const owner = storage.getItem('owner') || {}
        owner[id] = 1
        storage.setItem('owner', owner)
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
