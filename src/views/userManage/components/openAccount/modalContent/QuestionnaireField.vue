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
        <p class="title">风险承受能力问卷</p>
        <p class="mark">请代客户填写</p>
      </div>
      <div class="field-content">
        <a-form-model ref="questionnaireForm" :model="form">
          <a-form-model-item
            v-for="(item, index) in questionnaireList"
            :key="index"
            :prop="'content[' + index + ']'"
            :rules="[{ required: true, message: '请选择！', trigger: 'change' }]"
          >
            <dl>
              <dt>
                {{ index + 1 }}、<span class="color-gray" v-if="item.preTitle">{{ item.preTitle }}</span>
                {{ item.title }}
                <span class="color-gray" v-if="item.posTitle">{{ item.posTitle }}</span>
              </dt>
              <dd>
                <a-checkbox-group v-model="form.content[index]" v-if="item.ref == 'checkBoxRef1'">
                  <a-checkbox :value="_item.name" v-for="(_item, _index) in item.choices" :key="_index" name="experience" class="mt-10">
                    {{ _item.text }}
                  </a-checkbox>
                </a-checkbox-group>
                <a-radio-group v-model="form.content[index]" v-else>
                  <a-radio :value="_item.name" v-for="(_item, _index) in item.choices" :key="_index">{{ _item.text }}</a-radio>
                </a-radio-group>
              </dd>
            </dl>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <div class="tc">
      <a-button type="default" size="large" style="margin-right: 20px;" @click="$emit('update:visible', false)">
        取消
      </a-button>
      <a-button type="primary" size="large" @click="handleSubmit" :disabled="loading">
        提交测评
      </a-button>
    </div>

    <a-modal title="测评结果" cancel-text="重新测评" :visible="resultModalVisible" @ok="handleOk" @cancel="handleRetest">
      <p class="test-result-type">{{ resultInfo.type }}投资者</p>
      <p>
        <span class="test-result-score">测评得分 {{ resultInfo.score }} 分</span>
        <span>
          风险承受度为
          <span class="test-result-level">{{ resultInfo.risk_tolerance }}</span></span
        >
      </p>
    </a-modal>
    <spin v-show="loading" loading-desc="加载中" />
  </a-modal>
</template>

<script>
import { Modal, FormModel, Radio, Checkbox, Input, Button } from 'ant-design-vue'
import { questionnaire } from '@/utils/question'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    [Modal.name]: Modal,
    [FormModel.name]: FormModel,
    [FormModel.Item.name]: FormModel.Item,
    [Radio.name]: Radio,
    [Radio.Group.name]: Radio.Group,
    [Checkbox.Group.name]: Checkbox.Group,
    [Input.name]: Input,
    [Button.name]: Button
  },
  data() {
    return {
      form: {
        content: []
      },
      questionnaireList: [],
      loading: false,
      resultModalVisible: false,
      resultInfo: {}
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
    questionnaireUid: state => state.openAccount.questionnaireUid
  }),
  created() {
    this.getAnswer()
  },
  methods: {
    ...mapMutations('openAccount', ['SET_UID']),
    async getAnswer() {
      let params = { type: 3 }

      if (this.questionnaireUid) {
        params.uuid = this.questionnaireUid
      } else if (this.userId) {
        params.uuid = this.userId
      }

      if (this.questionnaireUid || this.userId) {
        const questionnaireInfo = await this.$apis.get_info_extend(params)
        this.questionnaireList = questionnaireInfo.content || []
        this.questionnaireList.forEach(item => {
          this.form.content.push(item.result)
        })
      }

      questionnaire.forEach((item, index) => {
        this.questionnaireList[index] = Object.assign({}, this.questionnaireList[index], item)
      })
    },

    // 提交
    handleSubmit() {
      this.$refs.questionnaireForm.validate(valid => {
        if (valid) {
          let params = []
          questionnaire.forEach((item, index) => {
            params[index] = Object.assign({}, item, { result: this.form.content[index] })
          })

          this.loading = true
          this.$apis
            .save_risk_assessment({ content: params })
            .then(res => {
              const { uuid, score, risk_tolerance, type } = res
              this.resultModalVisible = true

              this.resultInfo = {
                score,
                risk_tolerance,
                type
              }
              this.$emit('update:estimateExamineResult', this.resultInfo)

              this['SET_UID']({ type: 'questionnaire', uid: uuid })
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
    },
    // 测评成功
    handleOk() {
      this.resultModalVisible = false
      this.$emit('update:visible', false)
    },
    // 重新测评
    handleRetest() {
      this.resultModalVisible = false
      document.getElementsByClassName('ant-modal-body')[0].scrollTop = 0
    }
  }
}
</script>

<style lang="less" scoped>
@import './modalField.less';

.mt-10 {
  margin-top: 10px;
}
.test-result-type {
  margin-bottom: 20px;
  font-size: 20px;
}
.test-result-score {
  margin-right: 40px;
}
.test-result-level {
  color: #f5222d;
}
.ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0;
}
</style>
