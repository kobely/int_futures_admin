<template>
  <div class="detail-page">
    <breadcrumb-wrapper prevUrl="/fundManage/accountWithdraw" prevTitle="客户出金管理列表" currentTitle="客户出金处理页">
      <span class="mr-30" v-if="detailInfo.user_id">UserID：{{ detailInfo.user_id }}</span>
      <a-tag :color="detailInfo.order_status == 1 ? '#87d068' : '#f50'" v-if="detailInfo.order_status >= 0">
        {{ ORDER_STATUS[detailInfo.order_status] }}
      </a-tag>
    </breadcrumb-wrapper>
    <a-form-model :model="form" :rules="rules" layout="inline" ref="ruleForm">
      <a-row type="flex" :gutter="10" justify="space-between">
        <a-col :span="12">
          <BaseInfo title="用户基本信息" :detailInfo="detailInfo" :leftPart="userLeftPart" :rightPart="userRightPart"></BaseInfo>
        </a-col>
        <a-col :span="12">
          <BaseInfo title="资金订单信息" :detailInfo="detailInfo" :leftPart="orderLeftPart"></BaseInfo>
        </a-col>
      </a-row>
      <div class="remittance-certi mt-15" v-if="![2, 4].includes(detailInfo.pay_type)">
        <a-row type="flex" :gutter="16" justify="space-between">
          <a-col :span="12">
            <BaseInfo title="客户银行卡" :detailInfo="detailInfo.bank_info" :leftPart="cardLeftPart"></BaseInfo>
          </a-col>
        </a-row>
      </div>
      <div class="handle-order mt-15">
        <a-card title="处理订单" :bordered="false">
          <a-form-model-item label="手 续 费" prop="handling_fee">
            <a-input v-model="form.handling_fee" :disabled="notEdited" placeholder="请输入手续费" @change="handleFeeChange" />
          </a-form-model-item>
          <a-form-model-item label="处理结果" prop="order_status">
            <a-select style="width: 200px" v-model="form.order_status" :disabled="notEdited" placeholder="请选择处理结果">
              <template v-if="detailInfo.order_status == 0">
                <a-select-option :value="1">处理成功</a-select-option>
                <a-select-option :value="2">处理失败</a-select-option>
              </template>
              <template v-else>
                <a-select-option :value="index" v-for="(item, index) in ORDER_STATUS" :key="index">{{ item }}</a-select-option>
              </template>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="预计到账" prop="received_amount">
            <a-input v-model="form.received_amount" :disabled="notEdited" placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item label="备  注" prop="remark" v-if="detailInfo.order_status == 0 || form.remark">
            <a-input v-model="form.remark" type="textarea" :disabled="notEdited" placeholder="请输入" style="width: 260px; height: 75px" />
          </a-form-model-item>
        </a-card>
      </div>
      <div class="bottom-button-wrap mt-15" v-if="!$route.query.isView">
        <a-button type="primary" :disabled="detailInfo.order_status != '0' || isLoading" @click="handleWithdrawUpdate"> 提交 </a-button>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import { Card, Row, Col, Button, FormModel, Input, Select, Tag } from 'ant-design-vue'
import BaseCard from '@/components/BaseCard'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { pointNum, accAdd, accSub } from '@/utils/util'

export default {
  components: {
    BreadcrumbWrapper,
    [BaseCard.name]: BaseCard,
    [Button.name]: Button,
    [Card.name]: Card,
    [Row.name]: Row,
    [Col.name]: Col,
    [FormModel.name]: FormModel,
    [FormModel.Item.name]: FormModel.Item,
    [Input.name]: Input,
    [Select.name]: Select,
    [Select.Option.name]: Select.Option,
    [Tag.name]: Tag
  },
  data() {
    let checkNumber = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error('请输入有效数字'))
      }
      callback()
    }
    return {
      form: {
        handling_fee: '',
        order_status: undefined,
        received_amount: '',
        remark: ''
      },
      rules: {
        handling_fee: [
          {
            required: true,
            message: '请输入手续费',
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
          },
          {
            validator: checkNumber,
            trigger: 'blur'
          }
        ],
        remark: [
          {
            max: 400,
            message: '最大输入400字符',
            trigger: 'blur'
          }
        ]
      },
      labelCol: { span: 2 },
      wrapperCol: { span: 5 },
      detailInfo: {},
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
          key: 'funds_account_type_name',
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
          key: 'funds_change_type_desc',
          label: '订单类型'
        },
        {
          key: 'pay_type_desc',
          label: '出金方式'
        },
        {
          key: 'remittance_currency',
          label: '转出币种'
        },
        {
          key: 'amount',
          label: '转出金额'
        },
        {
          key: 'created_at',
          label: '订单时间'
        }
      ],
      cardLeftPart: [
        {
          key: 'bank_name',
          label: '收款银行'
        },
        {
          key: 'swift_code',
          label: 'SWIFT Code'
        },
        {
          key: 'cn_name',
          label: '收款人(中文名)'
        },
        {
          key: 'en_name',
          label: '收款人(英文名)'
        },
        {
          key: 'bank_card',
          label: '收款账号'
        }
      ],
      ORDER_STATUS: ['待处理', '处理成功', '处理失败', '自动处理', '退款到账'],
      WITHDRAW_METHORD: ['汇款', '划转', '录入', '换汇'],
      isLoading: false
    }
  },
  computed: {
    notEdited() {
      const isView = this.$route.query.isView ? true : false
      return this.detailInfo.order_status != 0 || isView
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.$apis
        .get_withdraw_detail({
          record_id: this.$route.query.record_id
        })
        .then(res => {
          this.detailInfo = res
          const {
            handling_fee,
            order_status,
            received_amount,
            remark,
            funds_account_type,
            funds_account_info,
            funds_change_type,
            pay_type
          } = this.detailInfo
          this.detailInfo = { ...this.detailInfo, ...this.detailInfo.user_info }

          this.detailInfo.country =
            this.detailInfo.get_open_account_info &&
            this.detailInfo.get_open_account_info.country &&
            this.detailInfo.get_open_account_info.country.name

          this.detailInfo.funds_account_type_name = funds_account_type == 1 ? '标准合约A账户' : '连续合约B账户'
          this.detailInfo.funds_change_type_desc = funds_change_type == 1 ? '转入' : '转出'
          this.detailInfo.pay_type_desc = this.WITHDRAW_METHORD[pay_type - 1]

          if (funds_account_type == 1) {
            this.detailInfo.base_balance = funds_account_info.qh.base_balance + ' USD'
            this.detailInfo.usd_balance = funds_account_info.qh.usd_balance + ' USD'
            this.detailInfo.hkd_balance = funds_account_info.qh.hkd_balance ? funds_account_info.qh.hkd_balance + ' HKD' : '--'
            this.detailInfo.cny_balance = funds_account_info.qh.cny_balance ? funds_account_info.qh.cny_balance + ' CNY' : '--'
          } else {
            this.userRightPart = [
              {
                key: 'funds_account_type_name',
                label: '资金账户'
              },
              {
                key: 'funds_account',
                label: '账户名'
              },
              {
                key: 'balance',
                label: '账户总资金量(base)'
              }
            ]
            this.detailInfo.balance = funds_account_info.lx.balance + ' USD'
          }

          // 已处理渲染结果
          this.form.handling_fee = handling_fee
          this.form.order_status = order_status != 0 ? order_status : undefined
          this.form.received_amount = received_amount
          this.form.remark = remark
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleFeeChange(e) {
      const _fee = e.target.value
      this.form.handling_fee = pointNum(_fee, 2)
      this.form.received_amount = accSub(this.detailInfo.amount, this.form.handling_fee)
    },
    handleWithdrawUpdate() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (accAdd(Number(this.form.received_amount), Number(this.form.handling_fee)) > this.detailInfo.amount) {
            this.$message.warning('到账金额+手续费需小于等于转出金额')
            return
          }
          const params = {
            ...this.form,
            ...{ record_id: this.detailInfo.record_id }
          }

          this.isLoading = true
          this.$apis
            .withdraw_update(params)
            .then(res => {
              this.getDetail()
              this.$message.success('操作成功')
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => {
              this.isLoading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../style/init.less');
.detail-page {
  padding: 54px 0 86px;
}
</style>
