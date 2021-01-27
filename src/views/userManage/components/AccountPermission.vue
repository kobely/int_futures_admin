<template>
  <a-card title="账户和权限" class="card-hei">
    <a-row>
      <a-col :span="12" class="border-space border-top">
        <p class="permission-title">期货账号</p>
        <div>
          <a-row>
            <a-col :span="10">
              <span>开通情况</span>
            </a-col>
            <a-col :span="14">
              <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" class="mr-10" v-if="detailInfo.hk_account_open" />
              <a-icon type="close-circle" theme="twoTone" twoToneColor="#f81d22" class="mr-10" v-else />
              <span class="color-dark mr-10">香港期货</span>

              <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" class="mr-10" v-if="detailInfo.hq_account_open" />
              <a-icon type="close-circle" theme="twoTone" twoToneColor="#f81d22" class="mr-10" v-else />
              <span class="color-dark">环球期货</span>
            </a-col>
          </a-row>
          <!-- <a-row>
            <a-col :span="10">
              <span>是否激活</span>
            </a-col>
            <a-col :span="14">
              <span class="color-dark">已激活</span>
            </a-col>
          </a-row> -->
          <a-row>
            <a-col :span="10">
              <span>是否可用</span>
            </a-col>
            <a-col :span="14">
              <a-icon
                type="check-circle"
                theme="twoTone"
                twoToneColor="#52c41a"
                class="mr-10"
                v-if="detailInfo.hk_account_open && detailInfo.hk_account_use"
              />
              <a-icon type="close-circle" theme="twoTone" twoToneColor="#f81d22" class="mr-10" v-else />
              <span class="color-dark mr-10">香港期货</span>

              <a-icon
                type="check-circle"
                theme="twoTone"
                twoToneColor="#52c41a"
                class="mr-10"
                v-if="detailInfo.hq_account_open && detailInfo.hq_account_use"
              />
              <a-icon type="close-circle" theme="twoTone" twoToneColor="#f81d22" class="mr-10" v-else />
              <span class="color-dark">环球期货</span>
            </a-col>
          </a-row>
          <a-row v-for="(item, index) in detailInfo.hk_account_list" :key="index">
            <a-col :span="10">
              <span v-if="item.type == 2">账户名(实盘)</span>
              <span v-else>账户名(模拟盘)</span>
            </a-col>
            <a-col :span="14">
              <span class="color-dark">{{ item.futures_login_id }}</span>
            </a-col>
          </a-row>
        </div>
      </a-col>
      <!-- <a-col :span="12" class="border-top">
        <p class="permission-title">连续合约账号</p>
        <a-row>
          <a-col :span="10">
            <span>开通情况</span>
          </a-col>
          <a-col :span="14">
            <span class="color-dark">{{ detailInfo.lx_account_open ? '已开通' : '未开通' }}</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <span>是否可用</span>
          </a-col>
          <a-col :span="14">
            <span class="color-dark">{{ detailInfo.lx_account_open && detailInfo.lx_account_use ? '可用' : '不可用' }}</span>
          </a-col>
        </a-row>
        <a-row v-for="(item, index) in detailInfo.lx_account_list" :key="index">
          <a-col :span="10">
            <span v-if="item.type == 2">账户名(实盘)</span>
            <span v-else>账户名(模拟盘)</span>
          </a-col>
          <a-col :span="14">
            <span class="color-dark">{{ item.mt4_login_id }}</span>
          </a-col>
        </a-row>
      </a-col> -->
    </a-row>
  </a-card>
</template>

<script>
import { Card, Row, Col, Icon } from 'ant-design-vue'

export default {
  components: {
    [Card.name]: Card,
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
  },
  props: ['detailInfo'],
}
</script>

<style lang="less" scoped>
.mr-10 {
  margin-right: 10px;
}
.permission-title {
  margin-bottom: 10px;
  color: #333;
}
</style>
