import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
import iview from "iview";
import VueQuillEditor from "vue-quill-editor"; //调用编辑器
import VueRouter from "vue-router";
import  'lib-flexible'
import 'iview/dist/styles/iview.css';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import axios from './axios';
import common from './assets/js/common.js'
Vue.prototype.$axios = axios;
Vue.prototype.$common = common;
Vue.use(VueRouter);
Vue.use(iview);
Vue.use(VueQuillEditor);
/* global require */
Vue.use(require('vue-wechat-title'))

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
