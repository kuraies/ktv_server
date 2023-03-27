/**
 * axios挂载到vue上
 */
import Vue from 'vue'
import axios from 'axios'

let config = {
    // to_do 配置baseUrl
    baseURL: "http://localhost:3000",
    // 超时时间
    timeout: 60 * 1000
}

const _axios = axios.create(config)

// 请求拦截
_axios.interceptors.request.use(request=>{

    return request
},error=>{
    return Promise.reject(error)
})

// 响应拦截
_axios.interceptors.response.use(response=>{

    console.log('axios response=>',response)

    return response
},error=>{
    console.log('error response=>',error.response)
    
    return Promise.reject(error.response)
})


// 插件的方式注册axios到vue实例中
// this.$axios
Plugin.install = function(Vue,options){
    Vue.axios = _axios
    window.axios = _axios // 可以选择是否添加
    // 注册到Vue的原型对象上
    // Object.defineProperties() 给一个对象动态添加属性，并且设置属性的属性 

    Object.defineProperties(Vue.prototype,{
        axios:{
            get(){
                return _axios;
            }
        },
        $axios:{
            get(){
                return _axios
            }
        }
    })
}

Vue.use(Plugin)

export default Plugin