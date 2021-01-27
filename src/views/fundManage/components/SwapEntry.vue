<template>
  <a-modal
    title="代客户录入换汇订单"
    :visible="visible"
    :maskClosable="false"
    width="800px"
    @cancel="$emit('update:visible', false)"
    @ok="handleSubmit"
  >
    <a-form layout="horizontal" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" :form="form">
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
            <a-form-item label="客户中文名">
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
            <a-form-item label="客户英文名">
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
            <a-form-item label="客户手机号">
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
            <a-form-item label="客 户 邮 箱">
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
              <a-form-item label="账 户 名">
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
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="right-wrapper">
            <a-form-item>
              <div slot="label" class="form-left-label">
                <p>美元账户</p>
                <p class="f-12">（可用资金）</p>
              </div>
              <span class="form-right-text">
                {{ funds_account_detail.usd_balance ? funds_account_detail.usd_balance + ' ' + funds_account_detail.base_currency : '--' }}
              </span>
            </a-form-item>
            <a-form-item>
              <div slot="label" class="form-left-label">
                <p>港币账户</p>
                <p class="f-12">（可用资金）</p>
              </div>
              <span class="form-right-text">
                {{ funds_account_detail.hkd_balance ? funds_account_detail.hkd_balance + ' ' + funds_account_detail.hkd_currency : '--' }}
              </span>
            </a-form-item>
            <a-form-item>
              <div slot="label" class="form-left-label">
                <p>人民币账户</p>
                <p class="f-12">（可用资金）</p>
              </div>
              <span class="form-right-text">
                {{ funds_account_detail.cny_balance ? funds_account_detail.cny_balance + ' ' + funds_account_detail.cny_currency : '--' }}
              </span>
            </a-form-item>
            <div class="flex-center">
              <a-form-item label="由 金 额" class="currency-input-wrapper">
                <a-select
                  v-decorator="[
                    'currency_out',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请选择转出币种！'
                        }
                      ],
                      initialValue: defaultCurrencyOut
                    }
                  ]"
                  placeholder="请选择"
                  style="margin-right: 10px;"
                  @change="handleCurrencyOut"
                >
                  <a-select-option v-for="item in currencyOutList" :key="item.value" :disabled="item.disabled" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item class="amount-input-wrapper">
                <a-input
                  v-decorator="[
                    'amount_out',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入金额！'
                        }
                      ]
                    }
                  ]"
                  style="width: 100px;"
                  placeholder="请输入"
                  autocomplete="off"
                  @change="handleAmountOutInput"
                />
              </a-form-item>
            </div>
            <div class="flex-center">
              <a-form-item label="换汇至金额" class="currency-input-wrapper">
                <a-select
                  v-decorator="[
                    'currency_in',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请选择转入币种！'
                        }
                      ],
                      initialValue: defaultCurrencyIn
                    }
                  ]"
                  placeholder="请选择"
                  style="margin-right: 10px;"
                  @change="handleCurrencyIn"
                >
                  <a-select-option v-for="item in currencyInList" :key="item.value" :disabled="item.disabled" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item class="amount-input-wrapper">
                <a-input
                  v-decorator="[
                    'amount_in',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入金额！'
                        }
                      ]
                    }
                  ]"
                  style="width: 100px;"
                  placeholder="请输入"
                  autocomplete="off"
                  @change="handleAmountInInput"
                />
              </a-form-item>
            </div>
            <a-form-item label="参考汇率">
              <p class="form-right-text">
                <!-- <span class="f-12">20201010更新</span> -->
                {{ form.getFieldValue('currency_out') }} 1 = {{ form.getFieldValue('currency_in') }} {{ goalRate }}
              </p>
              <a-input
                v-decorator="[
                  'rate',
                  {
                    initialValue: goalRate
                  }
                ]"
                hidden
              />
            </a-form-item>
            <a-form-item label="备注">
              <a-textarea
                v-decorator="['customer_remark']"
                :max-length="40"
                placeholder="选填，字数不超过40字"
                style="width: 270px; height: 75px;"
              ></a-textarea>
              <span class="input-num-wrap"> {{ form.getFieldValue('customer_remark') ? form.getFieldValue('customer_remark').length : 0 }}/40 </span>
            </a-form-item>
          </div>
        </a-col>
      </a-row>
    </a-form>
    <spin loading-desc="录入中" v-show="loading" />
  </a-modal>
</template>

<script>
import { Modal, Form, Row, Col, Input, Select, Button } from 'ant-design-vue'
import _ from 'lodash'
import { pointNum, accSub } from '@/utils/util'
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
const currencyList = [
  {
    label: 'USD',
    value: 'USD'
  },
  {
    label: 'HKD',
    value: 'HKD'
  },
  {
    label: 'CNY',
    value: 'CNY'
  }
]

export default {
  components: {
    [Modal.name]: Modal,
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Row.name]: Row,
    [Col.name]: Col,
    [Input.name]: Input,
    [Input.TextArea.name]: Input.TextArea,
    [Input.Search.name]: Input.Search,
    [Select.name]: Select,
    [Select.Option.name]: Select.Option,
    [Button.name]: Button
  },
  data() {
    return {
      formItemLayout,
      form: this.$form.createForm(this),
      userDetailInfo: {},
      funds_account_detail: {},
      rateList: [],
      goalRate: '0.00',
      loading: false,
      currencyInList: _.cloneDeep(currencyList),
      currencyOutList: _.cloneDeep(currencyList),
      defaultCurrencyIn: 'HKD', // 默认换入币种
      defaultCurrencyOut: 'USD', // 默认换出币种
      act_method: 2 // 告诉后台修改的哪个框，默认除。换出金额：1（乘） 换入金额：2（除）
    }
  },
  props: ['visible'],
  created() {
    this.getRateList()

    this.dealCurrencyList(this.currencyOutList, this.defaultCurrencyIn)
    this.dealCurrencyList(this.currencyInList, this.defaultCurrencyOut)
  },
  methods: {
    // 获取利率列表
    getRateList() {
      this.$apis
        .get_rate_list()
        .then(res => {
          this.rateList = res.list
          this.getGoalRate(this.defaultCurrencyOut, this.defaultCurrencyIn)
        })
        .catch(err => {})
    },

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
      this.funds_account_detail = this.userDetailInfo.funds_account.filter(item => item.type == val)[0]
    },

    // 设置币种是否可选
    dealCurrencyList(list, targetCurrency) {
      list.map(i => {
        if (i.value == targetCurrency) {
          i.disabled = true
        } else {
          i.disabled = false
        }
      })
    },

    // 获取目标汇率
    getGoalRate(currency_out, currency_in) {
      this.goalRate = this.rateList.filter(i => i.currency_in == currency_in && i.currency_out == currency_out)[0].rate
    },

    // 监听换出币种
    handleCurrencyOut(val) {
      const currency_in = this.form.getFieldValue('currency_in')
      this.getGoalRate(val, currency_in)

      const amountOut = this.form.getFieldValue('amount_out')
      if (amountOut) {
        this.setAmountIn(amountOut, this.goalRate)
      }

      this.dealCurrencyList(this.currencyInList, val)
    },

    // 监听换入币种
    handleCurrencyIn(val) {
      const currency_out = this.form.getFieldValue('currency_out')
      this.getGoalRate(currency_out, val)

      const amountOut = this.form.getFieldValue('amount_out')
      if (amountOut) {
        this.setAmountIn(amountOut, this.goalRate)
      }

      this.dealCurrencyList(this.currencyOutList, val)
    },

    numChange(e) {
      const _num = e.target.value
      e.target.value = pointNum(_num, 2)
    },

    // 监听换出金额
    handleAmountOutInput(e) {
      this.numChange(e)
      this.act_method = 1

      const amountOut = e.target.value
      this.setAmountIn(amountOut, this.goalRate)
    },

    // 设置换入金额
    setAmountIn(amountOut, rate) {
      let amountIn = 0

      if (amountOut > 0) {
        amountIn = (amountOut * rate).toFixed(2)
      } else {
        amountIn = '0.00'
      }
      this.form.setFieldsValue({ amount_in: amountIn })
    },

    // 监听换入金额
    handleAmountInInput(e) {
      this.numChange(e)
      this.act_method = 2

      const _amountIn = e.target.value
      this.setAmountOut(_amountIn, this.goalRate)
    },

    // 设置换出金额
    setAmountOut(_amountIn, rate) {
      let _amountOut = 0

      if (_amountIn > 0) {
        _amountOut = (_amountIn / rate).toFixed(2)
      } else {
        _amountOut = '0.00'
      }
      this.form.setFieldsValue({ amount_out: _amountOut })
    },

    // 提交
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, formQuery) => {
        if (!err) {
          // console.log(formQuery)
          const params = Object.assign(formQuery, {
            uid: this.userDetailInfo.id,
            account: this.funds_account_detail.login_id,
            act_method: this.act_method
          })

          this.loading = true
          this.$apis
            .set_exchange_add(params)
            .then(res => {
              this.$toast.success('录入成功')
              this.$emit('update:visible', false)
              this.$parent.getList()
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

<style lang="less" scoped>
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
.form-left-label {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
}
.form-right-text {
  width: 208px;
  display: inline-block;
  text-align: right;
}
.currency-input-wrapper {
  /deep/ .ant-form-item-label,
  /deep/ .ant-form-item-control-wrapper {
    width: 100px;
  }
}
.amount-input-wrapper {
  width: 100px !important;
  /deep/ .ant-form-item-control-wrapper {
    width: 100%;
  }
}
.f-12 {
  font-size: 12px;
}
.input-num-wrap {
  position: absolute;
  right: 210px;
  top: -5px;
}
</style>
