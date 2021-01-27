<template>
  <div>
    <a-form layout="inline" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" :form="form" @submit="handleSubmit">
      <a-row>
        <a-col :span="12">
          <div class="left-wrapper">
            <a-form-item label="UserID">
              <a-input-search
                enter-button
                v-decorator="[
                  'user_id',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入UserID！'
                      }
                    ]
                  }
                ]"
                autocomplete="off"
                placeholder="请输入"
                style="width: 200px;"
                @search="handleSearch"
              />
            </a-form-item>
            <a-form-item label="客户中文名" class="mt-10">
              <a-input
                v-decorator="[
                  'real_name',
                  {
                    initialValue: userDetailInfo.real_name || '--'
                  }
                ]"
                disabled
                style="width: 200px;"
              />
            </a-form-item>
            <a-form-item label="客户英文名" class="mt-10">
              <a-input
                v-decorator="[
                  'english_name',
                  {
                    initialValue: userDetailInfo.english_name || '--'
                  }
                ]"
                disabled
                style="width: 200px;"
              />
            </a-form-item>
            <a-form-item label="客户手机号" class="mt-10">
              <a-input
                v-decorator="[
                  'phone',
                  {
                    initialValue: userDetailInfo.phone || '--'
                  }
                ]"
                disabled
                style="width: 200px;"
              />
            </a-form-item>
            <a-form-item label="客 户 邮 箱" class="mt-10">
              <a-input
                v-decorator="[
                  'email',
                  {
                    initialValue: userDetailInfo.email || '--'
                  }
                ]"
                disabled
                style="width: 200px;"
              />
            </a-form-item>
            <div class="next-field-wrapper">
              <p class="tip">说明：A账户是标准合约账户</p>
              <a-form-item label="资金账户">
                <a-select
                  v-decorator="[
                    'funds_account_type',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请选择资金账户！'
                        }
                      ]
                    }
                  ]"
                  style="width: 200px;"
                  placeholder="请选择"
                  @change="handleFundsAccountChange"
                >
                  <a-select-option :value="item.type" v-for="item in userDetailInfo.funds_account" :key="item.id">
                    {{ item.type == 1 ? 'A账户' : 'B账户' }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="账 户 名" class="mt-10">
                <a-input
                  v-decorator="[
                    'funds_account',
                    {
                      initialValue: funds_account_detail.login_id || '--'
                    }
                  ]"
                  disabled
                  style="width: 200px;"
                ></a-input>
              </a-form-item>
              <a-form-item label="可转出总额" class="mt-10">
                <a-input
                  v-decorator="[
                    'withdraw_amount',
                    {
                      initialValue: funds_account_detail.base_can_draw || '--'
                    }
                  ]"
                  disabled
                  style="width: 200px;"
                ></a-input>
              </a-form-item>
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="right-wrapper">
            <a-form-item label="订单类型">
              <a-input
                v-decorator="[
                  'funds_change_type',
                  {
                    initialValue: '转出'
                  }
                ]"
                disabled
                style="width: 200px;"
              ></a-input>
            </a-form-item>
            <a-form-item label="支付方式" class="mt-10">
              <a-input
                v-decorator="[
                  'pay_type',
                  {
                    initialValue: '录入'
                  }
                ]"
                disabled
                style="width: 200px;"
              ></a-input>
            </a-form-item>
            <a-form-item label="转出币种" class="mt-10">
              <a-select
                v-decorator="[
                  'remittance_currency',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择转出币种！'
                      }
                    ]
                  }
                ]"
                placeholder="请选择"
                style="width: 200px;"
                @change="handleCurrencyChange"
              >
                <a-select-option value="USD" v-if="form.getFieldValue('funds_account_type')">USD</a-select-option>
                <a-select-option value="HKD" v-if="form.getFieldValue('funds_account_type') == 1">HKD</a-select-option>
                <a-select-option value="CNY" v-if="form.getFieldValue('funds_account_type') == 1">CNY</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="可转出资金" class="mt-10">
              <a-input
                v-decorator="[
                  'currency_can_draw',
                  {
                    initialValue: '--'
                  }
                ]"
                disabled
                style="width: 200px;"
              ></a-input>
            </a-form-item>
            <a-form-item label="转出金额" class="mt-10">
              <a-input
                v-decorator="[
                  'amount',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入转出金额！'
                      }
                    ]
                  }
                ]"
                autocomplete="off"
                placeholder="请输入"
                style="width: 200px;"
                @change="numChange"
              ></a-input>
            </a-form-item>
            <a-form-item label="收款银行卡" class="mt-10">
              <a-select
                v-decorator="[
                  'remittance_bank_id',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择收款银行卡！'
                      }
                    ]
                  }
                ]"
                style="width: 200px;"
                placeholder="请选择"
              >
                <a-select-option :value="item.id" v-for="item in userDetailInfo.bank_list" :key="item.id">
                  {{ item.bank_name }} {{ '尾号' + item.bank_card.slice(-4, item.bank_card.length) }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <!-- <div class="next-field-wrapper">
              <a-form-item label="手 续 费" class="mt-10">
                <a-input
                  v-decorator="[
                    'handling_fee',
                    {
                      initialValue: '0.00',
                    },
                  ]"
                  autocomplete="off"
                  placeholder="请输入"
                  style="width: 200px;"
                  @input="handleFeeInput"
                  @change="numChange"
                ></a-input>
              </a-form-item>
              <a-form-item label="预计到账" class="mt-10">
                <a-input
                  v-decorator="[
                    'received_amount',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入预计到账金额！',
                        },
                      ],
                    },
                  ]"
                  autocomplete="off"
                  placeholder="请输入"
                  style="width: 200px;"
                  @change="numChange"
                ></a-input>
              </a-form-item>
              <a-form-item label="处理结果" class="mt-10">
                <a-select
                  v-decorator="[
                    'deal_status',
                    {
                      initialValue: '处理成功',
                    },
                  ]"
                  disabled
                  style="width: 200px;"
                  placeholder="请选择"
                >
                  <a-select-option value="2">核验通过</a-select-option>
                </a-select>
              </a-form-item>
            </div> -->
          </div>
        </a-col>
      </a-row>
      <a-row class="modal-button-wrap">
        <a-button type="default" style="display: inline-block; margin-right: 20px;" @click="$emit('update:showModal', false)">
          取消
        </a-button>
        <a-button type="primary" html-type="submit" :disabled="loading">
          确定
        </a-button>
      </a-row>
    </a-form>
    <spin loading-desc="录入中" v-show="loading" />
  </div>
</template>

<script>
import { Form, Row, Col, Input, Select, Button } from 'ant-design-vue'
import { pointNum, accAdd, accSub } from '@/utils/util'
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

export default {
  components: {
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Row.name]: Row,
    [Col.name]: Col,
    [Input.name]: Input,
    [Input.Search.name]: Input.Search,
    [Select.name]: Select,
    [Select.Option.name]: Select.Option,
    [Button.name]: Button
  },
  data() {
    return {
      formItemLayout,
      form: this.$form.createForm(this),
      loading: false,
      userDetailInfo: {},
      funds_account_detail: {}
    }
  },
  props: ['showModal', 'isNeedReload'],
  methods: {
    // 输入userId获取详情
    handleSearch(userId, e) {
      e.preventDefault()

      if (!userId) return
      const params = {
        user_id: userId,
        type: 2
      }
      this.$apis
        .frontUserDetail(params)
        .then(res => {
          this.userDetailInfo = res
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选择账户
    handleFundsAccountChange(val) {
      this.form.setFieldsValue({ remittance_currency: '', currency_can_draw: '--' })
      this.funds_account_detail = this.userDetailInfo.funds_account.filter(item => item.type == val)[0]
    },
    // 选择币种
    handleCurrencyChange(val) {
      let base_can_draw
      if (this.form.getFieldValue('funds_account_type') == 1) {
        const currency = val.toLowerCase()
        const currencyMoneyField = currency + '_can_draw'
        const money = this.funds_account_detail[currencyMoneyField]
        base_can_draw = money ? money : '0.00'
      } else {
        base_can_draw = this.funds_account_detail['base_can_draw']
      }

      this.form.setFieldsValue({ currency_can_draw: base_can_draw })
    },
    numChange(e) {
      const _num = e.target.value
      e.target.value = pointNum(_num, 2)
    },
    // 监听输入转出金额
    handleAmountInput(e) {
      const amount = e.target.value
      let received_amount = 0
      if (amount > 0) {
        const handling_fee = Number(this.form.getFieldValue('handling_fee'))
        received_amount = accSub(amount, handling_fee)
      } else {
        received_amount = '0.00'
      }
      this.form.setFieldsValue({ received_amount: received_amount })
    },
    // 监听输入手续费
    handleFeeInput(e) {
      const fee = e.target.value
      const _amount = Number(this.form.getFieldValue('amount'))
      let received_amount = 0
      if (fee > 0) {
        received_amount = accSub(_amount, fee)
      } else {
        received_amount = _amount
      }
      this.form.setFieldsValue({ received_amount: received_amount })
    },
    // 提交
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, formQuery) => {
        if (!err) {
          // console.log(formQuery)
          const { received_amount, handling_fee, amount, currency_can_draw } = formQuery
          // if (received_amount <= Number(handling_fee)) {
          //   this.$message.warning('手续费需小于到账金额')
          //   return
          // } else if (amount <= Number(handling_fee)) {
          //   this.$message.warning('手续费需小于转出金额')
          //   return
          // } else if (received_amount > Number(amount)) {
          //   this.$message.warning('到账金额需小于等于转出金额')
          //   return
          // } else if (accAdd(Number(received_amount), Number(handling_fee)) > amount) {
          //   this.$message.warning('到账金额+手续费需小于等于转出金额')
          //   return
          // }
          if (amount > Number(currency_can_draw)) {
            this.$message.warning('转出金额需小于等于可转出金额')
            return
          }
          const params = Object.assign(formQuery, {
            id: this.userDetailInfo.id
          })

          delete params.currency_can_draw
          delete params.withdraw_amount

          this.loading = true
          this.$apis
            .withdraw_save(params)
            .then(res => {
              this.$toast.success('录入成功')
              this.$emit('update:showModal', false)
              this.$emit('update:isNeedReload', true)
            })
            .catch(err => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="less" soped>
@import url('../../../style/init.less');
.left-wrapper,
.right-wrapper {
  padding: 0 35px;
  .ant-row {
    width: 100%;
  }
}
.left-wrapper {
  border-right: 1px solid #e5e5e5;
}
.next-field-wrapper {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e5e5e5;
  .tip {
    margin-bottom: 10px;
    font-size: 12px;
    color: #ff6600;
  }
}
</style>
