const pageView = () => import(/* webpackChunkName: "layout" */ '@/layouts/pageView')

const fundManageRoute = [
  {
    path: '/fundManage',
    name: 'fund-manage',
    redirect: '/fundManage/accountList',
    component: pageView,
    children: [
      {
        path: 'accountList',
        name: 'account-list',
        component: () => import(/* webpackChunkName: "fundManage" */ '@/views/fundManage/accountFund'),
        meta: {
          title: '账户资金管理',
          isMenu: true,
          keepAlive: true,
          requiresAuth: true
        }
      },
      {
        path: 'flowList',
        name: 'flow-list',
        component: () => import(/* webpackChunkName: "fundManage" */ '@/views/fundManage/fundFlow'),
        meta: {
          title: '资金流水',
          isMenu: true,
          keepAlive: true,
          requiresAuth: true
        }
      },
      {
        path: 'flowDailyList',
        name: 'flow-daily-list',
        component: () => import(/* webpackChunkName: "fundManage" */ '@/views/fundManage/fundFlowDaily'),
        meta: {
          title: '资金流水日报',
          isMenu: true,
          keepAlive: false,
          requiresAuth: true
        }
      },
      {
        path: 'customerDeposit',
        name: 'customer-deposit',
        component: () => import(/* webpackChunkName: "fundManage" */ '@/views/fundManage/customerDeposit'),
        meta: {
          title: '客户入金管理',
          isMenu: true,
          keepAlive: true,
          requiresAuth: true
        }
      },
      {
        path: 'depositHandle',
        name: 'deposit-handle',
        component: () => import(/* webpackChunkName: "fundManage" */ '@/views/fundManage/depositHandle'),
        meta: {
          title: '入金处理',
          isMenu: false,
          keepAlive: true,
          requiresAuth: true
        }
      },
      {
        path: 'fundTranser',
        name: 'fund-transer',
        component: () => import(/* webpackChunkName: "fundManage" */ '@/views/fundManage/fundTransfer'),
        meta: {
          title: '资金划转管理',
          isMenu: true,
          keepAlive: false,
          requiresAuth: true
        }
      },
      {
        path: 'accountWithdraw',
        name: 'account-withdraw',
        component: () => import(/* webpackChunkName: "fundManage" */ '@/views/fundManage/accountWithdraw'),
        meta: {
          title: '客户出金管理列表',
          isMenu: true,
          keepAlive: true,
          requiresAuth: true
        }
      },
      {
        path: 'withdraw-detail',
        name: 'withdraw-detail',
        component: () => import(/* webpackChunkName: "fundManage" */ '@/views/fundManage/withdrawDetail'),
        meta: {
          title: '客户出金处理页',
          isMenu: false,
          keepAlive: false,
          requiresAuth: true
        }
      },
      {
        path: 'swap',
        name: 'swap-list',
        component: () => import(/* webpackChunkName: "fundManage" */ '@/views/fundManage/swap'),
        meta: {
          title: '客户换汇管理',
          isMenu: true,
          keepAlive: true,
          requiresAuth: true
        }
      },
      {
        path: 'rate',
        name: 'rate-list',
        component: () => import(/* webpackChunkName: "fundManage" */ '@/views/fundManage/rateList'),
        meta: {
          title: '换汇汇率管理',
          isMenu: true,
          keepAlive: true,
          requiresAuth: true
        }
      }
    ]
  }
]

export default fundManageRoute
