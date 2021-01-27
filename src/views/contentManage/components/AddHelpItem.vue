<template>
  <div class="add-announce">
    <a-modal
      :title="modalInfo.title"
      :visible="modalVisible"
      :confirm-loading="formLoading"
      @ok="handleOk"
      @cancel="cancelModal"
      :maskClosable="false"
      :destroyOnClose="true"
      width="950px"
    >
      <div style="height: 600px; overflow-y: auto; overflow-x: hidden">
        <a-spin :spinning="formLoading">
          <a-form-model :model="form" :rules="rules" ref="ruleForm" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="文档名称(繁体中文)" prop="title_zhhk">
              <a-input v-model="form.title_zhhk" />
            </a-form-model-item>
            <a-form-model-item label="文档名称(简体中文)" prop="title_zhcn">
              <a-input v-model="form.title_zhcn" />
            </a-form-model-item>
            <a-form-model-item label="文档名称(英文)" prop="title_en">
              <a-input v-model="form.title_en" />
            </a-form-model-item>

            <a-form-model-item label="是否启用" prop="status">
              <a-radio-group name="是否启用" v-model="form.status">
                <a-radio :value="1"> 启用 </a-radio>
                <a-radio :value="0"> 禁用 </a-radio>
              </a-radio-group>
            </a-form-model-item>

            <a-form-model-item label="文档内容编辑" v-if="isEditorOk">
              <a-radio-group v-model="btnTab" :style="{ marginBottom: '8px' }">
                <a-radio-button value="ft"> 繁体中文 </a-radio-button>
                <a-radio-button value="zh"> 简体中文 </a-radio-button>
                <a-radio-button value="en"> 英文 </a-radio-button>
              </a-radio-group>
              <tinymce-editor v-model="form.content_zhhk" v-if="btnTab == 'ft'"></tinymce-editor>
              <tinymce-editor v-model="form.content_zhcn" v-if="btnTab == 'zh'"></tinymce-editor>
              <tinymce-editor v-model="form.content_en" v-if="btnTab == 'en'"></tinymce-editor>
            </a-form-model-item>
          </a-form-model>
        </a-spin>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { Card, Row, Col, Button, FormModel, Input, Spin, Modal, Radio } from 'ant-design-vue'
import TinymceEditor from '@/components/tinymce/Tinymce.vue'

export default {
  components: {
    [Button.name]: Button,
    [Radio.name]: Radio,
    [Radio.Button.name]: Radio.Button,
    [Radio.Group.name]: Radio.Group,
    [Card.name]: Card,
    [Row.name]: Row,
    [Col.name]: Col,
    [FormModel.name]: FormModel,
    [FormModel.Item.name]: FormModel.Item,
    [Input.name]: Input,
    [Spin.name]: Spin,
    [Modal.name]: Modal,
    TinymceEditor,
  },
  data() {
    return {
      form: {
        status: 1,
        content_zhhk: '',
        content_zhcn: '',
        content_en: '',
      },
      btnTab: 'ft',
      isEditorOk: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
      formLoading: false,
      rules: {
        title_zhhk: [
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
        title_zhcn: [
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
        title_en: [
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
      },
    }
  },
  props: {
    modalVisible: {
      type: Boolean,
      default: false,
    },
    modalInfo: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    if (this.modalInfo.id) {
      this.formLoading = true
      this.$apis
        .get_help_doc_detail({ id: this.modalInfo.id })
        .then((res) => {
          this.form = {
            ...this.form,
            ...res,
          }

          this.isEditorOk = true
          this.formLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.formLoading = false
        })
    } else {
      setTimeout(() => {
        this.isEditorOk = true
      }, 100)
    }
  },
  methods: {
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.form.content_zhhk === '' || this.form.content_zhcn === '' || this.form.content_en === '') {
            this.$message.error('请同时填写文档内容繁体、简体和英文')
            return
          }

          if (this.modalInfo.id) {
            this.updateHelpDoc({ ...this.form, id: this.modalInfo.id })
          } else {
            this.addHelpDoc(this.form)
          }
        }
      })
    },
    // 编辑
    updateHelpDoc(params) {
      this.formLoading = true
      this.$apis
        .update_help_doc(params)
        .then((res) => {
          this.callbackSuccessFn()
          this.formLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.formLoading = false
        })
    },
    // 新增
    addHelpDoc(params) {
      this.formLoading = true
      this.$apis
        .add_help_doc(params)
        .then((res) => {
          this.callbackSuccessFn()
          this.formLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.formLoading = false
        })
    },
    callbackSuccessFn() {
      this.$emit('update:modalVisible', false)
      this.$toast.success('操作成功')
      this.$parent.getList()
    },
    cancelModal() {
      this.$emit('update:modalVisible', false)
    },
  },
}
</script>

<style lang='less' scoped>
</style>
