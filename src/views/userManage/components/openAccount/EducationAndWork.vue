<template>
  <div>
    <p class="open-account-section-title">教育/就业情况</p>
    <a-row>
      <a-col :span="12">
        <a-form-model-item label="教育情况">
          <a-select v-model="form.education_job_info.education" :getPopupContainer="triggerNode => triggerNode.parentNode" placeholder="请选择">
            <a-select-option :value="edu.value" v-for="(edu, index) in EDC_WORK_LIST[0].options" :key="index">{{ edu.text }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="就业情况">
          <a-select
            v-model="form.education_job_info.job_type"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            placeholder="请选择"
            @change="handleJobTypeChange"
          >
            <a-select-option :value="job.value" v-for="(job, index) in EDC_WORK_LIST[1].options" :key="index">{{ job.text }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="职业属性" v-show="[1, 2].includes(jobType)">
          <a-input v-model="form.education_job_info.vocation_attribute" :max-length="40" placeholder="选填" />
        </a-form-model-item>
        <a-form-model-item label="受雇年限" v-show="[1, 2].includes(jobType)">
          <a-select v-model="form.education_job_info.job_age" :getPopupContainer="triggerNode => triggerNode.parentNode" placeholder="请选择">
            <a-select-option :value="index + 1" v-for="(age, index) in JOB_AGE" :key="index">{{ age }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="机构地址" v-show="[1, 2].includes(jobType)">
          <a-textarea v-model="form.education_job_info.company_address" placeholder="字数不超过100字" style="height: 75px;"></a-textarea>
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="占位" style="visibility: hidden;"></a-form-model-item>
        <a-form-model-item label="其他" v-show="jobType == 5">
          <a-input v-model="form.education_job_info.job_type_other_describe" :max-length="40" placeholder="请填写，例如：家庭主妇" />
        </a-form-model-item>
        <a-form-model-item label="雇主名称" v-show="[1, 2].includes(jobType)">
          <a-input v-model="form.education_job_info.company" :max-length="40" placeholder="选填" />
        </a-form-model-item>
        <a-form-model-item label="职位" v-show="[1, 2].includes(jobType)">
          <a-input v-model="form.education_job_info.vocation" :max-length="40" placeholder="选填" />
        </a-form-model-item>
        <a-form-model-item label="机构电话" v-show="[1, 2].includes(jobType)">
          <a-input v-model="form.education_job_info.company_phone" :max-length="40" placeholder="选填" />
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { FormModel, Row, Col, Input, Select } from 'ant-design-vue'
import { JOB_AGE, EDC_WORK_LIST } from '@/utils/const'

export default {
  components: {
    [FormModel.Item.name]: FormModel.Item,
    [Row.name]: Row,
    [Col.name]: Col,
    [Input.name]: Input,
    [Input.TextArea.name]: Input.TextArea,
    [Select.name]: Select,
    [Select.Option.name]: Select.Option
  },
  props: ['form'],
  data() {
    return {
      JOB_AGE,
      EDC_WORK_LIST,
      jobType: 1
    }
  },
  watch: {
    'form.education_job_info'(newJobInfo) {
      const education = newJobInfo.education
      const job_age = newJobInfo.job_age
      this.form.education_job_info.education = education ? education : undefined
      this.form.education_job_info.job_age = job_age ? job_age : undefined
      this.jobType = newJobInfo.job_type
    }
  },
  methods: {
    handleJobTypeChange(val) {
      this.jobType = val

      if (![1, 2].includes(val)) {
        const jobInfo = {
          vocation_attribute: '',
          job_age: undefined,
          company_address: '',
          company: '',
          vocation: '',
          company_phone: '',
          job_type_other_describe: ''
        }
        this.form.education_job_info = Object.assign(this.form.education_job_info, jobInfo)
      } else if (val != 5) {
        this.form.education_job_info.job_type_other_describe = ''
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
