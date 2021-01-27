<template>
  <div class="deposit-handle">
    <a-spin :spinning="formLoading">
      <a-form-model :model="form" :rules="rules" layout="inline" ref="ruleForm">
        <a-row type="flex" :gutter="16" justify="space-between">
          <a-col :span="12">
            <BaseInfo title="用户基本信息" :detailInfo="userInfo" :leftPart="userLeftPart" :rightPart="userRightPart"></BaseInfo>
          </a-col>
          <a-col :span="12">
            <BaseInfo title="资金订单信息" :detailInfo="orderInfo" :leftPart="orderLeftPart" :rightPart="orderRightPart"></BaseInfo>
          </a-col>
        </a-row>
        <div class="remittance-certi m-top15" v-if="imgList.length > 0">
          <a-card title="汇款凭证" :bordered="false">
            <ul class="img-list">
              <li v-for="(item, index) in imgList" :key="index">
                <img :src="item" alt="" />
                <span>{{ imgInfo[index] }}</span>
              </li>
            </ul>
          </a-card>
        </div>
        <div class="handle-order m-top15">
          <a-card title="处理订单" :bordered="false">
            <a-form-model-item label="手续费" prop="handling_fee">
              <a-input v-model="form.handling_fee" placeholder="请输入手续费" :disabled="isEdit" @change="handleFeeChange" />
            </a-form-model-item>
            <a-form-model-item label="处理结果" prop="order_status">
              <a-select style="width: 200px;" placeholder="请选择处理结果" :disabled="isEdit" v-model="form.order_status">
                <template v-if="detailInfo.order_status == 0">
                  <a-select-option :value="1">处理成功</a-select-option>
                  <a-select-option :value="2">处理失败</a-select-option>
                </template>
                <template v-else>
                  <a-select-option :value="1">处理成功</a-select-option>
                  <a-select-option :value="2">处理失败</a-select-option>
                  <a-select-option :value="3">自动处理</a-select-option>
                  <a-select-option :value="4">退款到账</a-select-option>
                </template>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="到账资金" prop="received_amount">
              <a-input v-model="form.received_amount" :disabled="isEdit" placeholder="请输入到账资金" />
            </a-form-model-item>
            <a-form-model-item label="备  注" prop="remark" v-if="!isEdit || form.remark">
              <a-input v-model="form.remark" type="textarea" :disabled="isEdit" placeholder="请输入" style="width: 260px; height: 75px;" />
            </a-form-model-item>
          </a-card>
        </div>
        <div class="submit-operation m-top15" v-if="!isEdit">
          <a-button type="primary" @click="handleOrder">
            提交
          </a-button>
          <a-button @click="$router.push('/fundManage/customerDeposit')">
            取消
          </a-button>
        </div>
      </a-form-model>
    </a-spin>
  </div>
</template>

<script>
import { Card, Row, Col, Button, FormModel, Input, Select, Spin } from 'ant-design-vue'
import BaseCard from '../../components/BaseCard'
import { pointNum, accSub } from '@/utils/util'

export default {
  components: {
    [BaseCard.name]: BaseCard,
    [Button.name]: Button,
    [Card.name]: Card,
    [Row.name]: Row,
    [Col.name]: Col,
    [FormModel.name]: FormModel,
    [FormModel.Item.name]: FormModel.Item,
    [Input.name]: Input,
    [Select.name]: Select,
    [Spin.name]: Spin,
    [Select.Option.name]: Select.Option
  },
  data() {
    let checkNumber = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error('不是有效数字'))
      }
      callback()
    }
    return {
      form: {},
      formLoading: false,
      rules: {
        handling_fee: [
          {
            required: true,
            message: '请输入手续费',
            trigger: 'blur'
          },
          {
            validator: checkNumber,
            trigger: 'blur'
          }
        ],
        order_status: [
          {
            required: true,
            message: '请选择处理结果',
            trigger: 'change'
          }
        ],
        received_amount: [
          {
            required: true,
            message: '请输入到账资金',
            trigger: 'blur'
          }
        ]
      },
      imgList: [],
      isEdit: false,
      detailInfo: {},
      labelCol: { span: 2 },
      wrapperCol: { span: 5 },
      userInfo: {},
      orderInfo: {},
      userLeftPart: [
        {
          key: 'user_id',
          label: '用户名'
        },
        {
          key: 'real_name',
          label: '中文名'
        },
        {
          key: 'english_name',
          label: '英文名'
        },
        {
          key: 'country',
          label: '国家/地区'
        },
        {
          key: 'phone',
          label: '手机号'
        },
        {
          key: 'email',
          label: '邮箱'
        }
      ],
      userRightPart: [
        {
          key: 'funds_account_type',
          label: '资金账户'
        },
        {
          key: 'funds_account',
          label: '账户名'
        },
        {
          key: 'base_balance',
          label: '账户总资金量(base)'
        },
        {
          key: 'usd_balance',
          label: '美元账户'
        },
        {
          key: 'hkd_balance',
          label: '港币账户'
        },
        {
          key: 'cny_balance',
          label: '人民币账户'
        }
      ],
      orderLeftPart: [
        {
          key: 'funds_change_type',
          label: '订单类型'
        },
        {
          key: 'remittance_currency',
          label: '转入币种'
        },
        {
          key: 'amount',
          label: '转入金额'
        },
        {
          key: 'created_at',
          label: '转入时间'
        }
      ],
      orderRightPart: [
        {
          key: 'pay_type',
          label: '支付方式'
        },
        {
          key: 'payee_account_type',
          label: '收款账户类型'
        },
        {
          key: 'receiving_bank_name',
          label: '收款银行'
        },
        {
          key: 'payee_name',
          label: '收款人名称'
        },
        {
          key: 'payee_account',
          label: ''
        }
      ],
      imgInfo: []
    }
  },
  activated() {
    this.isEdit = !+this.$route.query.isEdit
    // console.log(this.$route.query.isEdit, 'edit')
    this.getDetails()
  },
  methods: {
    async getDetails() {
      let fundsTypeKey = { 1: '转入', 2: '转出' }
      let payTypeKey = { 1: '汇款', 2: '划转', 3: '录入', 4: '换汇' }
      let accountTypeKey = { 1: 'A账户', 2: 'B账户' }
      let payAccountKey = { 1: '企业账号', 2: '客户资金托管账号' }
      let orderStatusKey = { 1: '转入', 2: '转出' }
      const accountType = {
        USD: '美元',
        HKD: '港币',
        CNY: '人民币'
      }

      try {
        this.formLoading = true
        let response = await this.$apis.getFundDetail({ record_id: this.$route.query.recordId })
        this.detailInfo = response
        this.imgList = (this.detailInfo.voucher && this.detailInfo.voucher.split(',')) || []
        this.imgInfo = this.detailInfo.voucher_info.split(',')
        this.userInfo = {
          user_id: this.detailInfo.user_id,
          real_name: this.detailInfo.user_info && this.detailInfo.user_info.real_name,
          english_name: this.detailInfo.user_info && this.detailInfo.user_info.english_name,
          country: this.detailInfo.user_info.get_open_account_info.country.name,
          phone: this.detailInfo.user_info && this.detailInfo.user_info.phone,
          email: this.detailInfo.user_info && this.detailInfo.user_info.email,
          funds_account_type: accountTypeKey[this.detailInfo.funds_account_type],
          funds_account: this.detailInfo.funds_account,
          base_balance: this.detailInfo.funds_account_info.qh.base_balance,
          usd_balance: this.detailInfo.funds_account_info.qh.usd_balance,
          hkd_balance: this.detailInfo.funds_account_info.qh.hkd_balance,
          cny_balance: this.detailInfo.funds_account_info.qh.cny_balance
        }
        this.orderInfo = {
          funds_change_type: fundsTypeKey[this.detailInfo.funds_change_type],
          remittance_currency: this.detailInfo.remittance_currency,
          amount: this.detailInfo.amount,
          created_at: this.detailInfo.created_at,
          pay_type: payTypeKey[this.detailInfo.pay_type],
          payee_account_type: payAccountKey[this.detailInfo.payee_account_type],
          receiving_bank_name: this.detailInfo.receiving_bank_name,
          payee_name: this.detailInfo.payee_name,
          payee_account: this.detailInfo.payee_account
        }
        this.form = {
          handling_fee: this.detailInfo.handling_fee,
          received_amount: this.detailInfo.received_amount,
          order_status: this.detailInfo.order_status || undefined,
          remark: this.detailInfo.remark
        }
        this.orderRightPart[4].label = accountType[this.detailInfo.remittance_currency] + '收款账号'
        if (this.detailInfo.pay_type == 4) {
          this.orderRightPart = [
            {
              key: 'pay_type',
              label: '支付方式'
            }
          ]
        }
        this.formLoading = false
      } catch (error) {
        this.formLoading = false
        console.log(error)
      }
    },
    handleFeeChange(e) {
      const _fee = e.target.value
      this.form.handling_fee = pointNum(_fee, 2)
      this.form.received_amount = accSub(this.detailInfo.amount, this.form.handling_fee)
    },
    handleOrder() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$apis
            .handleFundOrder({
              record_id: this.$route.query.recordId,
              ...this.form
            })
            .then(res => {
              this.$router.go(-1)
              console.log(res, 'response')
            })
            .catch(err => {})
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.deposit-handle {
  .m-top15 {
    margin-top: 15px;
  }
  .img-list {
    max-height: 300px;
    max-width: 100%;
    display: flex;
    overflow: auto;
    // justify-content: space-betweenace-between;
    li {
      max-width: 20%;
      max-height: 280px;
      margin-right: 10px;
      &:first-child {
        margin-left: 10px;
      }
      span {
        display: inline-block;
        text-align: center;
        width: 100%;
        padding-top: 10px;
      }
    }
    img {
      max-height: 100%;
      width: 100%;
    }
  }
  .submit-operation {
    text-align: center;
  }
}
</style>
