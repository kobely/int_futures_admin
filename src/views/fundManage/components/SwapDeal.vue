<template>
  <div>
    <!-- <a-form layout="inline" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" :form="form"> -->
    <a-form-item label="处理结果" class="mt-10">
      <a-select
        v-decorator="[
          'status',
          {
            rules: [
              {
                required: true,
                message: '请选择处理结果！'
              }
            ]
          }
        ]"
        placeholder="请选择"
        style="width: 205px;"
      >
        <a-select-option value="2">处理成功</a-select-option>
        <a-select-option value="3">处理失败</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="换出金额" class="mt-10">
      <a-input
        v-decorator="[
          'real_amount_out',
          {
            rules: [
              {
                required: true,
                message: '请输入换出金额！'
              }
            ],
            initialValue: re_amount_out
          }
        ]"
        style="width: 204px;"
        :addon-after="detailInfo.currency_out"
        placeholder="请输入"
        autocomplete="off"
        @change="handleAmountOutInput"
      />
    </a-form-item>
    <a-form-item label="兑换汇率" class="mt-10">
      <span class="form-right-text">
        {{ detailInfo.currency_out }} 1 = {{ detailInfo.currency_in }} {{ detailInfo.goalRate ? detailInfo.goalRate : '0.00' }}
      </span>
      <a-input
        v-decorator="[
          'real_rate',
          {
            initialValue: detailInfo.goalRate
          }
        ]"
        hidden
      />
    </a-form-item>
    <a-form-item label="换入金额" class="mt-10">
      <a-input
        v-decorator="[
          'real_amount_in',
          {
            rules: [
              {
                required: true,
                message: '请输入换入金额！'
              }
            ],
            initialValue: detailInfo.amount_in
          }
        ]"
        style="width: 204px;"
        :addon-after="detailInfo.currency_in"
        placeholder="请输入"
        autocomplete="off"
        @change="handleAmountInInput"
      />
    </a-form-item>
    <a-form-item label="备注" class="mt-10">
      <a-textarea
        v-decorator="['handler_remark']"
        :max-length="100"
        placeholder="选填，字数不超过100字"
        style="width: 270px; height: 75px;"
      ></a-textarea>
      <span class="input-num-wrap"> {{ form.getFieldValue('handler_remark') ? form.getFieldValue('handler_remark').length : 0 }}/100 </span>
    </a-form-item>
    <!-- </a-form> -->
    <!-- <spin loading-desc="加载中" v-show="loading" /> -->
  </div>
</template>

<script>
import { Form, Input, Select } from 'ant-design-vue'
import { pointNum } from '@/utils/util'
// const formItemLayout = {
//   labelCol: { span: 8 },
//   wrapperCol: { span: 16 }
// }

export default {
  components: {
    // [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Input.name]: Input,
    [Input.TextArea.name]: Input.TextArea,
    [Input.Search.name]: Input.Search,
    [Select.name]: Select,
    [Select.Option.name]: Select.Option
  },
  data() {
    return {
      // formItemLayout,
      // form: this.$form.createForm(this),
      // loading: false,
    }
  },
  props: ['form', 'detailInfo'],
  computed: {
    re_amount_out() {
      const re_amount_out = (this.detailInfo.amount_in / this.detailInfo.goalRate).toFixed(2)
      return re_amount_out
    }
  },
  methods: {
    numChange(e) {
      const _num = e.target.value
      e.target.value = pointNum(_num, 2)
    },
    // 监听换出金额
    handleAmountOutInput(e) {
      this.numChange(e)
      this.$emit('update:act_method', 1)

      const amountOut = e.target.value
      let amountIn = 0

      if (amountOut > 0) {
        amountIn = (amountOut * this.detailInfo.goalRate).toFixed(2)
      } else {
        amountIn = '0.00'
      }
      this.form.setFieldsValue({ real_amount_in: amountIn })
    },
    // 监听换入金额
    handleAmountInInput(e) {
      this.numChange(e)
      this.$emit('update:act_method', 2)

      const _amountIn = e.target.value
      let _amountOut = 0

      if (_amountIn > 0) {
        _amountOut = (_amountIn / this.detailInfo.goalRate).toFixed(2)
      } else {
        _amountOut = '0.00'
      }
      this.form.setFieldsValue({ real_amount_out: _amountOut })
    }
  }
}
</script>

<style lang="less" scoped>
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
.form-right-text {
  width: 208px;
  display: inline-block;
  text-align: right;
}
/deep/ .ant-form-item > .ant-form-item-label {
  text-align: left;
}
.section-title {
  margin: 10px 0;
  font-weight: bold;
  font-size: 16px;
}
.input-num-wrap {
  position: absolute;
  right: 220px;
  top: -5px;
}
</style>
