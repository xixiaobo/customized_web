import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
import iview from "iview";
import VueRouter from "vue-router";
import  'lib-flexible'
import 'iview/dist/styles/iview.css';
import axios from './axios';
import common from './assets/js/common.js'
Vue.prototype.$axios = axios;
Vue.prototype.$common = common;
Vue.use(VueRouter);
Vue.use(iview);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
