<template>
  <div>
    <p class="open-account-section-title">用户税务资料</p>
    <a-row>
      <a-col :span="12">
        <a-form-model-item label="用户税务目的地">
          <a-select
            mode="multiple"
            v-model="tax_resident_hot"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            optionFilterProp="children"
            placeholder="请选择"
            @deselect="handleNormalDelete"
            @change="handleNormalChange"
          >
            <a-select-option
              v-for="hotPlace in taxPlaceList.hot"
              :key="hotPlace.id"
              :value="hotPlace.id"
              :disabled="
                (tax_resident_hot.length == 2 && !tax_resident_hot.includes(hotPlace.id)) || (tax_resident_normal.length == 2 && hotPlace.id != 0)
              "
            >
              {{ hotPlace.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="其他" v-if="tax_resident_hot.includes(0)">
          <a-select
            mode="multiple"
            v-model="tax_resident_normal"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            optionFilterProp="children"
            placeholder="请选择"
            style="width: 345px"
          >
            <a-select-option v-for="place in taxPlaceList.normal" :key="place.id" :value="place.id" :disabled="get_resident_normal_disabled(place)">
              {{ place.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item :label="form.user_tax_resident.tax_resident[0].tax_area" v-if="tax_resident_place.length > 0">
          <a-input v-model="form.user_tax_resident.tax_resident[0].tax_no" :max-length="40" placeholder="税务编号" />
        </a-form-model-item>
        <a-form-model-item :label="form.user_tax_resident.tax_resident[1].tax_area" v-if="tax_resident_place.length > 1">
          <a-input v-model="form.user_tax_resident.tax_resident[1].tax_no" :max-length="40" placeholder="税务编号" />
        </a-form-model-item>
      </a-col>
    </a-row>
    <p class="w8ben-title">用户W-8BEN资料（英文）</p>
    <a-row>
      <a-col :span="12">
        <a-form-model-item label="纳税人姓名">
          <a-input v-model="form.w_ben_content.tax_name" disabled placeholder="请输入英文" />
        </a-form-model-item>
        <a-form-model-item label="地址归属 (省市区)">
          <a-cascader
            v-model="address"
            :options="addressList"
            :field-names="{ label: 'district_name_en', value: 'area_code', children: 'children' }"
            :allowClear="false"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            placeholder="请选择"
            @change="handleAddressChange"
          />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="纳税国家/地区">
          <a-select v-model="form.w_ben_content.contain_area" :getPopupContainer="triggerNode => triggerNode.parentNode" placeholder="请选择">
            <a-select-option :value="item" v-for="item in taxBelongAddress" :key="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="详细地址 (街道楼栋)" prop="w_ben_content.detail_address" :rules="[{ validator: enValidate, trigger: 'blur' }]">
          <a-input v-model="form.w_ben_content.detail_address" placeholder="请输入英文" />
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { FormModel, Row, Col, Input, Select, Cascader } from 'ant-design-vue'
import _ from 'lodash'

export default {
  components: {
    [FormModel.Item.name]: FormModel.Item,
    [Row.name]: Row,
    [Col.name]: Col,
    [Input.name]: Input,
    [Input.TextArea.name]: Input.TextArea,
    [Select.name]: Select,
    [Select.Option.name]: Select.Option,
    [Cascader.name]: Cascader
  },
  props: ['form', 'addressList'],
  data() {
    return {
      taxBelongAddress: ['China', 'Hong Kong'],
      taxPlaceList: [],
      tax_resident_hot: [],
      tax_resident_normal: [],
      address: undefined
    }
  },
  computed: {
    tax_resident_place() {
      const tax_resident_hot = this.tax_resident_hot.filter(i => i != 0)
      const taxResidentPlaceId = [...tax_resident_hot, ...this.tax_resident_normal]

      let tax_resident = []
      taxResidentPlaceId.forEach((j, index) => {
        const tax_no =
          this.form.user_tax_resident.tax_resident.length && this.form.user_tax_resident.tax_resident.filter(i => i.tax_area_id == j).length
            ? this.form.user_tax_resident.tax_resident.filter(i => i.tax_area_id == j)[0].tax_no
            : ''

        const allPlaceList = [...this.taxPlaceList.hot, ...this.taxPlaceList.normal]
        const tax_area = allPlaceList.filter(i => i.id == j)[0].name
        tax_resident.push({ tax_area, tax_no, tax_area_id: j })
      })

      this.form.user_tax_resident.tax_resident = tax_resident
      this.form.user_tax_resident.tax_place = {
        choice: tax_resident_hot,
        extra: this.tax_resident_normal
      }

      return taxResidentPlaceId
    }
  },
  created() {
    this.getTaxPlaceList()
  },
  watch: {
    'form.w_ben_content'(wAddressInfo) {
      if (Object.keys(wAddressInfo).length && this.address == undefined) {
        const { province_code, city_code, country_code } = wAddressInfo
        if (province_code) {
          this.address = [province_code, city_code, country_code]
        }
      }
    },
    'form.user_tax_resident.tax_place'(newVal) {
      if ((newVal.choice.length || newVal.extra.length) && !this.tax_resident_hot.length) {
        this.tax_resident_hot = newVal.choice
        this.tax_resident_normal = newVal.extra

        if (this.tax_resident_hot.includes(1) && !this.tax_resident_hot.includes(2)) {
          this.taxBelongAddress = ['China']
        } else if (!this.tax_resident_hot.includes(1) && this.tax_resident_hot.includes(2)) {
          this.taxBelongAddress = ['Hong Kong']
        }

        if (newVal.extra.length) {
          this.tax_resident_hot[1] = 0
        }
      }
    }
  },
  methods: {
    async getTaxPlaceList() {
      this.taxPlaceList = await this.$apis.get_tax_place_list()
      this.taxPlaceList.hot.push({ id: 0, name: '其他' })
    },

    // 英文验证
    enValidate(rule, value, callback) {
      if (value && (/[\u4e00-\u9fa5]/.test(value) || !/[a-zA-Z]/.test(value))) {
        callback('请输入英文！')
      }
      callback()
    },

    // 其他国家是否可选
    get_resident_normal_disabled(item) {
      if (this.tax_resident_hot.length == 2) {
        if (this.tax_resident_normal.length > 0 && !this.tax_resident_normal.includes(item.id)) {
          return true
        }
      } else {
        if (this.tax_resident_normal.length == 2 && !this.tax_resident_normal.includes(item.id)) {
          return true
        }
      }
      return false
    },

    // 用户税务目的删除其他
    handleNormalDelete(val) {
      if (val == 0) {
        this.tax_resident_normal = []
      }
    },

    // 用户税务目的地监听
    handleNormalChange(hotVal) {
      if (hotVal.includes(1) && !hotVal.includes(2)) {
        this.taxBelongAddress = ['China']
        this.form.w_ben_content.contain_area = 'China'
      } else if (!hotVal.includes(1) && hotVal.includes(2)) {
        this.taxBelongAddress = ['Hong Kong']
        this.form.w_ben_content.contain_area = 'Hong Kong'
      } else {
        this.taxBelongAddress = ['China', 'Hong Kong']
      }
    },

    // 地址归属监听
    handleAddressChange(value, selectedOptions) {
      const addressInfo = {
        province_code: value[0],
        city_code: value[1],
        country_code: value[2],
        province_name: selectedOptions[0].district_name_en,
        city_name: selectedOptions[1].district_name_en,
        country_name: selectedOptions[2].district_name_en
      }
      this.form.w_ben_content = Object.assign(this.form.w_ben_content, addressInfo)
    }
  }
}
</script>

<style lang="less" scoped>
.info-item-title {
  display: inline-block;
  width: 180px;
}
.info-status {
  display: inline-block;
  width: 230px;
  color: #999;
}
.info-modify-btn {
  color: #1890ff;
  cursor: pointer;
  text-decoration: underline;
}
.w8ben-title {
  margin: 40px 0 20px;
  font-size: 16px;
}
</style>
