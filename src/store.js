/**
 * Created by huangpeisong on 2017/4/2.
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

var state = {
  account: []
};

//
// var mutations = {
//   update(state, v){
//     state.account = v.account;
//   }
// };

var mutations = {
  update: function (state, v) {
    state.account = v.account;
  }
};

// var getters = {
//   doneAccount: state => {
//     return state.account;
//   }
// };


var getters = {
  doneAccount: function (state) {
    return state.account;
  }
};

export default new Vuex.Store({
  state,
  mutations,
  getters
})