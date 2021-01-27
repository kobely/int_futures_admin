<template>
  <div>
    <p class="open-account-section-title">补充资料</p>
    <a-row>
      <a-col :span="3" :offset="1">
        补充资料
      </a-col>
      <a-col :span="12">
        <a-upload :multiple="true" :file-list="fileList" :customRequest="uploadFile" :remove="handleRemove" @change="handleChange">
          <a-button><a-icon type="upload" />上传</a-button>
        </a-upload>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { Row, Col, Upload, Button, Icon } from 'ant-design-vue'

export default {
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Upload.name]: Upload,
    [Button.name]: Button,
    [Icon.name]: Icon
  },
  data() {
    return {
      fileList: []
    }
  },
  props: ['form'],
  watch: {
    'form.extra_info'(fileInfo) {
      if (fileInfo.length && !this.fileList.length) {
        fileInfo.forEach((item, index) => {
          this.fileList.push({
            uid: index,
            name: item.origin_name,
            status: 'done',
            url: item.url
          })
        })
      }
    }
  },
  methods: {
    handleChange(info) {
      let fileList = [...info.fileList]

      this.fileList = fileList
    },
    // 删除
    handleRemove(file) {
      // console.log(file)
      const newExtraInfo = this.form.extra_info.filter(item => item.origin_name != file.name)
      this.form.extra_info = newExtraInfo
    },
    // 自定义上传
    uploadFile(info) {
      let formData = new FormData()
      formData.append('file', info.file)
      formData.append('put_dir', 'gygjqh_protected')

      this.$apis
        .uploadImgMulti(formData)
        .then(res => {
          this.fileList[this.fileList.length - 1].url = res.url
          let _fileList = this.fileList
          _fileList[_fileList.length - 1].status = 'done'

          this.form.extra_info.push({
            origin_name: res.origin_name,
            content: res.content
          })
        })

        .catch(err => {})
    }
  }
}
</script>

<style lang="less" scoped></style>
