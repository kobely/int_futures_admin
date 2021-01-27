<template>
  <a-card :title="title" class="card-hei">
    <a-row :gutter="70">
      <a-col :span="rightPart.length > 0 ? 12 : 24">
        <a-row type="flex" justify="space-between" v-for="item in leftPart" :key="item.key">
          <a-col :span="10">{{ item.label }}：</a-col>
          <a-col :span="14">
            <div class="color-dark text-r word-break-all">{{ detailInfo[item.key] ? detailInfo[item.key] : '-' }}</div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="12" v-if="rightPart.length > 0">
        <a-row type="flex" justify="space-between" v-for="item in rightPart" :key="item.key">
          <a-col :span="10">{{ item.label }}：</a-col>
          <a-col :span="14">
            <div class="color-dark text-r word-break-all">{{ detailInfo[item.key] ? detailInfo[item.key] : '-' }}</div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { Card, Row, Col } from 'ant-design-vue'

export default {
  name: 'BaseInfo',
  components: {
    [Card.name]: Card,
    [Row.name]: Row,
    [Col.name]: Col
  },
  data() {
    return {}
  },
  props: {
    detailInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    title: {
      type: String,
      default() {
        return '基本信息'
      }
    },
    rightPart: {
      type: Array,
      default() {
        return []
      }
    },
    leftPart: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.text-r {
  text-align: right;
}
.word-break-all {
  word-break: break-all;
}
</style>
