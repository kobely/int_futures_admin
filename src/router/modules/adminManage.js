const pageView = () => import(/* webpackChunkName: "layout" */ '@/layouts/pageView')
import store from '@/store'

const adminManageRouter = [
    {
        path: '/adminManage',
        name: 'admin-manage',
        component: pageView,
        children: [
            {
                path: 'list',
                name: 'admin-manage-list',
                component: () => import(/* webpackChunkName: "accountManage" */ '@/views/adminManage/AccountList'),
                meta: {
                    title: '账号管理',
                    isMenu: true,
                    keepAlive: true,
                    requiresAuth: true
                },
                beforeEnter: (to, from, next) => {
                    if (!store.state.userGroup.length) {
                        store.dispatch('GetUserGroup')
                    }

                    next()
                }
            }
        ]
    }
]

export default adminManageRouter
