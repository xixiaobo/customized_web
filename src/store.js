import '@babel/polyfill'
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user:{},
    islogin:false,
    webdata:{
      title:'web',
      log:'',
      indexImgs:[],
      loginImgs:[]
    }
  },
  mutations: {
    setUser(state,data){
      state.user=data;
      if(data===null){
        state.islogin=false
      }else {
        state.islogin=true
      }
    },
    setWebData(state,data){
      state.webdata=data;
    }
  },
  actions: {
    commitUser:({commit},user)=>commit('setUser',user),
    commitWebData:({commit},webdata)=>commit('setWebData',webdata),
  }
});
