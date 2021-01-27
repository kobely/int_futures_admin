<template>
    <a-spin :tip="loadingDesc"></a-spin>
</template>

<script>
import { Spin } from 'ant-design-vue'

export default {
    components: {
        [Spin.name]: Spin
    },
    props: ['loadingDesc']
}
</script>

<style lang="less" scoped>
.ant-spin /deep/ {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 110px;
    height: 110px;
    padding: 20px;
    transform: translate(-50%, -50%);
    color: #fff;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 5px;
}
/deep/ .ant-spin-dot-item {
    background-color: #fff;
}
</style>