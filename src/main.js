import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import { Modal, message, notification, Checkbox } from 'ant-design-vue'
import gloabComponents from './components'
import { install } from './utils/install'
import JsonExcel from "vue-json-excel";
import apis from '@/api'
import './permission'
import 'babel-polyfill'

// 在页面中引入会引起css Conflicting order问题
Vue.use(Checkbox)
Vue.use(gloabComponents)
Vue.use(install)
// 导出Excel文件
Vue.component("ExportExcel", JsonExcel);

Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$info = Modal.info
Vue.prototype.$success = Modal.success
Vue.prototype.$error = Modal.error
Vue.prototype.$warning = Modal.warning
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$apis = apis

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
