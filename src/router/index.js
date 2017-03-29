import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/components/register'
import Login from '@/components/login'
import Account from '@/components/accountLine'
import addAccount from '../components/addAccount'
import accountIncome from '../components/accountIncome'
import accountExart from '../components/accountExart.vue'
import accountChart from '../components/accountChart.vue'
import menu from '../components/menu.vue'


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
          path:"accountincome",
          component:accountIncome
        },
        {
          path:"accountextra",
          component:accountExart
        },
        {
          path:"accountchart",
          component:accountChart
        }
      ]
    }
  ]
})
