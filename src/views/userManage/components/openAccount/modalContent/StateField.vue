<template>
  <a-modal
    :visible="visible"
    :maskClosable="false"
    :footer="null"
    width="100%"
    :dialogStyle="{ top: 0, 'padding-bottom': 0 }"
    :bodyStyle="{ height: '100vh', 'overflow-y': 'auto' }"
    @cancel="$emit('update:visible', false)"
  >
    <div class="modal-container">
      <div class="title-box">
        <p class="title">客户声明</p>
        <p class="mark">请代客户填写</p>
      </div>
      <div class="field-content">
        <a-form-model ref="stateForm" :model="form">
          <dl v-for="(item, index) in statement" :key="index">
            <a-form-model-item required>
              <span slot="label">{{ index + 1 }}、{{ item.label }}</span>
              <a-radio-group v-model="form.customer_state[index].value" :name="index.toString()" @change="handleStateChange">
                <dd><a-radio :value="0">否</a-radio></dd>
                <dd><a-radio :value="1">是</a-radio></dd>
              </a-radio-group>
              <dd class="input-wrapper" v-if="item.level_two_title && form.customer_state[index].value == 1">
                <span>{{ item.level_two_title }}</span>
                <a-input v-model="form.customer_state[index].input_value" :placeholder="item.placeholder" style="width: 200px;" />
              </dd>
              <dd class="input-wrapper" style="margin-top: 10px;" v-if="item.level_two_relation && form.customer_state[index].value == 1">
                <span>{{ item.level_two_relation }}</span>
                <a-input v-model="form.customer_state[index].input_value_2" :placeholder="item.placeholder" style="width: 200px;" />
              </dd>
            </a-form-model-item>
          </dl>
        </a-form-model>
      </div>
    </div>
    <div class="tc">
      <a-button type="default" size="large" style="margin-right: 20px;" @click="$emit('update:visible', false)">
        取消
      </a-button>
      <a-button type="primary" size="large" @click="handleSubmit" :disabled="loading">
        提交
      </a-button>
    </div>
    <spin v-show="loading" loading-desc="加载中" />
  </a-modal>
</template>

<script>
import { Modal, FormModel, Radio, Input, Button } from 'ant-design-vue'
import { statement } from '@/utils/question'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    [Modal.name]: Modal,
    [FormModel.name]: FormModel,
    [FormModel.Item.name]: FormModel.Item,
    [Radio.name]: Radio,
    [Radio.Group.name]: Radio.Group,
    [Input.name]: Input,
    [Button.name]: Button
  },
  data() {
    return {
      statement: [],
      form: {
        customer_state: [
          {
            value: 1,
            input_value: '',
            input_value_2: ''
          },
          {
            value: 0,
            input_value: '',
            input_value_2: ''
          },
          {
            value: 0,
            input_value: '',
            input_value_2: ''
          },
          {
            value: 0,
            input_value: '',
            input_value_2: ''
          },
          {
            value: 0,
            input_value: '',
            input_value_2: ''
          }
        ]
      },
      loading: false
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: ''
    }
  },
  computed: mapState({
    stateUid: state => state.openAccount.stateUid
  }),
  created() {
    this.getAnswer()
  },
  methods: {
    ...mapMutations('openAccount', ['SET_UID']),
    async getAnswer() {
      let params = { type: 2 }

      if (this.stateUid) {
        params.uuid = this.stateUid
      } else if (this.userId) {
        params.uuid = this.userId
      }

      if (this.stateUid || this.userId) {
        const stateInfo = await this.$apis.get_info_extend(params)
        this.statement = Array.isArray(stateInfo) ? stateInfo : this.form.customer_state
        this.form.customer_state = [...this.statement]
      }

      statement.forEach((item, index) => {
        this.statement[index] = Object.assign({}, item, this.statement[index])
      })
    },

    // 为否清空相关内容
    handleStateChange(e) {
      const targetEl = e.target
      if (targetEl.value == 0) {
        const _index = targetEl.name
        this.form.customer_state[_index].input_value = ''
        this.form.customer_state[_index].input_value_2 = ''
      }
    },

    // 提交
    handleSubmit() {
      this.$refs.stateForm.validate(valid => {
        if (valid) {
          let errDesc = ''
          for (let index in this.form.customer_state) {
            const item = this.form.customer_state[index]
            if (item.value == 1) {
              if (index == 3) {
                errDesc = '我司不接受申请人是美国公民'
                break
              }

              if (statement[index].level_two_title && !item.input_value) {
                errDesc = '请输入' + statement[index].level_two_title.replace(/\:|\：/g, '')
                break
              }
              if (statement[index].level_two_relation && !item.input_value_2) {
                errDesc = '请输入' + statement[index].level_two_relation.replace(/\:|\：/g, '')
                break
              }
            } else {
              if (index == 0) {
                errDesc = '我司不接受申请人为非账户最终受益人'
                break
              }
            }
          }

          if (errDesc) {
            this.$message.warning(errDesc)
            return
          }

          // console.log(this.form.customer_state)
          this.loading = true
          this.$apis
            .save_customer_State({ customer_state: this.form.customer_state })
            .then(res => {
              this.$message.success('提交成功')
              this.$emit('update:visible', false)
              this['SET_UID']({ type: 'state', uid: res.uuid })
            })
            .catch(err => {})
            .finally(() => {
              this.loading = false
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
@import './modalField.less';

.ant-form-item label {
  font-size: 16px;
}
/deep/.ant-form-item-label > label::after {
  content: '';
}
.input-wrapper {
  width: 355px;
  text-align: right;
}
</style>
