<template>
  <div class="survery-page">
    <div class="about-info">
      <span class="title">适当性调查</span>
    </div>
    <div class="survery-content">
      <template v-if="version == '1.0'">
        <div v-for="surveryOption in surveryList" :key="surveryOption.label">
          <div class="survery-type">{{ surveryOption.label }}</div>
          <dl v-for="(item, index) in surveryOption.list" :key="index">
            <dt>{{ index + 1 }}、{{ item.label }}</dt>
            <dd
              v-for="(_item, _index) in item.options"
              :key="_index"
              :class="{
                checked: _item.value == item.value || (item.value.length && item.value.includes(_item.text))
              }"
            >
              {{ _item.text }}
            </dd>
          </dl>
        </div>
      </template>
      <template v-else-if="version == '1.1'">
        <div class="section-area section-one" v-if="investTarget.list && investTarget.list.length">
          <div class="survery-type">{{ investTarget.sectionName }}</div>
          <dl v-for="(item, index) in investTarget.list" :key="index">
            <dt>{{ item.title }}</dt>
            <dd
              v-for="(_item, _index) in item.options"
              :key="_index"
              :class="{
                checked: _item.value == item.value || (item.value.length && item.value.includes(_item.value))
              }"
            >
              <a-checkbox :checked="item.value.includes(_item.value)" disabled />
              {{ _item.label }}
              <a-input :value="item.inputValue" disabled style="margin-left: 20px; width: 200px;" v-if="_item.needInput && item.inputValue" />
              <a-input :value="_item.inputValue" disabled style="margin-left: 20px; width: 200px;" v-if="_item.isChecked && _item.inputValue" />
            </dd>
          </dl>
        </div>
        <div class="section-area section-two" v-if="derivative.list && derivative.list[0].options.length">
          <div class="survery-type">{{ derivative.sectionName }}</div>
          <div v-for="(item, index) in derivative.list[0].options" :key="index">
            <p class="mb-10 f-16"><a-radio :checked="item.name == derivative.list[0].value" disabled />{{ item.label }}</p>
            <dl v-for="(_item, _index) in item.children" :key="_index">
              <dt>{{ _item.label }}</dt>
              <dd
                v-for="_option in _item.options"
                :key="_option.label"
                :class="{
                  checked: _item.value && _item.value.length > 1 ? _item.value.includes(_option.name) : _item.value === _option.name
                }"
              >
                <a-checkbox
                  :checked="_item.value && _item.value.length > 1 ? _item.value.includes(_option.name) : _item.value === _option.name"
                  disabled
                />
                {{ _option.label }}
              </dd>
            </dl>
          </div>
        </div>
        <div class="section-area section-three" v-if="investmentExp.list && investmentExp.list.length">
          <div class="survery-type">{{ investmentExp.sectionName }}</div>
          <dl v-for="(item, index) in investmentExp.list" :key="index">
            <dt>{{ item.label }}</dt>
            <dd>
              <a-select :default-value="item.value" style="width: 200px;" disabled>
                <a-select-option v-for="_option in item.options" :key="_option.label" :value="_option.value">
                  {{ _option.text }}
                </a-select-option>
              </a-select>
              <a-input :value="item.inputValue" disabled style="margin-left: 20px; width: 200px;" v-if="item.inputValue" />
            </dd>
          </dl>
        </div>
        <div class="section-area section-fourth" v-if="financialSituation.list && financialSituation.list.length">
          <div class="survery-type">{{ financialSituation.sectionName }}</div>
          <dl v-for="(item, index) in financialSituation.list" :key="index">
            <template v-if="item.type == 'select'">
              <dt>{{ item.label }}</dt>
              <dd>
                <a-select :default-value="item.value" style="width: 200px;" disabled>
                  <a-select-option v-for="_option in item.options" :key="_option.label" :value="_option.value">
                    {{ _option.text }}
                  </a-select-option>
                </a-select>
                <a-input :value="item.inputValue" disabled style="margin-left: 20px; width: 200px;" v-if="item.inputValue" />
              </dd>
            </template>

            <template v-else-if="item.type == 'inputCheckbox'">
              <dt>{{ item.label }}</dt>
              <dd
                v-for="(_item, _index) in item.options"
                :key="_index"
                :class="{
                  checked: item.value.includes(_item.value)
                }"
                class="money-from"
              >
                <a-checkbox :checked="item.value.includes(_item.value)" disabled /> {{ _item.text }}
                <a-input :value="item.inputValue" disabled style="margin-left: 20px; width: 200px;" v-if="_item.needInput && item.inputValue" />
                <a-input :value="_item.inputValue" disabled style="margin-left: 20px; width: 200px;" v-if="_item.isChecked && _item.inputValue" />
              </dd>
            </template>

            <template v-else-if="item.type == 'multiSelect'">
              <dt>{{ item.label }}</dt>
              <dd class="multiselect-group" v-for="(_item, _index) in item.options" :key="_index">
                <a-radio :checked="_item.value == item.value" disabled /> {{ _item.text }}
                <div class="option-wrapper">
                  <div class="child-option" v-for="childOption in _item.children.options" :key="childOption.label">
                    <a-radio :checked="childOption.value == _item.children.value" disabled />
                    <span :class="{ checked: childOption.value == _item.children.value }">{{ childOption.label }}</span>
                  </div>
                </div>
              </dd>
            </template>
          </dl>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Input, Radio, Select } from 'ant-design-vue'
import { survery } from '@/utils/question'

export default {
  components: {
    [Input.name]: Input,
    [Radio.name]: Radio,
    [Select.name]: Select,
    [Select.Option.name]: Select.Option
  },
  data() {
    return {
      surveryList: [],
      investTarget: {},
      derivative: {},
      investmentExp: {},
      financialSituation: {},
      version: ''
    }
  },
  mounted() {
    this.getExtendDetail()
  },
  methods: {
    getExtendDetail() {
      this.$apis
        .get_account_extend({ id: this.$route.query.id })
        .then(res => {
          const infoExtend = res.info_extend
          this.version = infoExtend.version
          const examine_list = infoExtend.examine_list ? infoExtend.examine_list : {}

          if (!Object.keys(examine_list).length) return

          if (this.version == '1.0') {
            const { financeList, investmentList, derivativeList } = examine_list

            this.surveryList = [
              {
                label: '个人财务状况',
                list: [...financeList]
              },
              {
                label: '投资经验',
                list: [...investmentList]
              },
              {
                label: '衍生品投资经验',
                list: [...derivativeList]
              }
            ]
          } else {
            const { derivative, financialSituation, investTarget, investmentExp } = examine_list

            investTarget.forEach((item, index) => {
              investTarget[index].title = survery.investTarget[index].title
              this.objMerge(investTarget[index].options, survery.investTarget[index].options)
            })

            this.investTarget = {
              sectionName: '投资目标',
              list: investTarget
            }

            // 获取的答案赋值给列表，方便渲染
            survery.derivative[0].value = derivative.t0.value
            survery.derivative[0].options[0].children[0].value = derivative.t0.children.t0
            survery.derivative[0].options[0].children[1].value = derivative.t0.children.t1
            survery.derivative[0].options[0].children[2].value = derivative.t0.children.t2

            this.derivative = {
              sectionName: '对衍生品的认知',
              list: survery.derivative
            }

            investmentExp.forEach((item, index) => {
              investmentExp[index] = Object.assign(item, survery.investmentExp[index])
            })

            this.investmentExp = {
              sectionName: '投资经验',
              list: investmentExp
            }

            financialSituation.forEach((item, index) => {
              financialSituation[index].label = survery.financialSituation[index].label
              financialSituation[index].options.forEach((_item, _index) => {
                const targetList = financialSituation[index].options[_index]
                targetList.text = survery.financialSituation[index].options[_index].text
              })
            })
            financialSituation[4].options.forEach((_item, _index) => {
              const targetList = financialSituation[4].options[_index]
              targetList.children.options.forEach((__item, __index) => {
                targetList.children.options[__index] = Object.assign(__item, survery.financialSituation[4].options[_index].children.options[__index])
              })
            })

            this.financialSituation = {
              sectionName: '财务状况',
              list: financialSituation
            }
          }
        })
        .catch(err => {
          console.log(err)
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
    }
  }
}
</script>

<style lang="less" scoped>
.survery-page {
  margin-top: 71px;
}
.about-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  width: 100%;
  height: 70px;
  padding: 0 30px;
  background-color: #fff;
  border-bottom: 10px solid #f0f2f5;
  .title {
    font-size: 22px;
  }
}
.survery-content {
  padding-left: 20px;
  .survery-type {
    position: relative;
    margin: 10px 0 20px 0;
    padding-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #a5a5a5;
  }

  .section-area {
    // width: 50%;
    margin-top: 20px;
    padding: 20px;
    background-color: #f0f2f5;
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

  .section-three,
  .section-fourth {
    dt {
      float: left;
      width: 250px;
    }
  }

  .section-fourth {
    .multiselect-group {
      float: none;
      padding-left: 275px;
      &:nth-of-type(n + 2) {
        margin-top: 20px;
      }
    }
    .option-wrapper {
      display: flex;
      .child-option {
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
      margin-right: 30px;
      padding-left: 25px;
      .checked,
      &.checked {
        color: #1890ff;
      }
    }
  }
}
</style>
