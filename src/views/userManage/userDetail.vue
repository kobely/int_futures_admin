<template>
  <div class="detail-page">
    <breadcrumb-wrapper prevUrl="/userManage/userList" prevTitle="个人用户管理列表" currentTitle="个人用户信息">
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
          <a-row class="check-material-wrap" v-if="detailInfo.positive_img || detailInfo.inverse_img || detailInfo.address_img">
            <a-col :span="5">核验材料留底</a-col>
            <a-col :span="19">
              <div class="material-wrap">
                <a v-if="detailInfo.positive_img" :href="detailInfo.positive_img" target="_blank"> 身份证正面照片 </a>
                <a v-if="detailInfo.inverse_img" :href="detailInfo.inverse_img" target="_blank"> 身份证背面照片 </a>
                <a v-if="detailInfo.address_img" :href="detailInfo.address_img" target="_blank"> 地址证明照片 </a>
              </div>
              <div class="material-wrap" v-if="detailInfo.video_url">
                <a :href="detailInfo.video_url" target="_blank"> 人像视频 </a>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="12" class="border-top">
        <account-permission :detail-info="detailInfo" />
      </a-col>
      <a-col :span="6" class="border-top">
        <mutual-info :detail-info="detailInfo" :is-new-info="isNewInfo" />
      </a-col>
      <a-col :span="6" class="border-top" v-if="isNewInfo && detailInfo.info_extend.tax_resident && detailInfo.info_extend.tax_resident.length">
        <tax-resident :detail-info="detailInfo" />
      </a-col>
    </a-row>
    <a-row v-if="detailInfo.info_extend.extra_info && detailInfo.info_extend.extra_info.length">
      <a-col :span="12" class="border-top">
        <extra-info :extra-info="detailInfo.info_extend.extra_info" />
      </a-col>
    </a-row>
    <a-row v-if="detailInfo.act_all_log_list.length">
      <a-col :span="24" class="border-top">
        <operate-records :act-log-list="detailInfo.act_all_log_list" />
      </a-col>
    </a-row>
    <div class="bottom-button-wrap">
      <a-button type="primary" :disabled="detailInfo.is_verify != 0" @click="showModal = true">身份核验</a-button>
      <a-button type="primary" @click="$router.push(`/userManage/openAccount/${$route.params.id}`)">修改</a-button>
      <a-button type="primary" :disabled="detailInfo.is_verify != 2" @click="downAccountBook">下载开户书</a-button>
      <a-button type="primary" @click="downW8ben">下载W8BEN文件</a-button>
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
import AccountPermission from './components/AccountPermission'
import MutualInfo from './components/MutualInfo'
import TaxResident from './components/TaxResident'
import ExtraInfo from './components/ExtraInfo'
import OperateRecords from './components/OperateRecords'
import CheckModalContent from './components/CheckModalContent'
import { pdfDown } from '@/utils/util'

export default {
  components: {
    BreadcrumbWrapper,
    BaseInfo,
    IdentityCheck,
    AccountPermission,
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
        estimate_examine: {},
        act_all_log_list: []
      }
    }
  },
  computed: {
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
    },
    downAccountBook() {
      this.$apis
        .get_account_statement({ id: this.$route.params.id })
        .then(res => {
          window.open(res.url)
        })
        .catch(() => {})
    },
    async downW8ben() {
      // window.open('http://172.16.55.101:8088/api/admin/usermanager/pdf?pdf_url=' + encodeURIComponent(this.detailInfo.w_bin_url))

      // fetch(this.detailInfo.w_bin_url)
      //   .then(v => v.blob())
      //   .then(v => URL.createObjectURL(v))
      //   .then(v => console.log(v))
      //   .then(v => {
      //     let dom = document.createElement('a')
      //     dom.href = v
      //     dom.download = 'W8BEN'
      //     document.body.appendChild(dom)
      //     dom.click()
      //     document.body.removeChild(dom)
      //   })

      let res = await this.$apis.get_file_pdf({ pdf_url: encodeURIComponent(this.detailInfo.w_bin_url) })
      pdfDown(res, 'W8BEN')
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
    .material-wrap {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }
  .questionnaire-tip {
    padding-left: 20px;
    font-size: 12px;
  }
}
.modal-tip {
  margin-left: 50px;
  font-size: 12px;
  color: #ff6600;
}
.bottom-button-wrap {
  button {
    margin-right: 50px;
  }
}
</style>
