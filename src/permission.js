import router from './router'
import { setDocumentTitle, authLoginIn } from './utils/util'
import { DOM_TITLE } from './utils/const'
import { clearPending } from './utils/request'

router.beforeEach((to, from, next) => {
    clearPending()
    to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${DOM_TITLE}`)

    if (to.matched == 0) {
        from.name ? next({ name: from.name }) : next('/exception/404')
    } else {
        // if (to.matched.some(record => record.meta.requiresAuth)) {
        //     if (!authLoginIn()) {
        //         next({
        //             path: '/login',
        //             query: { redirect: to.fullPath }
        //         })
        //     }
        //     next()
        // } else {
        //     next()
        // }
        next()
    }
})
