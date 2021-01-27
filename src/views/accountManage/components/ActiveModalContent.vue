<template>
  <a-modal
    title="激活账户"
    :visible="showActiveModal"
    :destroyOnClose="true"
    :maskClosable="false"
    :confirm-loading="loading"
    @cancel="modalClose"
    @ok="handleOk"
    width="550px"
  >
    <p>用户 {{ info.real_name }}（{{ info.user_info && info.user_info.user_id }}）</p>
    <a-row class="common-row">
      <a-col span="8">账户总资金量：</a-col>
      <a-col span="6">{{ info.balance ? numFixed(info.balance) : '0.00' }} USD</a-col>
    </a-row>
    <a-row class="common-row">
      <a-col span="8">标准合约账户资金：</a-col>
      <a-col span="6">{{ info.qh_balance ? numFixed(info.qh_balance) : '0.00' }} {{ info.qh_base_currency }}</a-col>
    </a-row>
    <a-row class="common-row">
      <a-col span="8">连续合约账户资金：</a-col>
      <a-col span="6">{{ info.lx__balance ? numFixed(info.lx__balance) : '0.00' }} {{ info.lx_currency }}</a-col>
    </a-row>
    <p class="account-tip">用户账户资金{{ info.status == 1 ? '超过' : '未超过' }} 10000港币（当前汇率 USDHKD：{{ info.rate }}）</p>
  </a-modal>
</template>

<script>
import { Modal, Row, Col } from 'ant-design-vue'

export default {
  components: {
    [Modal.name]: Modal,
    [Row.name]: Row,
    [Col.name]: Col
  },
  props: ['showActiveModal', 'info'],
  data() {
    return {
      loading: false
    }
  },
  methods: {
    numFixed(num) {
      return Number(num).toFixed(2)
    },
    modalClose() {
      this.$emit('update:showActiveModal', false)
    },
    handleOk() {
      this.loading = true
      const params = {
        id: this.info.id,
        account_no: this.info.futures_login_id
      }
      this.$apis
        .set_account_activity(params)
        .then(res => {
          this.$message.success('激活成功')
          this.$emit('update:isNeedReload', true)
          this.modalClose()
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.common-row {
  margin-top: 10px;
  padding-left: 50px;
}
.account-tip {
  margin-top: 20px;
  font-size: 12px;
  color: #ff6600;
}
</style>
