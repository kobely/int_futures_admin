<template>
    <div :class="[$route.meta.isMenu ? 'menu-page' : '']">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.menu-page {
    min-height: 100%;
    padding: 16px;
    background-color: #fff;
}
</style>
