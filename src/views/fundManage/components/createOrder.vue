<template>
  <div class="create-order">
    <a-modal
      :visible="inputVisible"
      :confirm-loading="confirmLoading"
      @cancel="cancelModal"
      :width="900"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <template slot="title">
        <span>录入客户资金订单</span>
        <small>(<span style="color: red;">*</span>为必填字段)</small>
      </template>
      <template slot="footer">
        <div style="display: flex; justify-content: flex-end;">
          <a-button key="back" @click="cancelModal">
            取消
          </a-button>
          <a-button type="primary" key="submit" @click="handleOk" :disabled="formLoading">确认</a-button>
        </div>
      </template>
      <div style="height: 500px; overflow-y: auto; overflow-x: hidden;">
        <a-spin :spinning="formLoading">
          <a-form-model :model="form" :rules="rules" ref="ruleForm" :label-col="labelCol" label-align="left" :wrapper-col="wrapperCol">
            <a-row :gutter="15">
              <a-col :span="12">
                <a-form-model-item label="UserId" prop="uid">
                  <a-input-search placeholder="UserId" v-model="form.uid" enter-button @search="onUserIdSearch" />
                </a-form-model-item>
                <a-form-model-item label="客户中文名" prop="zh_name">
                  <a-input disabled v-model="form.zh_name" />
                </a-form-model-item>
                <a-form-model-item label="客户英文名" prop="cus_en_name">
                  <a-input disabled v-model="form.cus_en_name" />
                </a-form-model-item>
                <a-form-model-item label="客户手机号" prop="phone">
                  <a-input disabled v-model="form.phone" />
                </a-form-model-item>
                <a-form-model-item label="客户邮箱" prop="cus_email">
                  <a-input disabled v-model="form.cus_email" />
                </a-form-model-item>
                <a-divider style="min-width: 92%; width: 92%;" />
                <div class="alert-words">说明：A账户是标准合约账户<!-- ，B账户是连续合约账户 --></div>
                <a-form-model-item label="资金账户" prop="funds_account_type">
                  <a-select v-model="form.funds_account_type" @change="fundAccountChange">
                    <a-select-option v-for="item in fundsOptions" :key="item.id" :value="item.type">{{ fundsTypeKey[item.type] }}</a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="账户名" prop="account_name">
                  <a-input disabled :value="form.account_name" />
                </a-form-model-item>
                <a-divider style="min-width: 92%; width: 92%;" />
                <a-form-model-item label="转账凭证" prop="funds_account" :wrapperCol="{ span: 19 }" :labelCol="{ span: 5 }">
                  <a-upload
                    action="upload"
                    list-type="picture-card"
                    :file-list="fileList"
                    :customRequest="uploadAction"
                    :remove="removeImg"
                    @preview="handlePreview"
                  >
                    <div v-if="fileList.length < 6">
                      <a-icon type="plus" />
                    </div>
                  </a-upload>
                  <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                    <img alt="example" style="width: 100%;" :src="previewImage" />
                  </a-modal>
                </a-form-model-item>
                <div class="divider-line"></div>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="订单类型">
                  <a-input disabled value="转入" />
                </a-form-model-item>
                <a-form-model-item label="支付方式">
                  <a-input disabled value="录入" />
                </a-form-model-item>
                <a-form-model-item label="转入币种" prop="remittance_currency">
                  <a-select v-model="form.remittance_currency" @change="handleCurrencyChange">
                    <a-select-option v-if="form.funds_account_type" value="USD">USD</a-select-option>
                    <a-select-option v-if="form.funds_account_type == 1" value="HKD">HKD</a-select-option>
                    <a-select-option v-if="form.funds_account_type == 1" value="CNY">CNY</a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="转入金额" prop="amount">
                  <a-input @blur="amountBlur" v-model="form.amount" />
                </a-form-model-item>
                <a-form-model-item label="收款银行卡" prop="remittance_bank_id">
                  <a-select v-model="form.remittance_bank_id">
                    <a-select-option v-for="item in currencyBankList" :key="item.remittance_bank_id" :value="item.remittance_bank_id">
                      {{ item.receiver_bank }}(尾号{{ item.card.substr(-4, 4) }})
                    </a-select-option>
                    <!-- <a-select-option value="B">(尾号4324)</a-select-option> -->
                  </a-select>
                </a-form-model-item>
                <!-- <a-divider style="min-width:92%;width:92%" />
                <a-form-model-item
                  label="手续费"
                  prop="handling_fee"
                >
                  <a-input
                    @blur="handleFeeBlur"
                    v-model="form.handling_fee"
                  />
                </a-form-model-item>
                <a-form-model-item
                  label="到账资金"
                  prop="received_amount"
                >
                  <a-input v-model="form.received_amount" />
                </a-form-model-item>
                <a-form-model-item
                  label="处理结果"
                  prop="handle_result"
                >
                  <a-select
                    disabled
                    value="success"
                  >
                    <a-select-option value="success">处理成功</a-select-option>
                    <a-select-option value="failed">处理失败</a-select-option>
                  </a-select>
                </a-form-model-item> -->
              </a-col>
            </a-row>
          </a-form-model>
        </a-spin>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { Row, Col, Button, FormModel, Input, Select, Modal, Divider, Upload, Icon, Spin, Alert } from 'ant-design-vue'
import _ from 'lodash'
import { getBase64 } from '../../../utils/util'

export default {
  data() {
    return {
      form: {
        uid: '',
        received_amount: '',
        handling_fee: '',
        amount: ''
      },
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
      uploadUrl: '',
      formLoading: false,
      fundsTypeKey: {
        1: 'A账户',
        2: 'B账户'
      },
      accountType: {
        1: '用户资金托管账号',
        2: '企业资金托管总账号'
      },
      rules: {
        uid: [
          {
            required: true,
            message: '请输入userId',
            trigger: 'change'
          }
        ],
        handling_fee: [
          {
            required: true,
            message: '请输入手续费',
            trigger: 'blur'
          }
        ],
        funds_account_type: [
          {
            required: true,
            message: '请选择资金账户',
            trigger: 'change'
          }
        ],
        remittance_currency: [
          {
            required: true,
            message: '请选择转入币种',
            trigger: 'change'
          }
        ],
        amount: [
          {
            required: true,
            message: '请输入转入金额',
            trigger: 'blur'
          },
          {
            pattern: /^\d+(\.\d+)?$/,
            message: '不是有效数字',
            trigger: 'blur'
          }
        ],
        remittance_bank_id: [
          {
            required: true,
            message: '请选收款银行卡',
            trigger: 'change'
          }
        ],
        handling_fee: [
          {
            required: true,
            message: '请输入手续费',
            trigger: 'blur'
          },
          {
            pattern: /^\d+(\.\d+)?$/,
            message: '不是有效数字',
            trigger: 'blur'
          }
        ],
        received_amount: [
          {
            required: true,
            message: '请输入到账资金',
            trigger: 'blur'
          },
          {
            pattern: /^\d+(\.\d+)?$/,
            message: '不是有效数字',
            trigger: 'blur'
          }
        ]
      },
      confirmLoading: false,
      previewVisible: false,
      previewImage: '',
      fileList: [
        /* {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        } */
      ],
      fundsOptions: [],
      bankList: [],
      currencyBankList: []
    }
  },
  components: {
    [Icon.name]: Icon,
    [Upload.name]: Upload,
    [Divider.name]: Divider,
    [Button.name]: Button,
    [Row.name]: Row,
    [Col.name]: Col,
    [Spin.name]: Spin,
    [FormModel.name]: FormModel,
    [FormModel.Item.name]: FormModel.Item,
    [Input.name]: Input,
    [Input.Search.name]: Input.Search,
    [Modal.name]: Modal,
    [Alert.name]: Alert,
    [Select.name]: Select,
    [Select.Option.name]: Select.Option
  },
  props: {
    inputVisible: {
      type: Boolean,
      default() {
        return false
      }
    },
    addStatus: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  methods: {
    handleOk() {
      let amount = +this.form.amount
      let handleFee = +this.form.handling_fee
      let receivedAmount = +this.form.received_amount
      if (receivedAmount > amount) {
        this.$message.error('到账资金不能大于转入金额')
        return false
      }
      if (handleFee > amount) {
        this.$message.error('手续费不能大于转入金额')
        return false
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let voucher = this.fileList.map(item => item.content).join(',')
          this.formLoading = true
          this.$apis
            .fundsOrderSave({
              id: this.form.id,
              funds_account_type: this.form.funds_account_type,
              voucher,
              remittance_currency: this.form.remittance_currency,
              amount: this.form.amount,
              handling_fee: this.form.handling_fee,
              received_amount: this.form.received_amount,
              funds_account: this.form.account_name,
              remittance_bank_id: this.form.remittance_bank_id
            })
            .then(res => {
              this.$emit('update:inputVisible', false)
              this.resetForm()
              this.$parent.getList()
              this.formLoading = false
            })
            .catch(err => {
              console.log(err)
              this.formLoading = false
            })
        }
      })
    },
    amountBlur(e) {
      let value = e.target.value
      if (this.form.handling_fee) {
        if (value >= this.form.handling_fee) {
          this.form.received_amount = _.round(value - this.form.handling_fee, 2)
        }
      }
    },
    handleFeeBlur(e) {
      let value = e.target.value
      if (this.form.amount) {
        if (this.form.amount >= value) {
          this.form.received_amount = _.round(this.form.amount - value, 2)
        }
      }
    },
    fundAccountChange(value) {
      let index = _.findIndex(this.fundsOptions, { type: value })
      this.form.account_name = this.fundsOptions[index].login_id
    },
    handleCurrencyChange(value) {
      this.currencyBankList = this.bankList[value.toLowerCase()]
    },
    cancelModal() {
      this.fundsOptions = []
      this.$emit('update:inputVisible', false)
      this.resetForm()
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.fileList = []
    },
    onUserIdSearch(value) {
      if (value.trim()) {
        let user_id = value.trim()
        this.formLoading = true
        this.$apis
          .frontUserDetail({ user_id })
          .then(res => {
            this.fundsOptions = res.funds_account
            this.bankList = res.bank_list
            this.form = {
              ...this.form,
              zh_name: res.real_name,
              cus_en_name: res.english_name,
              cus_email: res.email,
              id: res.id,
              phone: res.phone
            }
            this.formLoading = false
          })
          .catch(err => {
            this.formLoading = false
          })
      }
    },
    uploadAction(data) {
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('put_dir', 'gygjqh_feed_back')
      this.formLoading = true
      this.$apis
        .uploadImgMulti(formData)
        .then(res => {
          let name = res.content.split('.')[res.content.split('.').length - 1]
          this.fileList.push({
            uid: new Date().getTime(),
            name: `image.${name}`,
            status: 'done',
            content: res.content,
            url: res.url
          })
          this.formLoading = false
          console.log(res, 'res122222')
        })
        .catch(err => {
          console.log(err)
          this.formLoading = false
        })
    },
    handleCancel() {
      this.previewVisible = false
    },
    removeImg(file) {
      let index = _.findIndex(this.fileList, ['uid', file.uid])
      this.fileList.splice(index, 1)
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.divider-line {
  position: absolute;
  left: 96.5%;
  top: 0;
  width: 1px;
  background-color: #f0f0f0;
  height: 100%;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.alert-words {
  color: #ff6600;
  margin-top: -22px;
  margin-bottom: 10px;
  font-size: 12px;
}
</style>
