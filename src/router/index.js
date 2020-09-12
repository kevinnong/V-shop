import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/users/User'
Vue.use(VueRouter)


const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    { path: '/', redirect: '/login' },
    {
      path: '/home', component: Home, children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User }
      ],
      redirect: 'welcome'
    },
  ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to表示将要访问的路径
  // from代表从哪个路径跳转而来
  // next是一个函数，表示放行
  //next() 放行     next('/login')强制跳转
  if (to.path === '/login') return next();
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login')//如果token不存在，就跳转回登录页
  next()
})

export default router
