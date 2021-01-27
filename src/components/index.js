/**
 * 公共组件
 */
import Spin from './Spin'

const gloabComponents = {
    install: (Vue) => {
        Vue.component('Spin', Spin)
    },
}

export default gloabComponents
