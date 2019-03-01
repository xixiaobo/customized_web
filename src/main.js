import Vue from 'vue'
import App from './App.vue'
// import router from "./router";
// import store from "./store";
import iview from "iview";
import VueRouter from "vue-router";
import 'iview/dist/styles/iview.css';
// import axios from './axios';

Vue.use(VueRouter);
Vue.use(iview);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
