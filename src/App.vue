<template>
  <locale-provider>
    <div id="app">
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </div>
  </locale-provider>
</template>

<script>
import localeProvider from '@/layouts/localeProvider'
export default {
  name: 'app',
  components: {
    localeProvider
  }
}
</script>

<style lang="less">
@import './style/index.less';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
