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
        <p class="title">客户适当性调查问卷</p>
        <p class="mark">请代客户填写</p>
      </div>
      <div class="field-content">
        <a-form-model ref="surveyForm" :model="form">
          <div class="section-area section-one" v-if="form.investTarget.length">
            <div class="survery-type">投资目标</div>
            <dl v-for="(item, index) in form.investTarget" :key="index">
              <a-form-model-item required prop="investTarget[0]" :rules="[{ validator: checkValidate, trigger: 'change' }]">
                <span slot="label">{{ item.title }}</span>
                <a-checkbox-group v-model="item.value" @change="onInvestTargetChange">
                  <dd v-for="(_item, _index) in item.options" :key="_index">
                    <a-checkbox :value="_item.value" name="invest_target">
                      {{ _item.label }}
                    </a-checkbox>
                    <a-input
                      v-model="_item.inputValue"
                      v-if="_item.isChecked"
                      style="margin-left: 20px; width: 200px;"
                      :placeholder="_item.placeholder"
                    />
                  </dd>
                </a-checkbox-group>
              </a-form-model-item>
            </dl>
          </div>

          <div class="section-area section-two" v-if="form.derivative[0] && form.derivative[0].options.length">
            <div class="survery-type">对衍生品的认知</div>
            <a-form-model-item prop="derivative[0]" :rules="[{ validator: radioValidate, trigger: 'change' }]">
              <a-radio-group v-model="form.derivative[0].value" @change="onDerivativeChange">
                <div v-for="(item, index) in form.derivative[0].options" :key="index">
                  <p class="mb-10 f-16">
                    <a-radio :value="item.name" name="derivative">{{ item.label }}</a-radio>
                  </p>
                  <template v-if="form.derivative[0].value === 0">
                    <dl v-for="(_item, _index) in item.children" :key="_index">
                      <dt>{{ _item.label }}</dt>
                      <a-checkbox-group v-model="_item.value" v-if="_item.type == 'checkbox'">
                        <dd v-for="_option in _item.options" :key="_option.label">
                          <a-checkbox :value="_option.name" :name="'derivative' + _option.name">{{ _option.label }}</a-checkbox>
                        </dd>
                      </a-checkbox-group>
                      <a-radio-group v-model="_item.value" v-else>
                        <dd v-for="_option in _item.options" :key="_option.label">
                          <a-radio :value="_option.name">{{ _option.label }}</a-radio>
                        </dd>
                      </a-radio-group>
                    </dl>
                  </template>
                </div>
              </a-radio-group>
            </a-form-model-item>
          </div>

          <div class="section-area section-three" v-if="form.investmentExp.length">
            <div class="survery-type">投资经验</div>
            <dl v-for="(item, index) in form.investmentExp" :key="index">
              <!-- <dt>{{ item.label }}</dt> -->
              <dd>
                <a-form-model-item required :prop="'investmentExp[' + index + ']'" :rules="[{ validator: selectValidate, trigger: 'change' }]">
                  <span slot="label">{{ item.label }}</span>
                  <a-select
                    v-if="item.label == '其他金融产品'"
                    v-model="item.value"
                    placeholder="请选择"
                    style="width: 200px;"
                    @change="onInvestmentExpChange"
                  >
                    <a-select-option v-for="_option in item.options" :key="_option.label" :value="_option.value">
                      {{ _option.text }}
                    </a-select-option>
                  </a-select>
                  <a-select v-else v-model="item.value" placeholder="请选择" style="width: 200px;">
                    <a-select-option v-for="_option in item.options" :key="_option.label" :value="_option.value">
                      {{ _option.text }}
                    </a-select-option>
                  </a-select>
                  <a-input v-model="item.inputValue" v-if="item.showInput" style="margin-left: 20px; width: 200px;" :placeholder="item.placeholder" />
                </a-form-model-item>
              </dd>
            </dl>
          </div>

          <div class="section-area section-fourth" v-if="form.financialSituation.length">
            <div class="survery-type">财务状况</div>
            <dl v-for="(item, index) in form.financialSituation" :key="index">
              <template v-if="item.type == 'select'">
                <!-- <dt>{{ item.label }}</dt> -->
                <dd>
                  <a-form-model-item required :prop="'financialSituation[' + index + ']'" :rules="[{ validator: selectValidate, trigger: 'change' }]">
                    <span slot="label">{{ item.label }}</span>
                    <a-select v-model="item.value" placeholder="请选择" style="width: 200px;">
                      <a-select-option v-for="_option in item.options" :key="_option.label" :value="_option.value">
                        {{ _option.text }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </dd>
              </template>

              <template v-else-if="item.type == 'inputCheckbox'">
                <!-- <dt>{{ item.label }}</dt> -->
                <dd>
                  <a-form-model-item required :prop="'financialSituation[' + index + ']'" :rules="[{ validator: checkValidate, trigger: 'change' }]">
                    <span slot="label">{{ item.label }}</span>
                    <a-checkbox-group v-model="item.value" @change="onMoneyChange">
                      <dd v-for="(_item, _index) in item.options" :key="_index" class="money-from">
                        <a-checkbox :value="_item.value" name="money_from"> {{ _item.text }}</a-checkbox>
                        <a-input
                          v-model="_item.inputValue"
                          v-if="_item.isChecked"
                          style="margin-left: 20px; width: 200px;"
                          :placeholder="_item.placeholder"
                        />
                      </dd>
                    </a-checkbox-group>
                  </a-form-model-item>
                </dd>
              </template>

              <template v-else-if="item.type == 'multiSelect'">
                <!-- <dt>{{ item.label }}</dt> -->
                <dd>
                  <a-form-model-item required :prop="'financialSituation[' + index + ']'" :rules="[{ validator: radioValidate, trigger: 'change' }]">
                    <span slot="label">{{ item.label }}</span>
                    <a-radio-group v-model="item.value" @change="onResidentialChange">
                      <dd class="multiselect-group" v-for="(_item, _index) in item.options" :key="_index">
                        <a-radio :value="_item.value" name="residential"> {{ _item.text }}</a-radio>
                        <div class="option-wrapper">
                          <a-radio-group v-model="_item.children.value">
                            <div class="child-option" v-for="childOption in _item.children.options" :key="childOption.label">
                              <a-radio :value="childOption.value" :name="'residential_' + childOption.value">
                                <span>{{ childOption.label }}</span>
                              </a-radio>
                            </div>
                          </a-radio-group>
                        </div>
                      </dd>
                    </a-radio-group>
                  </a-form-model-item>
                </dd>
              </template>
            </dl>
          </div>
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
import { Modal, FormModel, Radio, Input, Select, Checkbox, Button } from 'ant-design-vue'
import { survery } from '@/utils/question'
import { mapState, mapMutations } from 'vuex'
import _ from 'lodash'

export default {
  components: {
    [Modal.name]: Modal,
    [FormModel.name]: FormModel,
    [FormModel.Item.name]: FormModel.Item,
    [Radio.name]: Radio,
    [Radio.Group.name]: Radio.Group,
    [Input.name]: Input,
    [Select.name]: Select,
    [Select.Option.name]: Select.Option,
    [Checkbox.Group.name]: Checkbox.Group,
    [Button.name]: Button
  },
  data() {
    return {
      form: {
        investTarget: {},
        derivative: {},
        investmentExp: {},
        financialSituation: {}
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
    surveyUid: state => state.openAccount.surveyUid
  }),
  created() {
    this.getAnswer()
  },
  methods: {
    ...mapMutations('openAccount', ['SET_UID']),
    async getAnswer() {
      let params = { type: 1 }

      if (this.surveyUid) {
        params.uuid = this.surveyUid
      } else if (this.userId) {
        params.uuid = this.userId
      }

      let surveyContent = {}
      if (this.surveyUid || this.userId) {
        surveyContent = await this.$apis.get_info_extend(params)
      }

      const _survey = Object.keys(surveyContent).length && !surveyContent.data ? surveyContent : survery
      this.form.investTarget = _.cloneDeep(_survey.investTarget)

      // 投资目标多语言转为中文
      this.form.investTarget.forEach((item, index) => {
        this.form.investTarget[index].title = survery.investTarget[index].title
        this.objMerge(this.form.investTarget[index].options, survery.investTarget[index].options)
      })

      this.form.derivative = _.cloneDeep(survery.derivative)

      // 修改时衍生品答案回选
      if (surveyContent.derivative) {
        this.form.derivative[0].value = surveyContent.derivative.t0.value
        this.form.derivative[0].options[0].children[0].value = surveyContent.derivative.t0.children.t0
        this.form.derivative[0].options[0].children[1].value = surveyContent.derivative.t0.children.t1
        this.form.derivative[0].options[0].children[2].value = surveyContent.derivative.t0.children.t2
      }

      this.form.investmentExp = _.cloneDeep(_survey.investmentExp)

      // 投资经验多语言转为中文
      this.form.investmentExp.forEach((item, index) => {
        this.form.investmentExp[index] = Object.assign(item, survery.investmentExp[index])
      })

      this.form.financialSituation = _.cloneDeep(_survey.financialSituation)

      // 财务状况多语言转为中文
      this.form.financialSituation.forEach((item, index) => {
        this.form.financialSituation[index].label = survery.financialSituation[index].label
        this.form.financialSituation[index].options.forEach((_item, _index) => {
          const targetList = this.form.financialSituation[index].options[_index]
          targetList.text = survery.financialSituation[index].options[_index].text
        })
      })
      this.form.financialSituation[4].options.forEach((_item, _index) => {
        const targetList = this.form.financialSituation[4].options[_index]
        targetList.children.options.forEach((__item, __index) => {
          targetList.children.options[__index] = Object.assign(__item, survery.financialSituation[4].options[_index].children.options[__index])
        })
      })
    },

    objMerge(newObj, defaultObj) {
      if (Array.isArray(newObj)) {
        newObj.forEach((item, index) => {
          this.objMerge(newObj[index], defaultObj[index])
        })
      } else {
        newObj = Object.assign(newObj, defaultObj)
      }
    },

    // 多选框验证不为空
    checkValidate(rule, value, callback) {
      const _value = value.value
      if (_value == undefined || !_value.length) {
        callback('请选择！')
      }
      callback()
    },

    // 单选框验证不为空
    radioValidate(rule, value, callback) {
      const _value = value.value
      if (_value == undefined || _value === '') {
        callback('请选择！')
      }
      callback()
    },

    // 下拉选择框验证不为空
    selectValidate(rule, value, callback) {
      const _value = value.value
      if (_value == undefined || _value === '') {
        callback('请选择！')
      }
      callback()
    },

    // 投资目标选择其他
    onInvestTargetChange(val) {
      if (val.includes(5)) {
        this.form.investTarget[0].options[4].isChecked = true
      } else {
        this.form.investTarget[0].options[4].isChecked = false
        this.form.investTarget[0].options[4].inputValue = ''
      }
    },

    // 衍生品选择不了解
    onDerivativeChange(e) {
      if (e.target.value == 1) {
        this.form.derivative[0].options[0].children[0].value = []
        this.form.derivative[0].options[0].children[1].value = []
        this.form.derivative[0].options[0].children[2].value = ''
      }
    },

    // 选择其他金融产品
    onInvestmentExpChange(val) {
      if (val != 1) {
        this.form.investmentExp[6].showInput = true
      } else {
        this.form.investmentExp[6].showInput = false
        this.form.investmentExp[6].inputValue = ''
      }
    },

    // 资金来源选择其他
    onMoneyChange(val) {
      if (val.includes(6)) {
        this.form.financialSituation[3].options[5].isChecked = true
      } else {
        this.form.financialSituation[3].options[5].isChecked = false
        this.form.financialSituation[3].options[5].inputValue = ''
      }
    },

    // 住宅产业切换
    onResidentialChange(e) {
      if (e.target.value == 1) {
        this.form.financialSituation[4].options[0].children.value = 1
        this.form.financialSituation[4].options[1].children.value = ''
      } else {
        this.form.financialSituation[4].options[0].children.value = ''
        this.form.financialSituation[4].options[1].children.value = 1
      }
    },

    // 提交
    handleSubmit() {
      this.$refs.surveyForm.validate(valid => {
        if (valid) {
          // console.log(this.form)
          const special_investTarget = this.form.investTarget[0].options[4]
          const special_investmentExp = this.form.investmentExp[6]
          const special_financialSituation = this.form.financialSituation[3].options[5]

          // 选择其他时判断输入框是否填写
          if (special_investTarget.isChecked && !special_investTarget.inputValue) {
            this.$message.warning(special_investTarget.placeholder)
            return
          } else if (special_investmentExp.showInput && !special_investmentExp.inputValue) {
            this.$message.warning(special_investmentExp.placeholder)
            return
          } else if (special_financialSituation.isChecked && !special_financialSituation.inputValue) {
            this.$message.warning(special_financialSituation.placeholder)
            return
          }

          if (this.form.derivative[0].value == 0) {
            const _firstVal = this.form.derivative[0].options[0].children[0].value
            const _sectVal = this.form.derivative[0].options[0].children[1].value
            const _thirdVal = this.form.derivative[0].options[0].children[2].value

            const firstEmpty = !(_firstVal && _firstVal.length)
            const secEmpty = !(_sectVal && _sectVal.length)
            const thirdEmpty = _thirdVal === '' || _thirdVal === undefined

            if (firstEmpty && secEmpty && thirdEmpty) {
              // 衍生品的认知未全部勾选
              this.$message.warning('请完善对衍生品的认知！')
              return
            }
          } else {
            // 客户衍生品性质和风险选择“不了解”时，不提供开户
            this.$message.warning('您对期货的认知有限，无法开户！建议您先了解期货知识。')
            return
          }

          const originalDerivative = this.form.derivative[0]
          this.form.derivative = {
            t0: {
              value: originalDerivative.value,
              children: {
                t0: originalDerivative.options[0].children[0].value,
                t1: originalDerivative.options[0].children[1].value,
                t2: originalDerivative.options[0].children[2].value
              }
            }
          }

          this.loading = true
          this.$apis
            .save_examine({ examine_list: this.form })
            .then(res => {
              this.$message.success('提交成功')
              this.$emit('update:visible', false)
              this['SET_UID']({ type: 'survey', uid: res.uuid })
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

.field-content {
  margin-top: 80px;
  .survery-type {
    position: relative;
    margin: 10px 0 20px 0;
    padding-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #e5e5e5;
  }

  .section-area {
    margin-top: 20px;
    padding-bottom: 20px;
  }

  .section-one {
    dd {
      line-height: 32px;
    }
  }
  .money-from {
    line-height: 32px;
  }

  .section-two {
    dl {
      padding-left: 20px;
    }
    .mb-10 {
      margin-bottom: 10px;
    }
    .f-16 {
      font-size: 16px;
    }
  }

  // .section-three,
  // .section-fourth {
  //   dt {
  //     float: left;
  //     width: 220px;
  //   }
  // }

  .section-fourth {
    .multiselect-group {
      float: none;
      &:nth-of-type(n + 2) {
        margin-top: 20px;
      }
    }
    .option-wrapper {
      display: flex;
      .child-option {
        display: inline-block;
        margin: 20px 0 0 25px;
        width: 110px;
      }
    }
  }

  dl {
    overflow: hidden;
    dt {
      margin-bottom: 10px;
      font-size: 16px;
      color: #444;
    }
    dd {
      float: left;
      margin: 0 20px 0 0;
      padding-left: 0;
      .ant-row {
        display: flex;
        align-items: flex-start;
        /deep/.ant-form-item-label {
          width: 220px;
          text-align: left;
        }
        /deep/.ant-radio-wrapper {
          margin: 10px 10px 0;
        }
      }
    }
  }
}
/deep/.ant-form-item {
  margin-bottom: 0;
}
/deep/.ant-form-explain {
  padding-left: 0;
}
/deep/.ant-form-item-required {
  font-size: 16px;
}
/deep/.ant-form-item-label > label::after {
  content: '';
}
</style>
