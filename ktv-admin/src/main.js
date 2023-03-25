import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入axios插件
import './plugins/axios'

// element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// view-design
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'


Vue.config.productionTip = false

// 注册elementui插件
Vue.use(ElementUI);
// 注册view-design插件
Vue.use(ViewUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
