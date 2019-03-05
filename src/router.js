import Vue from "vue";
import Router from "vue-router";
import index from "./components/index.vue"
import home from "./view/home.vue"
import product from "./view/product.vue"
Vue.use(Router);
// export const loginRouter = {
//     path: '/login',
//     name: 'login',
//     meta: {
//         title: 'Login - 登录'
//     },
//     component: indexHeader
// };
export const indexRouter = {
    path: '/',
    name: 'otherRouter',
    component: index,
    redirect: '/home',
    children: [
        { path: 'home', title: '首页1', name: 'Home',component: home},
        { path: 'product/:a', title: 'chanp', name: 'product',component: product},
    ]
};


export const routers = [
    // loginRouter,
    indexRouter,
];
const RouterConfig = {
    // mode: 'history',
    routes: routers
};




export const router = new Router(RouterConfig);


export default router;
