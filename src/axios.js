import axios from 'axios'
// import qs from 'qs'

// var url=serve.url
// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.baseURL = url;

//
// //POST传参序列化
// axios.interceptors.request.use((config) => {
//     if(config.method  === 'post'){
//         config.data = qs.stringify(config.data);
//     }
//     return config;
// },(error) =>{
//     return Promise.reject(error);
// });
//
// //返回状态判断
// axios.interceptors.response.use((res) =>{
//     if(!res.data.success){
//         return Promise.reject(res);
//     }
//     return res;
// }, (error) => {
//     //404等问题可以在这里处理
//     return Promise.reject(error);
// });

export default axios
