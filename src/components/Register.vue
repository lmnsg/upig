<template>
  <div class="wrapper">
    <div class="register">
      <div class="title">你的名字?</div>
      <form class="form" @submit.prevent="doRegister">
        <input class="g-name" type="text" v-model="name">
        <button type="submit" class="button">→</button>
      </form>
    </div>
  </div>
</template>

<script>
  import { storage } from '@/util'

  export default {
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

        const user = {
          name: pureName
        }
        storage.setItem('user', user)
        this.$router.back()
      },
      getName() {
        this.name = ''
      }
    },
    created() {
      this.getName()
    }
  }
</script>

<style lang="scss" scoped="">
  .wrapper {
    flex: 1;
    background: #fff;
  }

  .register {
    margin: 50% auto;
    width: 300px;
    border-radius: 4px;
    background: #fff;

    .title {
      text-align: center;
      color: #D17B8E;
      font-size: 20px;
    }
    .form {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 20px;
      padding: 0 20px;
    }
    .g-name {
      display: block;
      width: 100%;
      height: 40px;
      text-align: center;
      font-size: 16px;
      color: #444;
      border-bottom: 1px #D17B8E solid;
    }
    .button {
      margin-top: 20px;
      color: #D17B8E;
      font-size: 20px;
      font-weight: 600;
      animation: button .6s ease infinite alternate;
    }
    .tip {
      margin-top: 14px;
      font-size: 12px;
      color: #D17B8E;
      text-align: center;
    }
  }

  @keyframes button {
    from {
      transform: translate(-4px, 0);
    }
    to {
      transform: translate(4px, 0);
    }
  }
</style>
