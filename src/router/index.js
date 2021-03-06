// 导入Vue以及vue-router
// 导入组件
// 新建路由，然后将其导出
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/users/User'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Report from '../components/report/Report'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    { path: '/', redirect: '/login' },
    {
      path: '/home',
      component: Home,
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/reports', component: Report }
      ],
      redirect: 'welcome'
    }
  ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to表示将要访问的路径
  // from代表从哪个路径跳转而来
  // next是一个函数，表示放行
  //next() 放行     next('/login')强制跳转
  if (to.path === '/login') return next()
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login') //如果token不存在，就跳转回登录页
  next()
})

export default router
