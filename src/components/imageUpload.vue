<template>
  <div class="image-upload-container">
    <a-upload
      list-type="picture-card"
      accept="image/*,video/*"
      :file-list="fileList"
      :beforeUpload="beforeUpload"
      :remove="handleRemove"
      :customRequest="uploadImg"
      :disabled="canEdit"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < uploadNum">
        <a-icon :type="loading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">上传</div>
      </div>
    </a-upload>
    <!-- 图片预览层 start -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <div style="max-height: 600px;overflow-y: auto;padding-top: 15px;text-align: center;">
        <img alt="example" style="max-width: 100%" :src="previewImage" />
      </div>
    </a-modal>
    <!-- 图片预览层 end -->
  </div>
</template>

<script>
import { Upload, Icon, Modal } from 'ant-design-vue'
import { FILE_URL } from '@/utils/const'

export default {
  components: {
    [Upload.name]: Upload,
    [Icon.name]: Icon,
    [Modal.name]: Modal
  },
  data() {
    return {
      previewImage: '',
      previewVisible: false,
      fieldUrl: '',
      imageUrl: '',
      loading: false
    }
  },
  props: {
    fileList: {
      type: Array,
      default: () => []
    },
    uploadNum: {
      type: Number,
      default: 1
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    fileList: {
      // 进页面有图片填充fieldUrl
      handler(newVal) {
        if (newVal && newVal.length && !this.fieldUrl) {
          newVal.forEach(item => {
            if (item.url) {
              if (this.fieldUrl) {
                this.fieldUrl += ',' + item.url.replace(FILE_URL, '')
              } else {
                this.fieldUrl = item.url.replace(FILE_URL, '')
              }
            }
          })
        }
      },
      deep: true
    }
  },
  methods: {
    // 图片上传前的钩子
    beforeUpload(file) {
      // const isCorrectType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      // if (!isCorrectType) {
      //   this.$message.error('图片类型不支持!')
      // }
      const isLtSize = file.size / 1024 / 1024 < 10
      if (!isLtSize) {
        this.$message.error('图片最大10M!')
      }
      return isLtSize
    },
    // 自定义图片上传
    uploadImg(info) {
      let formData = new FormData()
      formData.append('file', info.file)
      formData.append('put_dir', 'gygjqh_protected')

      this.loading = true
      this.$apis
        .uploadImgMulti(formData)
        .then(res => {
          let _fileList = this.fileList
          _fileList[_fileList.length - 1].status = 'done'
          this.$emit('update:fileList', _fileList)

          if (_fileList.length > 1) {
            this.fieldUrl += ','
            this.fieldUrl += res.content
          } else {
            this.fieldUrl = res.content
          }

          this.$emit('fieldUrlChange', this.fieldUrl)
          this.imageUrl = res.url
          this.loading = false
        })

        .catch(err => {})
    },
    // 上传文件改变时的状态
    handleChange({ fileList }) {
      this.$emit('update:fileList', fileList)
    },
    // 预览图片
    handlePreview(file) {
      if (file.name.indexOf('video') > -1 || file.name.includes('mp4')) {
        window.open(file.url)
        return
      }
      this.previewImage = file.url || this.imageUrl
      this.previewVisible = true
    },
    // 关闭预览
    handleCancel() {
      this.previewVisible = false
    },
    // 删除图片
    handleRemove(file) {
      let fieldUrlList = this.fieldUrl.split(',')
      const newFileList = this.fileList.filter(item => item.uid != file.uid)
      this.fileList.forEach((item, index) => {
        if (item.uid == file.uid) {
          fieldUrlList.splice(index, 1)
          this.fieldUrl = fieldUrlList.join(',')
        }
      })
      this.$emit('update:fileList', newFileList)
      this.$emit('fieldUrlChange', this.fieldUrl)
    }
  }
}
</script>

<style lang="less" scoped>
.image-upload-container {
  height: 112px;
}
</style>
