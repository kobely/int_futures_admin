const requireAllRouter = requireContext => requireContext.keys().map(requireContext)
const routesFile = require.context('./modules/', false, /\.js$/)
import store from '@/store'

let childRoutes = []
requireAllRouter(routesFile).forEach(item => {
  childRoutes = childRoutes.concat(item.default)
})
// console.log('childRoutes', childRoutes)

export const routes = [
  {
    path: '/',
    name: 'layout',
    redirect: '/userManage/userList',
    component: () => import(/* webpackChunkName: "layout" */ '@/layouts/baseLayout'),
    children: [
      ...childRoutes,
      {
        path: '/exception/404',
        name: 'exception',
        component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
        meta: {
          title: 404,
          requiresAuth: false
        }
      }
    ],
    beforeEnter: (to, from, next) => {
      if (!store.state.menuList.length) {
        store.dispatch('GetMenuList')
      }
      next()
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/user/login'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  }
]
