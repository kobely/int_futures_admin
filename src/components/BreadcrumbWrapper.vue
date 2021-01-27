<template>
  <a-card class="bread-crumb-wrap">
    <div class="dis-flex">
      <a-breadcrumb class="mr-50">
        <a-breadcrumb-item>
          <router-link :to="prevUrl">{{ prevTitle }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ currentTitle }}</a-breadcrumb-item>
      </a-breadcrumb>

      <div class="user-info-wrap">
        <slot></slot>
      </div>
    </div>
  </a-card>
</template>

<script>
import { Card, Breadcrumb } from 'ant-design-vue'

export default {
  components: {
    [Card.name]: Card,
    [Breadcrumb.name]: Breadcrumb,
    [Breadcrumb.Item.name]: Breadcrumb.Item
  },
  props: {
    prevUrl: {
      type: String,
      default: ''
    },
    prevTitle: {
      type: String,
      default: ''
    },
    currentTitle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../style/init.less');
.bread-crumb-wrap {
  position: fixed;
  top: 64px;
  margin-left: -16px;
  z-index: 99;
  width: 100%;
  .dis-flex {
    display: flex;
  }
  .user-info-wrap {
    font-size: 12px;
  }
}
@media screen and (max-width: 678px) {
  .bread-crumb-wrap {
    top: 80px;
  }
}
@media screen and (max-width: 360px) {
  .ant-breadcrumb {
    font-size: 12px;
  }
}
</style>
