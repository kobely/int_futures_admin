<template>
  <div class="pr">
    <base-card title="用户基本信息" :detail-info="formatDetailInfo" :left-part="leftPart" :right-part="rightPart" />
    <span @click="handleSwitchLanguage" class="switch-btn" v-if="detailInfo.address && !/[\u4e00-\u9fa5]/.test(detailInfo.address)">切换语言</span>
  </div>
  <!-- <a-card title="用户基本信息" class="card-hei">
    <a-row>
      <a-col :span="5">用户名：</a-col>
      <a-col :span="7">
        <span class="color-dark">{{ detailInfo.user_info && detailInfo.user_info.user_id }}</span>
      </a-col>
      <a-col :span="6">中文名：</a-col>
      <a-col :span="6">
        <span class="color-dark">{{ detailInfo.real_name }}</span>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="5">性别：</a-col>
      <a-col :span="7">
        <span class="color-dark">{{ detailInfo.sex == 1 ? '男' : '女' }}</span>
      </a-col>
      <a-col :span="6">英文名：</a-col>
      <a-col :span="6">
        <span class="color-dark">{{ detailInfo.english_name }}</span>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="5">国家/地区：</a-col>
      <a-col :span="7">
        <span class="color-dark">{{ COUNTRY[detailInfo.open_status - 1] }}</span>
      </a-col>
      <a-col :span="6">年龄：</a-col>
      <a-col :span="6">
        <span class="color-dark">{{ detailInfo.age }}</span>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="5">手机号：</a-col>
      <a-col :span="7">
        <span class="color-dark">{{ tel }}</span>
      </a-col>
      <a-col :span="6">邮箱：</a-col>
      <a-col :span="6">
        <span class="color-dark">{{ detailInfo.email }}</span>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="5">地址：</a-col>
      <a-col :span="7">
        <span class="color-dark">{{ detailInfo.address }}</span>
      </a-col>
    </a-row>
  </a-card> -->
</template>

<script>
import { Card, Row, Col } from 'ant-design-vue'
import BaseCard from '@/components/BaseCard'
import { COUNTRY } from '@/utils/const'

export default {
  components: {
    BaseCard,
    [Card.name]: Card,
    [Row.name]: Row,
    [Col.name]: Col
  },
  data() {
    return {
      COUNTRY,
      leftPart: [
        {
          label: '用户名',
          key: 'user_id'
        },
        {
          label: '性别',
          key: 'sex'
        },
        {
          label: '国籍',
          key: 'nationality_name'
        },
        {
          label: '手机号',
          key: 'tel'
        },
        {
          label: '邮箱',
          key: 'email'
        },
        {
          label: '国家/地区',
          key: 'country'
        }
      ],
      rightPart: [
        {
          label: '中文名',
          key: 'real_name'
        },
        {
          label: '英文名',
          key: 'english_name'
        },
        {
          label: '年龄',
          key: 'age'
        },
        {
          label: '出生年月',
          key: 'birth'
        },
        {
          label: '地址归属',
          key: 'address_zhcn'
        },
        {
          label: '详细地址',
          key: 'address_dtail'
        }
      ]
    }
  },
  computed: {
    formatDetailInfo() {
      const _detailInfo = this.detailInfo
      _detailInfo.tel = this.detailInfo.user_info && '+' + this.detailInfo.user_info.zone_code + ' ' + this.detailInfo.user_info.phone
      _detailInfo.user_id = this.detailInfo.user_info && this.detailInfo.user_info.user_id
      _detailInfo.sex = this.detailInfo.sex == 1 ? '男' : this.detailInfo.sex == 2 ? '女' : ''
      _detailInfo.country = COUNTRY[this.detailInfo.open_status - 1]
      return _detailInfo
    }
  },
  props: ['detailInfo'],
  methods: {
    handleSwitchLanguage() {
      this.rightPart[4].key = this.rightPart[4].key.includes('zhcn') ? 'address' : 'address_zhcn'
    }
  }
}
</script>

<style lang="less" scoped>
.pr {
  position: relative;
}
.switch-btn {
  position: absolute;
  left: 46%;
  top: 159px;
  color: #1890ff;
  cursor: pointer;
}
</style>
