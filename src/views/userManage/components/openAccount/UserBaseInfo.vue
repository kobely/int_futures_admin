<template>
  <div>
    <p class="open-account-section-title">用户基本信息</p>
    <a-row>
      <a-col :span="12">
        <a-form-model-item
          label="用户中文名"
          prop="user_base_info.real_name"
          :rules="[{ required: true, message: '请输入用户中文名！', trigger: 'blur' }]"
        >
          <a-input v-model="form.user_base_info.real_name" :max-length="40" :disabled="canEdit" placeholder="请输入" />
        </a-form-model-item>
        <div class="flex-center">
          <a-form-model-item
            label="手机号"
            class="front-input-wrapper"
            prop="user_base_info.zone_code"
            :rules="[{ required: true, message: '请选择区号！', trigger: 'change' }]"
          >
            <a-select
              v-model="form.user_base_info.zone_code"
              :getPopupContainer="triggerNode => triggerNode.parentNode"
              :disabled="canEdit"
              placeholder="地区号"
              style="width: 120px;"
            >
              <a-select-option value="86">中国+86</a-select-option>
              <a-select-option value="852">香港+852</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            class="end-input-wrapper"
            prop="user_base_info.phone"
            :rules="[{ required: true, message: '请输入手机号！', trigger: 'blur' }]"
          >
            <a-input v-model="form.user_base_info.phone" :max-length="11" :disabled="canEdit" placeholder="请输入" style="width: 225px" />
          </a-form-model-item>
        </div>
        <a-form-model-item label="性别">
          <a-radio-group v-model="form.user_base_info.sex">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="2">女</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="出生日期">
          <a-date-picker v-model="birthDate" type="date" placeholder="请选择" style="width: 100%;" @change="handleDateChange" />
        </a-form-model-item>
        <a-form-model-item label="身份核验结果" v-if="userId">
          <span>{{ VERIFY_STATUS[form.user_base_info.is_verify] }}</span>
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item
          label="用户英文名"
          prop="user_base_info.english_name"
          :rules="[
            { required: true, message: '请输入用户英文名！', trigger: 'blur' },
            { validator: enValidate, trigger: 'blur' }
          ]"
        >
          <a-input
            v-model="form.user_base_info.english_name"
            :max-length="40"
            :disabled="canEdit"
            placeholder="请输入"
            @change="handleEngNameChange"
          />
        </a-form-model-item>
        <a-form-model-item
          label="邮箱"
          prop="user_base_info.email"
          :rules="[
            { required: true, message: '请输入邮箱！', trigger: 'blur' },
            { validator: emailValidate, trigger: 'blur' }
          ]"
        >
          <a-input v-model="form.user_base_info.email" :max-length="40" :disabled="canEdit" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item
          label="国籍"
          prop="user_base_info.nationality_code"
          :rules="[{ required: true, message: '请选择国籍！', trigger: 'change' }]"
        >
          <a-select
            v-model="form.user_base_info.nationality_code"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            :disabled="canEdit"
            :showSearch="true"
            optionFilterProp="children"
            placeholder="请选择"
            @change="handleCountryChange"
          >
            <a-select-option :value="item.id + ''" v-for="item in countryList" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="证件号码" prop="user_base_info.id_card" :rules="[{ required: true, message: '请输入证件号码！', trigger: 'blur' }]">
          <a-input v-model="form.user_base_info.id_card" :max-length="40" :disabled="canEdit" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="身份核验方式" v-if="userId">
          <span>{{ VERIFY_TYPE[form.user_base_info.verify_action - 1] }}</span>
        </a-form-model-item>
      </a-col>
      <a-col :span="13"></a-col>
      <a-col :span="12">
        <a-form-model-item label="上传身份证件">
          <div class="card-images-wrapper">
            <div class="mr-10">
              <image-upload :file-list.sync="fileList_positive" :can-edit="canEdit" @fieldUrlChange="setPositiveFieldUrl"></image-upload>
              <p>身份证明头像面</p>
            </div>
            <div class="mr-10">
              <image-upload :file-list.sync="fileList_inverse" :can-edit="canEdit" @fieldUrlChange="setInverseFieldUrl"></image-upload>
              <p>身份证明国徽面</p>
            </div>
            <div>
              <image-upload :file-list.sync="fileList_video" :can-edit="canEdit" @fieldUrlChange="setVideoFieldUrl"></image-upload>
              <p>身份证明录像</p>
            </div>
          </div>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { FormModel, Row, Col, Input, Select, Radio, DatePicker } from 'ant-design-vue'
import ImageUpload from '@/components/imageUpload'
import { getOssImageName } from '@/utils/util'
import { VERIFY_TYPE, VERIFY_STATUS } from '@/utils/const'
import { isEmail } from '@/utils/verify'
import moment from 'moment'

export default {
  components: {
    ImageUpload,
    [FormModel.Item.name]: FormModel.Item,
    [Row.name]: Row,
    [Col.name]: Col,
    [Input.name]: Input,
    [Select.name]: Select,
    [Select.Option.name]: Select.Option,
    [Radio.name]: Radio,
    [Radio.Group.name]: Radio.Group,
    [DatePicker.name]: DatePicker
  },
  props: ['form', 'userId', 'countryList'],
  data() {
    return {
      VERIFY_TYPE,
      VERIFY_STATUS,
      birthDate: undefined,
      fileList_positive: [],
      fileList_inverse: [],
      fileList_video: []
    }
  },
  computed: {
    canEdit() {
      const canEdit = !!this.userId && this.form.user_base_info.is_verify == 2
      return canEdit
    }
  },
  watch: {
    'form.user_base_info.birth'(date) {
      if (date && this.birthDate == undefined) {
        this.birthDate = moment(date, 'YYYY-MM-DD')
      }
    },
    'form.user_base_info.positive_img_info'(imgOjb) {
      if (imgOjb.url && !this.fileList_positive.length) {
        this.fileList_positive.push({
          uid: -1,
          name: getOssImageName(imgOjb.url),
          status: 'done',
          url: imgOjb.url
        })
        this.form.user_base_info.positive_img = imgOjb.content
      }
    },
    'form.user_base_info.inverse_img_info'(imgOjb) {
      if (imgOjb.url && !this.fileList_inverse.length) {
        this.fileList_inverse.push({
          uid: -1,
          name: getOssImageName(imgOjb.url),
          status: 'done',
          url: imgOjb.url
        })
        this.form.user_base_info.inverse_img = imgOjb.content
      }
    },
    'form.user_base_info.video_url_info'(videoObj) {
      if (videoObj.url && !this.fileList_video.length) {
        this.fileList_video.push({
          uid: -1,
          name: getOssImageName(videoObj.url),
          status: 'done',
          url: videoObj.url
        })
        this.form.user_base_info.video_url = videoObj.content
      }
    }
  },
  methods: {
    // 邮箱验证
    emailValidate(rule, value, callback) {
      if (!isEmail(value)) {
        callback('请输入正确的邮箱!')
      }
      callback()
    },

    // 英文验证
    enValidate(rule, value, callback) {
      if (/[\u4e00-\u9fa5]/.test(value) || !/[a-zA-Z]/.test(value)) {
        callback('请输入英文！')
      }
      callback()
    },

    // 设置纳税人姓名与英文名一致
    handleEngNameChange(e) {
      this.form.w_ben_content.tax_name = e.target.value
    },

    // 监听出生日期变化
    handleDateChange(date) {
      if (date) {
        this.form.user_base_info.birth = date.format('YYYY-MM-DD')
      } else {
        this.form.user_base_info.birth = null
      }
    },

    // 国籍选择获取国家名
    handleCountryChange(id) {
      const targetInfo = this.countryList.filter(country => country.id == id)[0]
      this.form.user_base_info.nationality_name = targetInfo.name
    },

    // 获取身份证正面上传后url
    setPositiveFieldUrl(url) {
      this.form.user_base_info.positive_img = url
    },

    // 获取身份证反面上传后url
    setInverseFieldUrl(url) {
      this.form.user_base_info.inverse_img = url
    },

    // 获取身份证明上传后url
    setVideoFieldUrl(url) {
      this.form.user_base_info.video_url = url
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../../../style/init.less');

.front-input-wrapper {
  /deep/ .ant-form-item-label {
    min-width: 65px;
    text-align: left;
  }
  /deep/ .ant-form-item-control-wrapper {
    width: 120px;
    text-align: left;
  }
}
.end-input-wrapper {
  width: 200px !important;
  /deep/ .ant-form-item-control-wrapper {
    width: 100%;
  }
}
.card-images-wrapper {
  display: flex;
}
</style>
