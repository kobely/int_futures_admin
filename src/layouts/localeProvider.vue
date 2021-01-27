<template>
    <a-config-provider :locale="locale">
        <router-view></router-view>
    </a-config-provider>
</template>

<script>
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
    data() {
        return {
            locale: zhCN,
        }
    },
    components: {
        [ConfigProvider.name]: ConfigProvider,
    },
}
</script>
