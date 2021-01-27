<template>
  <a-modal title="修改汇率" :visible="visible" :maskClosable="false" width="500px" @cancel="$emit('update:visible', false)" @ok="handleSubmit">
    <a-form-model ref="rateForm" :model="form" :rules="rules">
      <a-form-model-item>
        <div class="rate-change-field">
          <a-select v-model="form.currency_out" placeholder="请选择换出货币" style="width: 150px;" @change="handleCurrencyOut">
            <a-select-option v-for="item in currencyOutList" :key="item.value" :disabled="item.disabled" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
          <a-icon type="arrow-right" />
          <a-select v-model="form.currency_in" placeholder="请选择换入货币" style="width: 150px;" @change="handleCurrencyIn">
            <a-select-option v-for="item in currencyInList" :key="item.value" :disabled="item.disabled" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
      </a-form-model-item>
      <a-form-model-item prop="rate">
        <div class="rate-change-field">
          <p class="currency-out-num">1</p>
          <span>=</span>
          <a-input v-model="form.rate" placeholder="请输入汇率" style="width: 150px;" @change="numChange" />
        </div>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { Modal, FormModel, Input, Select, Icon } from 'ant-design-vue'
import _ from 'lodash'
import { pointNum } from '@/utils/util'

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
    [FormModel.name]: FormModel,
    [FormModel.Item.name]: FormModel.Item,
    [Input.name]: Input,
    [Select.name]: Select,
    [Select.Option.name]: Select.Option,
    [Icon.name]: Icon
  },
  props: ['visible'],
  data() {
    return {
      form: {
        currency_out: 'USD',
        currency_in: 'HKD',
        rate: ''
      },
      rules: {
        rate: [{ required: true, message: '请输入汇率' }]
      },
      currencyInList: _.cloneDeep(currencyList),
      currencyOutList: _.cloneDeep(currencyList)
    }
  },
  created() {
    this.getRateList()
  },
  methods: {
    // 获取目标汇率
    async getRateList() {
      const rateList = await this.$apis.get_rate_list()
      this.rateList = rateList.list

      this.getGoalRate(this.form.currency_out, this.form.currency_in)
      this.dealCurrencyList(this.currencyOutList, this.form.currency_in)
      this.dealCurrencyList(this.currencyInList, this.form.currency_out)
    },

    // 获取目标汇率
    getGoalRate(currency_out, currency_in) {
      const targetRateList = this.rateList.filter(i => i.currency_in == currency_in && i.currency_out == currency_out)
      this.form.rate = targetRateList.length ? targetRateList[0].rate : ''
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

    // 最多输入4位小数
    numChange(e) {
      const _num = e.target.value
      this.form.rate = pointNum(_num, 4)
    },

    // 监听换出币种
    handleCurrencyOut(val) {
      this.getGoalRate(val, this.form.currency_in)
      this.dealCurrencyList(this.currencyInList, val)
    },

    // 监听换入币种
    handleCurrencyIn(val) {
      this.getGoalRate(this.form.currency_out, val)
      this.dealCurrencyList(this.currencyOutList, val)
    },

    handleSubmit() {
      this.$refs.rateForm.validate(valid => {
        if (valid) {
          this.$apis
            .add_manage_rate(this.form)
            .then(res => {
              this.$toast.success('操作成功')
              this.$emit('update:visible', false)
              this.$parent.getList()
            })
            .catche(err => {})
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.rate-change-field {
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.currency-out-num {
  width: 150px;
  text-align: right;
}
/deep/ .ant-form-explain {
  padding-left: 57%;
}
</style>
