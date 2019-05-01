import Vue from "vue";
import Router from "vue-router";
import index from "./components/index.vue"
import home from "./view/home.vue"
import login from "./view/login.vue"
import register from "./view/register.vue"
import backstage from "./components/backstage.vue"
import adduser from "./view/user/adduser.vue"
import updatauser from "./view/user/updatauser.vue"
import userlist from "./view/user/usersmanger.vue"
import classfiylist from "./view/platform/classmanger.vue"
import productDetails from "./view/platform/product/productDetails.vue"
import addproduct from "./view/platform/product/addproduct.vue"
import productlist from "./view/platform/product/productmanger.vue"
import taskDetails from "./view/platform/task/taskDetails.vue"
import addTask from "./view/platform/task/addTask.vue"
import taskmanger from "./view/platform/task/taskmanger.vue"
import ordermanger from "./view/platform/task/ordermanger.vue"
import store from "./store";
import { Message } from "iview";
import classificationdetails from "./view/ClassificationDetails.vue"
import TaskationDetails from "./view/TaskationDetails.vue"
import test from "./view/test.vue"
Vue.use(Router);
// export const loginRouter = {
//     path: '/login',
//     name: 'login',
//     meta: {
//         title: 'Login - 登录'
//     },
//     component: login
// };

export const backstageRouter = {
    path: '/backstage',
    name: 'backstage',
    component: backstage,
    children: [
        // { path: 'home', title: '首页1', name: 'Home',component: home },
        { path: 'adduser', title: '添加用户', name: 'adduser',component: adduser},
        { path: 'updatauser', title: '个人信息管理', name: 'updatauser',component: updatauser},
        { path: 'userlist', title: '用户列表', name: 'userlist',component: userlist},
        { path: 'classfiylist', title: '分类列表', name: 'classfiylist',component: classfiylist},
        { path: 'addproduct', title: '添加产品', name: 'addproduct',component: addproduct},
        { path: 'productlist', title: '产品列表', name: 'productlist',component: productlist},
        { path: 'addTask', title: '添加任务', name: 'addTask',component: addTask},
        { path: 'taskmanger', title: '任务列表', name: 'taskmanger',component: taskmanger},
        { path: 'ordermanger', title: '订单列表', name: 'ordermanger',component: ordermanger},
        { path: 'test', title: '订单列表', name: 'test',component: test},
    ]
};

export const indexRouter = {
    path: '/',
    name: 'otherRouter',
    component: index,
    redirect: '/home',
    children: [
        { path: 'home', title: '首页1', name: 'Home',component: home , meta: {role:'none'}},
        { path: 'login', title: '登录', name: 'login',component: login, meta: {role:'none'}},
        { path: 'register', title: '注册', name: 'register',component: register, meta: {role:'none'}},
        { path: 'classificationdetails', title: '产品平台', name: 'classificationdetails',component: classificationdetails , meta: {role:'none'}},
        { path: 'TaskationDetails', title: '任务平台', name: 'TaskationDetails',component: TaskationDetails , meta: {role:'none'}},
        { path: 'productDetails/:id', title: '产品详情', name: 'productDetails',component: productDetails, meta: {role:'none'}},
        { path: 'taskDetails/:id', title: '任务详情', name: 'taskDetails',component: taskDetails, meta: {role:'none'}},
    ]
};


export const routers = [
    // loginRouter,
    backstageRouter,
    indexRouter,
    // {path: "*", redirect: "/"}
];
const RouterConfig = {
    // mode: 'history',
    routes: routers
};


export const router = new Router(RouterConfig);

router.beforeEach((to,from,next)=>{
    let state={}
    if (sessionStorage.getItem("store") ) {
        state=JSON.parse(sessionStorage.getItem("store"))
        if (!state.islogin){
            state=store.state
        }
    }else {
        state=store.state
    }
    let urlrole=to.meta.role
    if (urlrole===null||urlrole!=='none'){
        if (!state.islogin){
            Message.error("请登录")
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        } else {
            next()
        }
    }else {
        next();
    }
})


export default router;
