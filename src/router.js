import Vue from "vue";
import Router from "vue-router";
import index from "./components/index.vue"
import home from "./view/home.vue"
import login from "./view/login.vue"
import test from "./view/test.vue"
import classificationdetails from "./view/ClassificationDetails.vue"
Vue.use(Router);
// export const loginRouter = {
//     path: '/login',
//     name: 'login',
//     meta: {
//         title: 'Login - 登录'
//     },
//     component: login
// };
export const indexRouter = {
    path: '/',
    name: 'otherRouter',
    component: index,
    redirect: '/home',
    children: [
        { path: 'home', title: '首页1', name: 'Home',component: home },
        { path: 'login', title: '登录', name: 'login',component: login,},
        { path: 'classificationdetails', title: '产品平台', name: 'classificationdetails',component: classificationdetails},
        { path: 'test', title: 'test', name: 'test',component: test, meta: {role:["user","admin"]}},
    ]
};


export const routers = [
    // loginRouter,
    indexRouter,
    {path: "*", redirect: "/"}
];
const RouterConfig = {
    // mode: 'history',
    routes: routers
};


export const router = new Router(RouterConfig);

router.beforeEach((to,from,next)=>{
    console.info(to)
    console.info(from)
    if (to.meta.role!=null){
        next({
            path: '/login',
            query: {redirect: to.fullPath}
        })
    }
    next();
})


export default router;
