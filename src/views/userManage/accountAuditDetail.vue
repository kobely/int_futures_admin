<template>
  <div class="detail-page">
    <breadcrumb-wrapper prevUrl="/userManage/accountAuditList" prevTitle="开户待审核列表" currentTitle="开户审核页">
      <span class="mr-30">UserID：{{ detailInfo.user_info && detailInfo.user_info.user_id }}</span>
      <span>业务受理编号：{{ detailInfo.acceptance_sn }}</span>
    </breadcrumb-wrapper>
    <a-row :gutter="10">
      <a-col :span="12">
        <base-info :detail-info="detailInfo" />
      </a-col>
      <a-col :span="12">
        <a-card title="身份核验" class="card-hei">
          <identity-check :detail-info="detailInfo" />
        </a-card>
      </a-col>
      <a-col :span="24" class="border-top" v-if="hasMaterial">
        <identity-materials :detail-info="detailInfo" />
      </a-col>
    </a-row>
    <a-row :gutter="10">
      <a-col :span="6" class="border-top">
        <mutual-info :detail-info="detailInfo" :is-new-info="isNewInfo" />
      </a-col>
      <a-col :span="6" class="border-top" v-if="isNewInfo && detailInfo.info_extend.tax_resident && detailInfo.info_extend.tax_resident.length">
        <tax-resident :detail-info="detailInfo" />
      </a-col>
      <a-col :span="12" class="border-top" v-if="detailInfo.info_extend.extra_info && detailInfo.info_extend.extra_info.length">
        <extra-info :extra-info="detailInfo.info_extend.extra_info" />
      </a-col>
    </a-row>
    <a-row v-if="detailInfo.act_all_log_list.length">
      <a-col :span="24" class="border-top">
        <operate-records :act-log-list="detailInfo.act_all_log_list" />
      </a-col>
    </a-row>
    <div class="bottom-button-wrap">
      <a-button type="primary" @click="showModal = true" :disabled="detailInfo.is_verify != 0">身份核验</a-button>
    </div>
    <!-- 弹层 start -->
    <a-modal
      :visible="showModal"
      :destroyOnClose="true"
      :maskClosable="false"
      :footer="null"
      @cancel="showModal = false"
      width="550px"
      :bodyStyle="{ minHeight: '200px' }"
    >
      <p slot="title">核验操作<span class="modal-tip">提示：用户身份信息请在个人详情页查阅</span></p>
      <check-modal-content :detail-info="detailInfo" :show-modal.sync="showModal" />
    </a-modal>
    <!-- 弹层 end -->
  </div>
</template>

<script>
import { Card, Row, Col, Button, Modal } from 'ant-design-vue'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import BaseInfo from './components/BaseInfo'
import IdentityCheck from './components/IdentityCheck'
import IdentityMaterials from './components/IdentityMaterials'
import MutualInfo from './components/MutualInfo'
import TaxResident from './components/TaxResident'
import ExtraInfo from './components/ExtraInfo'
import OperateRecords from './components/OperateRecords'
import CheckModalContent from './components/CheckModalContent'

export default {
  components: {
    BreadcrumbWrapper,
    BaseInfo,
    IdentityCheck,
    IdentityMaterials,
    MutualInfo,
    TaxResident,
    ExtraInfo,
    OperateRecords,
    CheckModalContent,
    [Card.name]: Card,
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
    [Modal.name]: Modal
  },
  data() {
    return {
      showModal: false,
      detailInfo: {
        info_extend: {},
        act_all_log_list: []
      }
    }
  },
  computed: {
    hasMaterial() {
      return this.detailInfo.positive_img || this.detailInfo.inverse_img || this.detailInfo.address_img || this.detailInfo.video_url
    },
    isNewInfo() {
      return this.detailInfo.info_extend && this.detailInfo.info_extend.version != '1.0'
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.$apis
        .get_account_detail({ id: this.$route.params.id })
        .then(res => {
          this.detailInfo = res
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../style/init.less');
.detail-page {
  padding: 54px 0 86px;
  .border-top {
    border-top: 10px solid #f0f2f5;
  }
  .check-material-wrap {
    margin-top: 8px;
    padding-top: 10px;
    border-top: 1px solid #e5e5e5;
  }
}
.modal-tip {
  margin-left: 50px;
  font-size: 12px;
  color: #ff6600;
}
</style>
