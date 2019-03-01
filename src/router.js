import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue"
import EurekaServes from "./components/EurekaServes.vue";
import EurekaIndex from "./views/EurekaIndex.vue";
import EurekaLogin from "./views/EurekaLogin.vue";
import EurekaRegiste from "./components/EurekaRegiste.vue"
import EurekaInfo from "./components/EurekaInfo.vue"
import Cookies from "js-cookie";

Vue.use(Router);
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: EurekaLogin
};

export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    component: EurekaIndex,
    redirect: '/home',
    children: [
        { path: 'home', title: '首页', name: 'Home',component: Home},
        { path: 'serves', title: '服务管理', name: 'EurekaServes',component:EurekaServes,
            meta: {
                requireAuth: true
            } },
        { path: 'registe', title: '服务注册时间详情', name: 'EurekaRegiste',component: EurekaRegiste,
            meta: {
                requireAuth: true
            } },
        { path: 'info', title: '注册中心详情', name: 'EurekaInfo',component: EurekaInfo,
            meta: {
                requireAuth: true
            } },
    ]
};


export const routers = [
    loginRouter,
    otherRouter
];
const RouterConfig = {
    // mode: 'history',
    routes: routers
};




export const router = new Router(RouterConfig);


router.beforeEach((to, from, next) => {
    if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
        if (Cookies.get("id")=="true") {// 判断是否登录
            next()
        } else {// 没登录则跳转到登录界面
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        }
    } else {
        next()
    }
})


export default router;
