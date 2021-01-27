<template>
  <a-card title="用户税务资料" class="card-hei">
    <a-row :gutter="70">
      <a-col :span="24">
        <a-row type="flex" justify="space-between" v-for="(item, index) in taxResident" :key="index">
          <a-col :span="10">纳税地区：</a-col>
          <a-col :span="14">
            <div class="color-dark tr">{{ item.tax_area_zhcn }}</div>
          </a-col>
          <!-- <a-col :span="10" v-if="item.tax_area_zhcn == '中国香港'">居留司法管辖区：</a-col>
          <a-col :span="14" v-if="item.tax_area_zhcn == '中国香港'">
            <div class="color-dark tr">{{ item.belong_area }}</div>
          </a-col> -->
          <a-col :span="10">税务编号：</a-col>
          <a-col :span="14">
            <div class="color-dark tr">{{ item.tax_no }}</div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a :href="detailInfo.w_bin_url" class="material-wbin" target="_blank" v-if="detailInfo.w_bin_url">W-8BEN材料</a>
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
  props: ['detailInfo'],
  computed: {
    taxResident() {
      return this.detailInfo.info_extend && this.detailInfo.info_extend.tax_resident.length && this.detailInfo.info_extend.tax_resident
    }
  }
}
</script>

<style lang="less" scoped>
.material-wbin {
  display: inline-block;
  margin-top: 10px;
}
.tr {
  text-align: right;
}
</style>
