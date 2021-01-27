const pageView = () => import(/* webpackChunkName: "layout" */ '@/layouts/pageView')

const systemManageRoute = [
  {
    path: '/systemManage',
    name: 'system-manage',
    redirect: '/systemManage/configuration',
    component: pageView,
    children: [
      {
        path: 'configuration',
        name: 'configuration',
        component: () => import(/* webpackChunkName: "ststemManage" */ '@/views/systemManage/configuration'),
        meta: {
          title: '系统配置管理',
          isMenu: true,
          keepAlive: true,
          requiresAuth: true
        }
      }
    ]
  }
]

export default systemManageRoute
