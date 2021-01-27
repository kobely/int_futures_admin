<template>
  <div>
    <a-form layout="inline" :form="form" @submit="handleSubmit">
      <p>用户 {{ info.real_name }} ({{ info.user_info && info.user_info.user_id }})</p>
      <a-row>
        <a-col>
          <a-form-item label="选择开通权限">
            <a-checkbox-group
              v-decorator="[
                'account_type',
                {
                  rules: [
                    {
                      required: true,
                      message: '请选择开通权限！',
                    },
                  ],
                  initialValue: defaultOpeningAccount,
                },
              ]"
              style="width: 100%;"
            >
              <a-checkbox value="3" :disabled="defaultOpeningAccount.includes('3')">香港期货权限</a-checkbox>
              <a-checkbox value="4" :disabled="defaultOpeningAccount.includes('4')">环球期货权限</a-checkbox>
              <!-- <a-checkbox value="5" :disabled="defaultOpeningAccount.includes('5')">连续合约权限</a-checkbox> -->
            </a-checkbox-group>
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
import { Form, Row, Col, Checkbox, Button } from 'ant-design-vue'

export default {
  components: {
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Row.name]: Row,
    [Col.name]: Col,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button,
  },
  props: ['info'],
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
    }
  },
  computed: {
    defaultOpeningAccount() {
      let openAccount = []
      if (this.info.hk_account_open == 1) {
        openAccount.push('3')
      }
      if (this.info.hq_account_open == 1) {
        openAccount.push('4')
      }
      if (this.info.lx_account_open == 1) {
        openAccount.push('5')
      }
      return openAccount
    },
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()

      this.form.validateFieldsAndScroll((err, formQuery) => {
        if (!err) {
          let params = { id: this.info.id }
          params.account_type = formQuery.account_type
            .sort()
            .filter((item, index) => item != this.defaultOpeningAccount[index])
            .join(',')

          if (!params.account_type) {
            this.$message.warning('请选择要开通的权限！')
            return
          }
          const isOtherFuture = params.account_type.includes('4') || params.account_type.includes('5')
          if (!formQuery.account_type.includes('3') && isOtherFuture) {
            this.$message.warning('请先开通香港期货权限！')
            return
          }

          this.loading = true
          this.$apis
            .set_human_open(params)
            .then((res) => {
              this.$toast.success('开通账户成功')
              this.$emit('update:showModal', false)
              this.$emit('update:isNeedReload', true)
            })
            .catch((err) => {})
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
  },
}
</script>

<style lang="less" scoped></style>
