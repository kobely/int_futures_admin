<template>
  <a-modal title="新增银行卡" :visible="visible" :maskClosable="false" width="800px" @cancel="$emit('update:visible', false)" @ok="handleSubmit">
    <a-form-model ref="bankAddForm" :model="form" :rules="rules" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
      <a-row>
        <a-col :span="12">
          <div class="left-wrapper">
            <a-form-model-item label="UserID" prop="user_id">
              <span v-if="bankId">{{ form.user_account }}</span>
              <a-input-search
                v-model="form.user_id"
                v-else
                enter-button
                autocomplete="off"
                placeholder="请输入"
                style="width: 200px;"
                @search="handleSearch"
              />
            </a-form-model-item>
            <a-form-model-item label="客户中文名">
              <span v-if="bankId">{{ form.cn_name }}</span>
              <a-input v-else v-model="userDetailInfo.real_name" disabled style="width: 200px;" />
            </a-form-model-item>
            <a-form-model-item label="客户英文名">
              <span v-if="bankId">{{ form.en_name }}</span>
              <a-input v-else v-model="userDetailInfo.english_name" disabled style="width: 200px;" />
            </a-form-model-item>
            <a-form-model-item label="客户手机号">
              <span v-if="bankId">{{ form.user_info && form.user_info.phone }}</span>
              <a-input v-else v-model="userDetailInfo.phone" disabled style="width: 200px;" />
            </a-form-model-item>
            <a-form-model-item label="客 户 邮 箱">
              <span v-if="bankId">{{ form.user_info && form.user_info.email }}</span>
              <a-input v-else v-model="userDetailInfo.email" disabled style="width: 200px;" />
            </a-form-model-item>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="right-wrapper">
            <a-form-model-item label="银行名称" prop="bank_name">
              <a-input v-model="form.bank_name" :maxLength="30" placeholder="请输入" style="width: 200px;" />
            </a-form-model-item>
            <a-form-model-item label="银行账号" prop="bank_card">
              <a-input v-model="form.bank_card" style="width: 200px;" :maxLength="20" placeholder="请输入" autocomplete="off" @change="numChange" />
            </a-form-model-item>
            <a-form-model-item label="支持的币种" prop="currency_type">
              <a-checkbox-group v-model="form.currency_type">
                <a-checkbox value="HKD">港币</a-checkbox>
                <a-checkbox value="USD">美元</a-checkbox>
                <a-checkbox value="CNY">人民币</a-checkbox>
              </a-checkbox-group>
            </a-form-model-item>
            <a-form-model-item label="是否主银行卡">
              <a-radio-group v-model="form.is_main">
                <a-radio :value="1" name="isMain">是</a-radio>
                <a-radio :value="0" name="isMain">否</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <p class="description">* 说明：主银行是指写入开户书的银行卡</p>
          </div>
        </a-col>
      </a-row>
    </a-form-model>
    <spin loading-desc="加载中" v-show="loading" />
  </a-modal>
</template>

<script>
import { Modal, FormModel, Row, Col, Input, Radio, Checkbox, Button } from 'ant-design-vue'
import { pointNum } from '@/utils/util'

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 }
}

export default {
  components: {
    [Modal.name]: Modal,
    [FormModel.name]: FormModel,
    [FormModel.Item.name]: FormModel.Item,
    [Row.name]: Row,
    [Col.name]: Col,
    [Input.name]: Input,
    [Input.TextArea.name]: Input.TextArea,
    [Input.Search.name]: Input.Search,
    [Radio.name]: Radio,
    [Radio.Group.name]: Radio.Group,
    [Checkbox.Group.name]: Checkbox.Group,
    [Button.name]: Button
  },
  data() {
    return {
      formItemLayout,
      form: {
        user_id: '',
        currency_type: [],
        bank_name: '',
        bank_card: '',
        is_main: 1
      },
      rules: {
        user_id: [
          {
            required: true,
            message: '请输入UserID！',
            trigger: 'blur'
          }
        ],
        bank_name: [
          {
            required: true,
            message: '请输入银行名称！',
            trigger: 'blur'
          }
        ],
        bank_card: [
          {
            required: true,
            message: '请输入银行账号！',
            trigger: 'blur'
          }
        ],
        currency_type: [
          {
            required: true,
            message: '请选择支持的币种！',
            trigger: 'change'
          }
        ]
      },
      userDetailInfo: {},
      loading: false
    }
  },
  props: ['visible', 'bankId'],
  async created() {
    if (this.bankId) {
      const detailInfo = await this.$apis.get_bank_info({ id: this.bankId })
      this.form = Object.assign(detailInfo, {
        currency_type: detailInfo.currency_type.split(',')
      })
    }
  },
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

    numChange(e) {
      const _num = e.target.value
      this.form.bank_card = pointNum(_num, 0)
    },

    // 提交
    handleSubmit() {
      this.$refs.bankAddForm.validate(valid => {
        if (valid) {
          this.loading = true

          if (this.bankId) {
            // 修改
            const { bank_name, bank_card, currency_type, is_main } = this.form
            const params = {
              id: this.bankId,
              bank_name,
              bank_card,
              currency_type: currency_type.join(','),
              is_main
            }

            this.$apis
              .update_bank_info(params)
              .then(res => {
                this.$toast.success('操作成功')
                this.$emit('update:visible', false)
                this.$parent.getList()
              })
              .catch(err => {})
              .finally(() => {
                this.loading = false
              })
          } else {
            // 新增
            const params = Object.assign({}, this.form, {
              uid: this.userDetailInfo.id,
              currency_type: this.form.currency_type.join(',')
            })

            this.$apis
              .add_bank_card(params)
              .then(res => {
                this.$toast.success('操作成功')
                this.$emit('update:visible', false)
                this.$parent.getList()
              })
              .catch(err => {})
              .finally(() => {
                this.loading = false
              })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.left-wrapper,
.right-wrapper {
  padding: 0 30px;
  .ant-row {
    width: 100%;
  }
}
.left-wrapper {
  border-right: 1px solid #e5e5e5;
}
.description {
  font-size: 12px;
  color: #ff6600;
}
</style>
