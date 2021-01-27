<template>
  <div class="add-announce">
    <a-modal
      :title="modalInfo.title"
      :visible="modalVisible"
      :confirm-loading="formLoading"
      @ok="handleOk"
      @cancel="cancelModal"
      :maskClosable="false"
      width="1000px"
    >
      <div style="height:600px;overflow-y:auto;overflow-x:hidden;">.
        <a-spin :spinning="formLoading">
          <a-form-model
            :model="form"
            :rules="rules"
            ref="ruleForm"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-model-item label="公告类型">
              <a-input
                v-model="form.type"
                disabled
              />
            </a-form-model-item>
            <a-form-model-item
              label="是否开启"
              prop="status"
            >
              <a-radio-group
                name="是否开启"
                v-model="form.status"
              >
                <a-radio :value="1">
                  启动
                </a-radio>
                <a-radio :value="0">
                  禁用
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item
              label="跑马灯推送周期"
              prop="rangeTime"
            >
              <a-range-picker
                :placeholder="['起始时间', '结束时间']"
                inputReadOnly
                @change="rangeTimeChange"
                :show-time="{ format: 'YYYY-MM-DD HH:mm:ss' }"
                format="YYYY-MM-DD HH:mm:ss"
                v-model="form.rangeTime"
              ></a-range-picker>
            </a-form-model-item>
            <a-divider>
              <small style="color:#999;">跑马灯内容编写:用于首页展示，请不要超过100个字符</small>
            </a-divider>
            <a-form-model-item
              label="标题(繁体中文)"
              prop="hk_title"
            >
              <a-input v-model="form.hk_title" />
            </a-form-model-item>
            <a-form-model-item
              label="标题(简体中文)"
              prop="zh_title"
            >
              <a-input v-model="form.zh_title" />
            </a-form-model-item>
            <a-form-model-item
              label="标题(英文)"
              prop="en_title"
            >
              <a-input v-model="form.en_title" />
            </a-form-model-item>
            <a-form-model-item label="跳转内容操作选择" prop="content_type">
              <a-select
                placeholder="请选择跳转内容操作"
                allowClear
                @change="contentTypeChange"
                v-model="form.content_type"
              >
                <a-select-option :value="1">跳转内容编辑</a-select-option>
                <a-select-option :value="2">跳转内容上传</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              label="跳转页面内容上传"
              prop="file_url"
              v-if="form.content_type==2"
            >
              <a-upload
                action="upload"
                list-type="picture-card"
                :file-list="fileList"
                :customRequest="uploadAction"
                :remove="removeImg"
                @preview="handlePreview"
              >
                <div v-if="fileList.length < 1">
                  <a-icon type="plus" />
                </div>
              </a-upload>
              <a-modal
                :visible="previewVisible"
                :footer="null"
                @cancel="handleCancel"
              >
                <img
                  alt="example"
                  style="width: 100%"
                  :src="previewImage"
                />
              </a-modal>
            </a-form-model-item>
            <a-form-model-item
              label="跳转页面内容编辑"
              v-if="form.content_type==1"
            >
              <a-radio-group
                v-model="btnTab"
                :style="{ marginBottom: '8px' }"
              >
                <a-radio-button value="ft">
                  繁体中文
                </a-radio-button>
                <a-radio-button value="jt">
                  简体中文
                </a-radio-button>
                <a-radio-button value="en">
                  英文
                </a-radio-button>
              </a-radio-group>
              <TinymceEditor
                v-model="form.hk_text"
                v-if="btnTab=='ft'"
              ></TinymceEditor>
              <TinymceEditor
                v-model="form.zh_text"
                v-if="btnTab=='jt'"
              ></TinymceEditor>
              <TinymceEditor
                v-model="form.en_text"
                v-if="btnTab=='en'"
              ></TinymceEditor>
            </a-form-model-item>
          </a-form-model>
        </a-spin>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { Card, Divider, Row, Col, Button, FormModel, Input, Select, Spin, Modal, Radio, DatePicker, Icon, Upload } from 'ant-design-vue'
import TinymceEditor from '../../components/tinymce/Tinymce.vue'
import { getBase64 } from '../../utils/util'
import moment from 'moment'

export default {
  data() {
    return {
      form: {
        type: 'APP应用--首页-跑马灯',
        rangeTime: [],
        status: 1,
        hk_text: '',
        zh_text: '',
        en_text: '',
      },
      btnTab: 'ft',
      fileList: [],
      previewImage: '',
      previewVisible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      formLoading: false,
      rules: {
        rangeTime: [
          {
            required: true,
            message: '请选择跑马灯推送周期',
            trigger: 'change',
          },
        ],
        status: [
          {
            required: true,
            message: '是否开启',
            trigger: 'change',
          },
        ],
        hk_title: [
          {
            required: true,
            message: '请输入繁体中文',
            trigger: 'blur',
          },
          {
            max: 100,
            message: '最大输入100字符',
            trigger: 'blur',
          },
        ],
        zh_title: [
          {
            required: true,
            message: '请输入简体中文',
            trigger: 'blur',
          },
          {
            max: 100,
            message: '最大输入100字符',
            trigger: 'blur',
          },
        ],
        en_title: [
          {
            required: true,
            message: '请输入英文',
            trigger: 'blur',
          },
          {
            max: 100,
            message: '最大输入100字符',
            trigger: 'blur',
          },
        ],
        content_type:[{
          required:true,
          message:'请选择跳转内容操作',
          trigger:'change'
        }]
      },
    }
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    modalVisible: {
      type: Boolean,
      default: false,
    },
    modalInfo: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    [Button.name]: Button,
    [Radio.name]: Radio,
    [Radio.Button.name]: Radio.Button,
    [Radio.Group.name]: Radio.Group,
    [DatePicker.name]: DatePicker,
    [DatePicker.RangePicker.name]: DatePicker.RangePicker,
    [Card.name]: Card,
    [Row.name]: Row,
    [Col.name]: Col,
    [FormModel.name]: FormModel,
    [FormModel.Item.name]: FormModel.Item,
    [Input.name]: Input,
    [Select.name]: Select,
    [Spin.name]: Spin,
    [Modal.name]: Modal,
    [Divider.name]: Divider,
    [Icon.name]: Icon,
    [Upload.name]: Upload,
    [Select.Option.name]: Select.Option,
    TinymceEditor,
  },
  mounted() {
    if(this.modalInfo.id){
      this.formLoading = true
      this.$apis
        .noticeDetail({ id: this.modalInfo.id })
        .then((res) => {
          this.form = {
            ...this.form,
            ...res,
            content_type:res.content_type==0?undefined:res.content_type,
            rangeTime: [moment(res.start_time), moment(res.end_time)],
          }
          if(res.file_url){
            let name = res.file_url.split('.')[res.file_url.split('.').length - 1]
            this.fileList.push({
              uid: new Date().getTime(),
              name: `image.${name}`,
              status: 'done',
              content: res.file_url,
              url: res.file_url_sign,
            })
          }
          this.contentTypeClear(res.content_type)
          this.formLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.formLoading = false
        })
    }
  },
  methods: {
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.form.content_type) {
            if (this.form.content_type == 1) {
              if (this.form.hk_text === '' || this.form.zh_text === '' || this.form.en_text === '') {
                this.$message.error('请同时填写跳转编辑内容繁体、简体和英文')
                return
              }
            }
            if (this.form.content_type == 2 && this.fileList.length == 0) {
              this.$message.error('请上传跳转内容')
              return
            }
          }
          let params = {
            status: this.form.status,
            notice_type: 1,
            start_time: this.form.start_time,
            end_time: this.form.end_time,
            zh_title: this.form.zh_title,
            en_title: this.form.en_title,
            hk_title: this.form.hk_title,
            file_url: (this.fileList.length > 0 && this.fileList[0].content) || '',
            zh_text: this.form.zh_text,
            en_text: this.form.en_text,
            hk_text: this.form.hk_text,
            content_type: this.form.content_type,
          }
          if (this.modalInfo.id) {
            this.editNoticeFn({ ...params, id: this.modalInfo.id })
          } else {
            this.addNoticeFn(params)
          }
        }
      })
    },
    editNoticeFn(params) {
      this.formLoading = true
      this.$apis
        .updateNotice(params)
        .then((res) => {
          this.$emit('update:modalVisible', false)
          this.resetForm()
          this.$parent.getList()
          this.formLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.formLoading = false
        })
    },
    addNoticeFn(params) {
      this.formLoading = true
      this.$apis
        .addNotice(params)
        .then((res) => {
          this.$emit('update:modalVisible', false)
          this.resetForm()
          this.$parent.getList()
          this.formLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.formLoading = false
        })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.fileList = []
      this.form.hk_text = ''
      this.form.zh_text = ''
      this.form.en_text = ''
    },
    contentTypeChange(val) {
      console.log(val)
      this.contentTypeClear(val)
    },
    contentTypeClear(value){
      console.log(value,'contenttype')
      if (value != 1) {
        this.form.hk_text = ''
        this.form.zh_text = ''
        this.form.en_text = ''
      }
      if (value != 2) {
        this.fileList = []
      }
    },
    rangeTimeChange(newVal) {
      let rangeTime = {}
      if (newVal.length) {
        rangeTime = {
          start_time: newVal[0].format('YYYY-MM-DD HH:mm:ss'),
          end_time: newVal[1].format('YYYY-MM-DD HH:mm:ss'),
        }
      } else {
        rangeTime.start_time = ''
        rangeTime.end_time = ''
      }
      this.form = {
        ...this.form,
        ...rangeTime,
      }
    },
    cancelModal() {
      this.$emit('update:modalVisible', false)
    },
    uploadAction(data) {
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('put_dir', 'gygjqh_public')
      if (data.file.type === 'application/pdf') {
        formData.append('vtype', 2)
      } else {
        formData.append('vtype', 0)
      }
      console.log(data)
      this.formLoading = true
      this.$apis
        .uploadImgMulti(formData)
        .then((res) => {
          let name = res.content.split('.')[res.content.split('.').length - 1]
          this.fileList.push({
            uid: new Date().getTime(),
            name: `image.${name}`,
            status: 'done',
            content: res.content,
            url: res.url,
          })
          this.formLoading = false
        })
        .catch((err) => {
          this.formLoading = false
        })
    },
    handleCancel() {
      this.previewVisible = false
    },
    removeImg(file) {
      // let index = _.findIndex(this.fileList, ['uid', file.uid])
      this.fileList.splice(0, 1)
    },
    async handlePreview(file) {
      let fileType = file.name.split('.')[1]
      if (fileType == 'pdf') {
        window.open (file.url, '_blank', 'height=700, width=700, top=100, left=200, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
      } else {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj)
        }
        this.previewImage = file.url || file.preview
        this.previewVisible = true
      }
    },
  },
}
</script>

<style lang='less' scoped>
</style>
