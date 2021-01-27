<template>
  <div>
    <a-form layout="inline" :form="form" @submit="handleSubmit">
      <p style="margin-bottom: 10px;">用户 {{ info.real_name }} {{ info.english_name }} （{{ info.user_id }}）</p>
      <a-row style="padding-left: 30px;">
        <a-col>
          <a-form-item label="收款银行">
            <span>{{ info.receiver_bank_cn }}</span>
          </a-form-item>
          <a-form-item label="收款人名称">
            <span>{{ info.payee_name }}</span>
          </a-form-item>
          <a-form-item label="收款账号">
            <a-input
              placeholder="请输入"
              autocomplete="off"
              :maxLength="20"
              v-decorator="[
                'payee_sub_account',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入收款账号'
                    },
                    {
                      min: 3,
                      message: '请输入至少3位数'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row class="modal-button-wrap">
        <a-col>
          <a-form-item>
            <a-button type="default" style="display: inline-block; margin-right: 20px;" @click="$emit('update:showModal', false)">
              取消
            </a-button>
            <a-button type="primary" html-type="submit" :disabled="loading">
              确定
            </a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <spin loading-desc="正在开通中" v-show="loading" />
  </div>
</template>

<script>
import { Form, Row, Col, Input, Button } from 'ant-design-vue'

export default {
  components: {
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Row.name]: Row,
    [Col.name]: Col,
    [Input.name]: Input,
    [Button.name]: Button
  },
  props: ['info'],
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()

      this.form.validateFieldsAndScroll((err, formQuery) => {
        if (!err) {
          const params = Object.assign(formQuery, {
            sub_account_id: this.info.sub_account_id
          })
          this.loading = true
          this.$apis
            .open_sub_account(params)
            .then(res => {
              this.$toast.success('开通成功')
              this.$emit('update:showModal', false)
              this.$emit('update:isNeedReload', true)
            })
            .catch(err => {})
            .finally(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
