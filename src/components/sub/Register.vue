<template>
  <div v-show="value" class="register">
    <div class="title">你的名字?</div>
    <form class="form" @submit.prevent="doRegister">
      <input class="g-name" type="text" v-model="name">
      <p class="tip">下次可以直接使用此名字登录</p>
      <button type="button" class="refresh iconfont icon-refresh" @click="getName"></button>
      <button type="submit" class="button">→</button>
    </form>
  </div>
</template>

<script>
  import gName from 'faker-zh-cn/lib/name'
  import { storage } from '@/util'

  export default {
    props: ['value'],
    data() {
      return {
        name: ''
      }
    },
    computed: {
      pureName() { return this.name.trim() }
    },
    methods: {
      doRegister() {
        const { pureName } = this
        if (!pureName) return alert('你的名字？')

        storage.setItem('user', {
          name: pureName
        })
        this.$emit('done')
        this.$emit('input', false)
      },
      getName() {
        this.name = gName.findName()
      }
    },
    created() {
      this.getName()
    }
  }
</script>

<style lang="scss" scoped="">
  .register {
    position: absolute;
    width: 300px;
    border-radius: 4px;
    background: #fff;

    .title {
      padding: 20px 0 0;
      text-align: center;
      color: #D17B8E;
      font-size: 20px;
    }
    .form {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 200px;
      padding: 0 20px;
    }
    .g-name {
      display: block;
      width: 100%;
      height: 40px;
      text-align: center;
      font-size: 16px;
      color: #444;
      border-radius: 6px;
      border-bottom: 1px #D17B8E solid;
    }
    .button {
      margin-top: 20px;
      color: #D17B8E;
      font-size:  20px;
      font-weight: 600;
    }
    .refresh {
      position: absolute;
      right: 20px;
      top: 52px;
      color: #1f80c4;
    }
    .tip {
      font-size: 12px;
      color: #D17B8E;
      text-align: center;
      margin-top: 10px;
    }
  }
</style>
