<template>
  <div class="batch-export">
    <a-modal
      title="批量导出"
      :visible="exportVisible"
      :confirm-loading="confirmLoading"
      :maskClosable="false"
      @cancel="$emit('update:exportVisible',false)"
    >
      <template slot="footer">
        <div style="display:flex;justify-content:flex-end;">
          <a-button
            key="back"
            @click="cancelModal"
          >
            取消
          </a-button>
          <Export
            style="margin-left:10px;"
            exportType="single"
            name="资金划转管理.xls"
            exportBtnTxt="确认"
            :queryParams="{export_type:form.export_type}"
            post_id="transfer_no_list"
            :multipleSelection="multipleSelection"
            :callBack="$apis.exportTransfer"
            @finishedDownload="handleOk"
            @downloadError="downloadError"
            @beforeDownload="beforeDownload"
          />
        </div>
      </template>
      <a-spin :spinning="formLoading">
        <div class="transfer-info">
          <a-alert
            :message="`检索到 ${transferInfo.num&&transferInfo.num.total||''} 个订单，其中有${transferInfo.num&&transferInfo.num.total_pending||''}个未处理，${transferInfo.num&&transferInfo.num.total_handle||''}个已处理`"
            banner
          />
        </div>
        <div class="radio-group">
          <a-form-model
            :model="form"
            ref="ruleForm"
            :rules="rules"
            :label-col="labelCol"
            label-align="left"
            :wrapper-col="wrapperCol"
          >
            <a-form-model-item
              label="选择导出类型"
              prop="export_type"
            >
              <a-radio-group
                name="选择导出类型"
                v-model="form.export_type"
              >
                <a-radio :value="1">
                  未处理订单
                </a-radio>
                <a-radio :value="2">
                  已处理订单
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-form-model>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { Radio, Modal, Spin, FormModel, Alert, Button } from 'ant-design-vue'
import _ from 'lodash'
import exportRequest from '@/utils/exportRequest'
import Export from '@/components/Export'
export default {
  data() {
    return {
      confirmLoading: false,
      formLoading: false,
      form: { export_type: 1 },
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      formLoading: false,
      rules: {
        export_type: [
          {
            required: true,
            message: '请选择导出类型',
            trigger: 'change'
          }
        ]
      }
    }
  },
  components: {
    [Button.name]: Button,
    [Spin.name]: Spin,
    [Modal.name]: Modal,
    [Alert.name]: Alert,
    [Radio.name]: Radio,
    [Radio.Group.name]: Radio.Group,
    [FormModel.name]: FormModel,
    [FormModel.Item.name]: FormModel.Item,
    Export
  },
  props: {
    exportVisible: {
      type: Boolean,
      default: false
    },
    transferInfo: {
      type: Object,
      default: () => {}
    },
    handleParams: {
      type: Object,
      default: () => {}
    },
    multipleSelection: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    exportVisible(val) {
      if (val) {
        this.form = this.transferInfo.transfer_info
      }
    }
  },
  methods: {
    handleOk() {
      this.$emit('update:exportVisible', false)
      this.formLoading = false
    },
    cancelModal() {
      this.$emit('update:exportVisible', false)
    },
    beforeDownload() {
      this.formLoading = true
    },
    downloadError() {
      this.formLoading = false
    }
  }
}
</script>

<style lang='less' scoped>
.transfer-info {
  margin-bottom: 20px;
}
</style>
