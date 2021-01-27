const pageView = () => import(/* webpackChunkName: "layout" */ '@/layouts/pageView')

const contentManage = [
  {
    path: '/contentManage',
    name: 'content-manage',
    redirect: '/contentManage/announcement',
    component: pageView,
    children: [
      {
        path: 'announcement',
        name: 'announceManage',
        component: () => import(/* webpackChunkName: "contentManage" */ '@/views/contentManage/announcement'),
        meta: {
          title: '公告管理',
          isMenu: true,
          keepAlive: true,
          requiresAuth: true
        }
      },
      {
        path: 'help-center-list',
        name: 'help-center-list',
        component: () => import(/* webpackChunkName: "contentManage" */ '@/views/contentManage/helpCenterList'),
        meta: {
          title: '帮助中心',
          isMenu: true,
          keepAlive: true,
          requiresAuth: true
        }
      }
    ]
  }
]

export default contentManage
