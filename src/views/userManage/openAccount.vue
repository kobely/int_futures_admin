<template>
  <div class="content">
    <breadcrumb-wrapper prevUrl="/userManage/userList" prevTitle="个人用户管理列表" :currentTitle="`${userId ? '修改' : '新增'}个人用户`" />
    <a-form-model
      layout="horizontal"
      class="info-input-wrapper"
      ref="openAccountForm"
      :model="form"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
    >
      <!-- 用户基本信息 start -->
      <user-base-info :form="form" :user-id="userId" :country-list="countryList" />
      <!-- 用户基本信息 end -->

      <!-- 用户地址 start -->
      <user-address :address-list="addressList" :form="form" />
      <!-- 用户地址 end -->

      <!-- 教育/就业情况 start -->
      <education-and-work :form="form" />
      <!-- 教育/就业情况 end -->

      <!-- 用户增信资料 start -->
      <user-survey :form="form" :user-id="userId" />
      <!-- 用户增信资料 end -->

      <!-- 用户税务资料 start -->
      <tax-information :address-list="addressList" :form="form" />
      <!-- 用户税务资料 end -->

      <!-- 补充资料 start -->
      <further-material :form="form" />
      <!-- 补充资料 end -->

      <!-- 提交按钮 start -->
      <a-form-model-item :wrapper-col="{ span: 10, offset: 11 }" style="margin-top: 100px;">
        <a-button type="primary" size="large" @click="handleSubmit"> 提交{{ userId ? '修改' : '开户' }} </a-button>
      </a-form-model-item>
      <!-- 提交按钮 end -->
    </a-form-model>
  </div>
</template>

<script>
import { FormModel, Button } from 'ant-design-vue'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import UserBaseInfo from './components/openAccount/UserBaseInfo'
import UserAddress from './components/openAccount/UserAddress'
import EducationAndWork from './components/openAccount/EducationAndWork'
import UserSurvey from './components/openAccount/UserSurvey'
import TaxInformation from './components/openAccount/TaxInformation'
import FurtherMaterial from './components/openAccount/FurtherMaterial'
import { mapState, mapMutations } from 'vuex'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

export default {
  components: {
    BreadcrumbWrapper,
    UserBaseInfo,
    UserAddress,
    EducationAndWork,
    UserSurvey,
    TaxInformation,
    FurtherMaterial,
    [FormModel.name]: FormModel,
    [FormModel.Item.name]: FormModel.Item,
    [Button.name]: Button
  },
  data() {
    return {
      formItemLayout,
      addressList: [],
      countryList: [],
      userId: this.$route.params.id || '',
      form: {
        user_base_info: {
          real_name: '',
          english_name: '',
          zone_code: undefined,
          phone: '',
          email: '',
          nationality_code: undefined,
          nationality_name: '',
          id_card: '',
          birth: null,
          sex: 0
        },
        user_address: {
          address: {
            country_id: undefined,
            province_code: '',
            city_code: '',
            country_code: '',
            province_name: '',
            city_name: '',
            country_name: '',
            detail_address: ''
          }
        },
        user_add_info: {},
        education_job_info: {
          job_type: 1
        },
        user_tax_resident: {
          tax_place: {},
          tax_resident: []
        },
        w_ben_content: {
          city_code: '',
          city_name: '',
          contain_area: undefined,
          country_code: '',
          country_name: '',
          detail_address: '',
          province_code: '',
          province_name: '',
          tax_name: ''
        },
        extra_info: []
      }
    }
  },
  computed: mapState({
    surveyUid: state => state.openAccount.surveyUid,
    questionnaireUid: state => state.openAccount.questionnaireUid,
    stateUid: state => state.openAccount.stateUid
  }),
  async created() {
    this.countryList = await this.$apis.get_all_country_list()
    this.init()
  },
  destroyed() {
    this.callback()
  },
  methods: {
    ...mapMutations('openAccount', ['SET_UID']),
    async init() {
      this.addressList = await this.$apis.get_address_list()
      if (!this.userId) return
      this.getOpenAccountDetail(this.userId)
      document.title = '修改开户信息'
    },

    // 修改获取详情
    getOpenAccountDetail(id) {
      this.$apis
        .get_open_account_detail({ id: id })
        .then(res => {
          this.form = res
        })
        .catch(err => {})
    },

    // 提交成功回调
    callback(isNeed) {
      if (isNeed) {
        this.$message.success('提交成功')
        this.$router.go(-1)
      }

      this['SET_UID']({ type: 'state', uid: '' })
      this['SET_UID']({ type: 'survey', uid: '' })
      this['SET_UID']({ type: 'questionnaire', uid: '' })
    },

    // 提交
    handleSubmit() {
      this.$refs.openAccountForm.validate(valid => {
        if (valid) {
          this.form.user_add_info = {
            examine_list: this.surveyUid || this.userId,
            estimate_examine: this.questionnaireUid || this.userId,
            customer_state: this.stateUid || this.userId
          }

          if (this.userId) {
            this.form.id = this.userId
            this.$apis
              .edit_account_info(this.form)
              .then(res => {
                this.callback(true)
              })
              .catch(err => {})
          } else {
            this.$apis
              .commit_account_info(this.form)
              .then(res => {
                this.callback(true)
              })
              .catch(err => {})
          }
          // console.log(this.form)
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
.content {
  margin-top: 54px;
  padding: 20px 0 86px;
  background-color: #fff;
  .info-input-wrapper {
    margin: 0 auto;
    width: 1080px;
    padding: 0 20px;
  }
}
</style>
