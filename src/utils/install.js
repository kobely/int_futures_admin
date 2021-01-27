import { toast } from './util'

export function install(Vue) {
    Vue.prototype.$toast = toast
}
