import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/components/register'
import Login from '@/components/login'
import Account from '@/components/account'
import addAccount from '../components/addAccount'


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
      path:'/account',
      component:Account
    },
    {
      path:'/addaccount',
      component:addAccount
    }
  ]
})
