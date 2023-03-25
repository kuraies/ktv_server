/**
 * 二次封装Element-ui中的Loading组件
 */

import {Loading} from 'element-ui'
import Vue from 'vue'

let loadingInstance = null 

export default {
    // 开始加载
    /**
     * 
     * @param {*} msg 加载的时候提示的信息
     * @param {*} bgColor 加载的时候背景颜色
     * @param {*} fullScreen 加载的loading是否全屏
     */
    start:(msg,bgColor,fullScreen)=>{
        loadingInstance = Loading.service({
            fullscreen:fullScreen ? fullScreen : true,
            text:msg ? msg :'正在加载中',
            background:bgColor ? bgColor : 'rgba(0,0,0,0.7)',
            lock:true
        })
    },

    // 结束加载
    end:()=>{
        Vue.nextTick(()=>{
            loadingInstance.close()
        })
    }
}