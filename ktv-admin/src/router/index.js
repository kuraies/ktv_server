import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由
import Login from '@/views/login'
import Home from '@/views/Home'

import Welcome from '@/views/Welcome' // 欢迎页面
import ManageMusic from '@/views/managemusic' // 歌曲管理
import AdminLikes from '@/views/adminlikes' // 推荐歌曲
import UserService from '@/views/userservice' // 用户服务
import AllOrders from '@/views/allorders' // 订单查询

Vue.use(VueRouter)

const routes = [
  // 访问 / 路径的时候，重定向到/admin
  {
    path: '/',
    redirect: '/admin'
  },
  {
    path: '/admin',
    name: 'admin',
    component: Home,
    children: [
      {
        path: '/admin',
        redirect: 'welcome'
      },
      {
        path: 'welcome',
        name: 'welcome',
        component: Welcome
      },
      {
        path: 'managemusic',
        name: 'managemusic',
        component: ManageMusic
      },
      {
        path: 'musiclikes',
        name: 'musiclikes',
        component: AdminLikes
      },
      {
        path: 'userservice',
        name: 'userservice',
        component: UserService
      },
      {
        path: 'allorders',
        name: 'allorders',
        component: AllOrders
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: '登录页面'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
// 前置路由守卫
router.beforeEach((to, from, next) => {
  // 1、获取token
  const adminToken = localStorage.getItem('adminToken')
  console.log('to=>', to)
  // 在登录页面是不需要进行token验证的
  if (to.path == '/login') {
    // console.log('login')
    if (adminToken) {
      next('/') // 进入首页
    } else {
      next()
    }
  } else {
    console.log('非/login')
    if (adminToken) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
