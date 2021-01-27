<template>
  <a-card title="补充资料" class="card-hei">
    <a-row>
      <a-col :span="3" class="border-space border-top">
        <p>补充资料</p>
      </a-col>
      <a-col :span="20">
        <p class="file-info-container" v-for="(item, index) in extraInfo" :key="index">
          <span class="file-name">{{ item.origin_name }}</span>
          <a class="file-down-btn" :href="item.url" target="_blank">下载</a>
        </p>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { Card, Row, Col } from 'ant-design-vue'

export default {
  components: {
    [Card.name]: Card,
    [Row.name]: Row,
    [Col.name]: Col
  },
  props: ['extraInfo']
}
</script>

<style lang="less" scoped>
.file-info-container {
  &:nth-of-type(n + 2) {
    margin-top: 15px;
  }
  .file-name {
    display: inline-block;
    width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .file-down-btn {
    margin-left: 50px;
    color: #1890ff;
    cursor: pointer;
  }
}
</style>
