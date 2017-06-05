import Vue from 'vue'
import Router from 'vue-router'
import Game from '../components/Game.vue'
import Home from '../components/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/game/:id',
      name: 'game',
      component: Game
    },
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})
