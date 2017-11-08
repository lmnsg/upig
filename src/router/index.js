import Vue from 'vue'
import Router from 'vue-router'
import Game from '../components/Game.vue'
import Home from '../components/Home.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/logout',
      component: {
        render() {
          localStorage.clear()
        }
      }
    },
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

export default router
