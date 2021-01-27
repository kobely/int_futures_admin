<template>
  <div>
    <p class="open-account-section-title">用户地址</p>
    <a-row>
      <a-col :span="12">
        <a-form-model-item
          label="国家/地区"
          prop="user_address.address.country_id"
          :rules="[{ required: true, message: '请选择用户的国家/地区！', trigger: 'change' }]"
        >
          <a-select v-model="form.user_address.address.country_id" :getPopupContainer="triggerNode => triggerNode.parentNode" placeholder="请选择">
            <a-select-option :value="item.code" v-for="item in countryCode" :key="item.code">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="详细地址（中文）">
          <a-input v-model="form.user_address.address.detail_address" :max-length="40" placeholder="请输入" />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="地址归属">
          <a-cascader
            v-model="user_address"
            :options="addressList"
            :field-names="{ label: 'district_name', value: 'area_code', children: 'children' }"
            :allowClear="false"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            placeholder="请选择"
            @change="handleAddressChange"
          />
        </a-form-model-item>
      </a-col>
      <a-col :span="13"></a-col>
      <a-col :span="12">
        <a-form-model-item label="上传地址证明">
          <image-upload :file-list.sync="fileList" @fieldUrlChange="setFieldUrl"></image-upload>
          <p>地址证明文件（jpg、PDF）</p>
          <!-- <a-input type="hidden" v-model="form.user_address.address_img" /> -->
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { FormModel, Row, Col, Input, Select, Cascader } from 'ant-design-vue'
import ImageUpload from '@/components/imageUpload'
import { getOssImageName } from '@/utils/util'

export default {
  components: {
    ImageUpload,
    [FormModel.Item.name]: FormModel.Item,
    [Row.name]: Row,
    [Col.name]: Col,
    [Input.name]: Input,
    [Select.name]: Select,
    [Select.Option.name]: Select.Option,
    [Cascader.name]: Cascader
  },
  props: ['form', 'addressList'],
  data() {
    return {
      countryCode: [
        {
          name: '中国内地',
          code: '1'
        },
        {
          name: '中国香港',
          code: '2'
        }
      ],
      user_address: undefined,
      fileList: []
    }
  },
  watch: {
    'form.user_address.address'(addressInfo) {
      if (Object.keys(addressInfo).length && this.user_address == undefined) {
        const { province_code, city_code, country_code } = addressInfo
        if (province_code) {
          this.user_address = [province_code, city_code, country_code]
        }
      }
    },
    'form.user_address.address_img_info'(imgOjb) {
      if (imgOjb.url && !this.fileList.length) {
        this.fileList.push({
          uid: -1,
          name: getOssImageName(imgOjb.url),
          status: 'done',
          url: imgOjb.url
        })
        this.form.user_address.address_img = imgOjb.content
      }
    }
  },
  methods: {
    // 获取上传后url
    setFieldUrl(url) {
      this.form.user_address.address_img = url
    },

    // 监听地址归属变化
    handleAddressChange(value, selectedOptions) {
      const addressInfo = {
        province_code: value[0],
        city_code: value[1],
        country_code: value[2],
        province_name: selectedOptions[0].district_name,
        city_name: selectedOptions[1].district_name,
        country_name: selectedOptions[2].district_name
      }
      this.form.user_address.address = Object.assign(this.form.user_address.address, addressInfo)
    }
  }
}
</script>

<style lang="less" scoped></style>
