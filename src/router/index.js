import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/components/register'
import Login from '@/components/login'
import Account from '@/components/accountLine'
import addAccount from '../components/addAccount'
import accountChart from '../components/accountChart.vue'
import menu from '../components/menu.vue'
import superPower from '../components/superPower.vue'

  Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/register',
      component: Register
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/menu',
      component: menu,
      children: [
        {
          path: 'addcount',
          component: addAccount,
        },
        {
          path:'accountline',
          component:Account
        },
        {
          path:"accountchart",
          component:accountChart
        },
        {
          path:'superpower',
          component:superPower
        }
      ]
    }
  ]
})
