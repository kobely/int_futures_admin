const pageView = () => import(/* webpackChunkName: "layout" */ '@/layouts/pageView')

const userManageRouter = [
  {
    path: '/userManage',
    name: 'user-manage',
    redirect: '/userManage/userList',
    component: pageView,
    children: [
      {
        path: 'userList',
        name: 'user-list',
        component: () => import(/* webpackChunkName: "userManage" */ '@/views/userManage/userManageList'),
        meta: {
          title: '用户管理列表',
          isMenu: true,
          keepAlive: true,
          requiresAuth: true
        }
      },
      {
        path: 'userDetail/:id',
        name: 'user-detail',
        component: () => import(/* webpackChunkName: "userManage" */ '@/views/userManage/userDetail'),
        meta: {
          title: '个人用户详情页',
          keepAlive: false,
          requiresAuth: true
        }
      },
      {
        path: 'openAccount/:id?',
        name: 'open-account',
        component: () => import(/* webpackChunkName: "userManage" */ '@/views/userManage/openAccount'),
        meta: {
          title: '新增个人开户',
          keepAlive: false,
          requiresAuth: true
        }
      },
      {
        path: 'accountAuditList',
        name: 'account-audit-list',
        component: () => import(/* webpackChunkName: "userManage" */ '@/views/userManage/accountAuditList'),
        meta: {
          title: '开户待审核列表',
          isMenu: true,
          keepAlive: true,
          requiresAuth: true
        }
      },
      {
        path: 'accountAuditDetail/:id',
        name: 'account-audit-detail',
        component: () => import(/* webpackChunkName: "userManage" */ '@/views/userManage/accountAuditDetail'),
        meta: {
          title: '开户审核页',
          keepAlive: false,
          requiresAuth: true
        }
      },
      {
        path: 'educationCareerCondition',
        name: 'education-career-condation',
        component: () => import(/* webpackChunkName: "userManage" */ '@/views/userManage/educationCareerCondition'),
        meta: {
          title: '教育和职业情况',
          keepAlive: false,
          repeatOpen: true,
          requiresAuth: true
        }
      },
      {
        path: 'survery',
        name: 'survery',
        component: () => import(/* webpackChunkName: "userManage" */ '@/views/userManage/survery'),
        meta: {
          title: '适当性调查',
          keepAlive: false,
          repeatOpen: true,
          requiresAuth: true
        }
      },
      {
        path: 'questionnaire',
        name: 'questionnaire',
        component: () => import(/* webpackChunkName: "userManage" */ '@/views/userManage/questionnaire'),
        meta: {
          title: '风险承受能力问卷',
          keepAlive: false,
          repeatOpen: true,
          requiresAuth: true
        }
      },
      {
        path: 'statement',
        name: 'statement',
        component: () => import(/* webpackChunkName: "userManage" */ '@/views/userManage/statement'),
        meta: {
          title: '客户声明',
          keepAlive: false,
          repeatOpen: true,
          requiresAuth: true
        }
      },
      {
        path: 'registerList',
        name: 'register-list',
        component: () => import(/* webpackChunkName: "userManage" */ '@/views/userManage/registerList'),
        meta: {
          title: '注册列表',
          isMenu: true,
          keepAlive: false,
          requiresAuth: true
        }
      },
      {
        path: 'bankList',
        name: 'bank-list',
        component: () => import(/* webpackChunkName: "userManage" */ '@/views/userManage/bankList'),
        meta: {
          title: '银行卡列表',
          isMenu: true,
          keepAlive: false,
          requiresAuth: true
        }
      },
      {
        path: 'fundTrusteeshipList',
        name: 'fund-trusteeship-list',
        component: () => import(/* webpackChunkName: "userManage" */ '@/views/userManage/fundTrusteeshipList'),
        meta: {
          title: '资金托管子账户',
          isMenu: true,
          keepAlive: false,
          requiresAuth: true
        }
      }
    ]
  }
]

export default userManageRouter
