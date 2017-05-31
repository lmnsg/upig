import Vue from 'vue'
import Router from 'vue-router'
import Canvas from '../components/Canvas.vue'
import Home from '../components/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/game',
      name: 'game',
      component: Canvas
    },
    {
      path: '/room',
      name: 'room',
      component: Canvas
    },
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})
