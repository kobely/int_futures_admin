const pageView = () => import(/* webpackChunkName: "layout" */ '@/layouts/pageView')

const accountManageRouter = [
    {
        path: '/accountManage',
        name: 'account-manage',
        component: pageView,
        children: [
            {
                path: 'futuresAccountList',
                name: 'futures-account-list',
                component: () => import(/* webpackChunkName: "accountManage" */ '@/views/accountManage/futuresAccountList'),
                meta: {
                    title: '期货账号管理',
                    isMenu: true,
                    keepAlive: false,
                    requiresAuth: true,
                },
            },
            {
                path: 'statementList',
                name: 'statement-list',
                component: () => import(/* webpackChunkName: "accountManage" */ '@/views/accountManage/statementList'),
                meta: {
                    title: '客户结算单列表',
                    isMenu: true,
                    keepAlive: false,
                    requiresAuth: true,
                },
            },
        ],
    },
]

export default accountManageRouter
