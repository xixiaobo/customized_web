import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user:{},
    islogin:false
  },
  mutations: {
    setUser(state,data){
      state.user=data;
      if(data===null){
        state.islogin=false
      }else {
        state.islogin=true
      }
    }
  },
  actions: {
    commitUser:({commit},user)=>commit('setUser',user)
  }
});
