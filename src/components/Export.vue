<template>
  <export-excel
    :before-finish="finishDownload"
    :before-generate="beforeDownload"
    :fetch="exportType=='all'?fetchAllTable:fetchSelected"
    :name="name"
    worksheet="My Worksheet"
  >
    <a-button type="primary" :disabled="downloadLoading">
      {{exportBtnTxt}}
    </a-button>
  </export-excel>
</template>
<script>
import { Button } from 'ant-design-vue'
export default {
  data() {
    return {
      downloadLoading: false
    }
  },
  props: {
    exportType: {
      //导出类型，默认是导出选中状态，导出全部为 all
      type: String,
      default: ''
    },
    selectedIdName: {
      //导出选中状态的id名称，仅在选中导出时有用
      type: String,
      default: 'transfer_no'
    },
    post_id: {
      //请求接口时需要传入的id字段名
      type: String,
      default: 'transfer_no_list'
    },
    exportBtnTxt: {
      //导出按钮的文本
      type: String,
      default: '导出选中'
    },
    queryParams: Object, //查询列表保留的搜索参数，也是列表接口的参数
    multipleSelection: Array, //选中导出时的选中数据
    name: {
      //导出文件的名字
      type: String,
      default: 'worksheet'
    },
    callBack: Function //导出数据的promise回调函数
  },
  components: {
    [Button.name]: Button
  },
  methods: {
    async fetchAllTable() {
      try {
        let response = await this.callBack(this.queryParams)
        if (Array.isArray(response.data) && response.data.length) {
          return response
        } else {
          this.downloadLoading = false
          this.$message.warning('导出数据为空')
        }
      } catch (e) {
        this.downloadLoading = false
      }
    },
    async fetchSelected() {
      let export_ids = []
      this.multipleSelection.forEach(item => {
        export_ids.push(item[this.selectedIdName])
      })
      if (export_ids.length > 0) {
        try {
          let response = await this.callBack(
            Object.assign({}, this.queryParams, {
              [this.post_id]: export_ids.join(',')
            })
          )
          return response
        } catch (error) {
          console.log(error.data)
          this.downloadLoading=false
          this.$emit('downloadError',error.data)
        }
      } else {
        this.$message().warning('请先选择要导出的数据')
      }
    },
    beforeDownload(type) {
      if ((this.multipleSelection && this.multipleSelection.length > 0) || this.exportType == 'all') {
        this.downloadLoading = true
        this.$emit('beforeDownload')
      }
    },
    finishDownload() {
      this.downloadLoading = false
      this.$emit('finishedDownload')
    }
  }
}
</script>
