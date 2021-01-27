<template>
  <div class="education-career-page">
    <div class="about-info">
      <span class="title">教育和职业情况</span>
    </div>
    <div class="survery-content" v-if="Object.keys(userInfo).length">
      <dl class="flex" v-if="userInfo.education">
        <dt>{{ EDC_WORK_LIST[0].label }}</dt>
        <dd>
          <a-select :default-value="userInfo.education" style="width: 200px;" disabled>
            <a-select-option v-for="(_option, _index) in EDC_WORK_LIST[0].options" :key="_index" :value="_option.value">
              {{ _option.text }}
            </a-select-option>
          </a-select>
        </dd>
      </dl>
      <dl class="flex">
        <dt>{{ EDC_WORK_LIST[1].label }}</dt>
        <dd>
          <a-select :default-value="userInfo.job_type" style="width: 200px;" disabled>
            <a-select-option v-for="(_option, _index) in EDC_WORK_LIST[1].options" :key="_index" :value="_option.value">
              {{ _option.text }}
            </a-select-option>
          </a-select>
        </dd>
      </dl>
      <dl class="flex" v-if="userInfo.job_type == 5">
        <dt>其他</dt>
        <dd>
          <a-input :default-value="userInfo.job_type_other_describe" style="width: 200px;" disabled />
        </dd>
      </dl>
      <dl class="flex" v-if="userInfo.company">
        <dt>雇主名称</dt>
        <dd><a-input :value="userInfo.company" disabled style="width: 200px;" /></dd>
      </dl>
      <dl class="flex" v-if="userInfo.vocation_attribute">
        <dt>职业属性</dt>
        <dd><a-input :value="userInfo.vocation_attribute" disabled style="width: 200px;" /></dd>
      </dl>
      <dl class="flex" v-if="userInfo.vocation">
        <dt>职位</dt>
        <dd><a-input :value="userInfo.vocation" disabled style="width: 200px;" /></dd>
      </dl>
      <dl class="flex" v-if="userInfo.job_age">
        <dt>受雇年限</dt>
        <dd>
          <a-select :default-value="userInfo.job_age" style="width: 200px;" disabled>
            <a-select-option :value="index + 1" :key="index" v-for="(item, index) in JOB_AGE">{{ item }}</a-select-option>
          </a-select>
        </dd>
      </dl>
      <dl class="flex" v-if="userInfo.company_phone">
        <dt>公司/机构电话</dt>
        <dd><a-input :value="userInfo.company_phone" disabled style="width: 200px;" /></dd>
      </dl>
      <dl class="flex" v-if="userInfo.company_address">
        <dt>公司/机构地址</dt>
        <dd><a-input :value="userInfo.company_address" disabled style="width: 200px;" /></dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { Input, Select } from 'ant-design-vue'
import { JOB_AGE, EDC_WORK_LIST } from '@/utils/const'

export default {
  components: {
    [Input.name]: Input,
    [Select.name]: Select,
    [Select.Option.name]: Select.Option
  },
  data() {
    return {
      JOB_AGE,
      EDC_WORK_LIST,
      userInfo: {}
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
          this.userInfo = res
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.education-career-page {
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
  margin-top: 10px;
  dl {
    overflow: hidden;
    padding-left: 20px;
    &.flex {
      display: flex;
      dt {
        width: 150px;
        font-size: 16px;
      }
    }
  }
}
</style>
