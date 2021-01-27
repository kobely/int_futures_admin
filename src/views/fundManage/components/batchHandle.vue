<template>
  <div class="batch-export">
    <a-modal
      :title="title"
      :visible="batchHandleVisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="cancelModal"
      :destroyOnClose="true"
      :maskClosable="false"
    >
      <a-spin :spinning="formLoading">
        <div class="transfer-info">
          <a-alert
            v-if="handleParams.check_type == 2"
            :message="
              `检索到 ${transferInfo.num && transferInfo.num.total} 个订单，其中有${transferInfo.num &&
                transferInfo.num.total_pending}个未处理，${transferInfo.num && transferInfo.num.total_handle}个已处理(已忽略)`
            "
            banner
          />
          <a-alert
            v-if="handleParams.check_type == 1"
            :message="`用户 ${transferInfo.user_info && transferInfo.user_info.name + ' (' + transferInfo.user_info.user_id})`"
            banner
          />
        </div>
        <a-spin :spinning="formLoading">
          <a-form-model :model="form" ref="ruleForm" :label-col="labelCol" label-align="left" :wrapper-col="wrapperCol">
            <a-form-model-item label="A转B合计" prop="a_to_b" suffix="USD">
              <a-input disabled v-model="form.a_to_b" suffix="USD" />
            </a-form-model-item>
            <a-form-model-item label="B转A合计" prop="b_to_a" suffix="USD">
              <a-input disabled v-model="form.b_to_a" suffix="USD" />
            </a-form-model-item>
            <a-form-model-item label="划转净值(A转B为正)" prop="net_value">
              <a-input disabled suffix="USD" v-model="form.net_value" />
            </a-form-model-item>
          </a-form-model>
        </a-spin>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { Button, FormModel, Radio, Modal, Spin, Input, Alert } from 'ant-design-vue'
import _ from 'lodash'
export default {
  data() {
    return {
      confirmLoading: false,
      form: {},
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
      formLoading: false,
      radioValue: ''
    }
  },
  components: {
    [Button.name]: Button,
    [Spin.name]: Spin,
    [FormModel.name]: FormModel,
    [FormModel.Item.name]: FormModel.Item,
    [Input.name]: Input,
    [Modal.name]: Modal,
    [Alert.name]: Alert
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    handleParams: {
      type: Object,
      default: () => {}
    },
    batchHandleVisible: {
      type: Boolean,
      default: false
    },
    transferInfo: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    batchHandleVisible(val) {
      if (val) {
        this.form = this.transferInfo.transfer_info
      }
    }
  },
  methods: {
    handleOk() {
      this.confirmLoading = true
      this.$apis
        .transferHandler(this.handleParams)
        .then(res => {
          this.$emit('update:batchHandleVisible', false)
          this.$parent.getList()
        })
        .catch(err => {
          console.log(err, 'err')
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    cancelModal() {
      this.$emit('update:batchHandleVisible', false)
    }
  }
}
</script>

<style lang="less" scoped>
.transfer-info {
  margin-bottom: 20px;
}
</style>
