// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import Axios from 'axios'

import router from './router/index'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.config.productionTip = false;

Vue.use(ElementUI);
Axios.defaults.headers.common["Access-Control-Allow-Credentials"]="true";

Vue.prototype.$http = Axios;

router.beforeEach((to,from,next) =>{
  if(to.path!='/register'){
    Axios.get('/user/api/state')
      .then(function (res) {
        if(res.data.type=="success"){
          next();
        }
        else{
          next('/login')
        }
      })
  }
  next();


});

/* eslint-disable no-new */
 new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
