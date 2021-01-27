<template>
  <div class="announcement">
    <div class="search-area">
      <a-form layout="inline" style="marginbottom: 20px" @submit="handleSubmit">
        <a-form-item label="">
          <a-input style="width: 285px" v-model="queryParam.keyword" allowClear placeholder="请输入文档名称"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :disabled="clickable"> 搜索 </a-button>
          <a-button style="margin-left: 8px" @click="resetQuery" :disabled="clickable">重置</a-button>
        </a-form-item>
      </a-form>
      <div class="right-button-wrap">
        <a-button type="primary" @click="handleAdd">新增</a-button>
      </div>
    </div>
    <a-table
      :columns="columns"
      :dataSource="dataList"
      :pagination="pagination"
      :loading="clickable"
      rowKey="id"
      :scroll="{ y: tableHeight }"
      bordered
    >
      <template slot="operation" slot-scope="text, record, index">
        <div class="btn-group">
          <a-button type="primary" size="small" icon="edit" @click="handleEdit(record)">编辑</a-button>
          <a-button type="primary" size="small" icon="eye" @click="handlePreview(record.id)">预览</a-button>
          <a-button type="danger" size="small" icon="delete" @click="handleDelete(record)">删除</a-button>
        </div>
        <div class="btn-group" style="margin-top: 5px; width: 60%" v-if="record.status == 1 && canSort">
          <a-button
            type="link"
            size="small"
            icon="arrow-up"
            style="color: #ff4d4f"
            @click="moveRowUp(record, index)"
            v-if="index > 0 || pagination.current > 1"
            >上移</a-button
          >
          <a-button
            type="link"
            size="small"
            icon="arrow-down"
            @click="moveRowDown(record, index)"
            v-if="record.key < pagination.total - disabledCount"
            >下移</a-button
          >
        </div>
      </template>
    </a-table>
    <add-help-item :modalVisible.sync="modalVisible" :modalInfo="modalInfo" v-if="modalVisible"></add-help-item>
    <a-modal :title="previewInfo.title + '预览'" :visible="previewVisible" :maskClosable="false" :footer="null" @cancel="cancelModal">
      <div style="max-height: 500px; overflow-y: auto" v-html="previewInfo.content"></div>
    </a-modal>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { list } from '@/components/mixins/getList'
import columns from './table-utils/helpCenterList'
import AddHelpItem from './components/AddHelpItem'

export default {
  mixins: [list],
  components: {
    AddHelpItem,
    [Modal.name]: Modal
  },
  data() {
    return {
      columns,
      modalVisible: false,
      previewVisible: false,
      previewInfo: {},
      modalInfo: {
        title: '新增文档'
      },
      canSort: true
    }
  },
  computed: {
    disabledCount() {
      const disabledList = this.dataList.filter(item => item.status == 0)
      return disabledList.length
    }
  },
  methods: {
    getList(query) {
      const { current, pageSize } = this.pagination
      let params = Object.assign(
        {
          page: current,
          page_size: pageSize
        },
        this.queryParam,
        query
      )
      this['SET_CLICK'](true)
      this.$apis
        .get_help_doc_list(params)
        .then(res => {
          this.pagination.total = res.total
          res.data.forEach((item, index) => {
            item.key = (current - 1) * pageSize + index + 1
          })

          this.dataList = []
          this.dataList.splice((current - 1) * pageSize, res.data.length, ...res.data)
          this.canSort = this.queryParam.keyword ? false : true

          this['SET_CLICK'](false)
        })
        .catch(err => {
          this['SET_CLICK'](false)
        })
    },
    handleAdd() {
      this.modalVisible = true
      this.modalInfo.id = ''
      this.modalInfo.title = '新增文档'
    },
    handleEdit(row) {
      this.modalVisible = true
      this.modalInfo.title = '文档编辑'
      this.modalInfo.id = row.id
    },
    // 删除
    handleDelete(row) {
      const that = this
      this.$confirm({
        title: '提示',
        content: `确认删除文档${row.title_zhcn}？`,
        onOk() {
          that['SET_CLICK'](true)
          that.$apis
            .delete_help_doc({ id: row.id })
            .then(res => {
              that['SET_CLICK'](false)
              that.$toast.success('操作成功')
              that.getList()
            })
            .catch(error => {
              that['SET_CLICK'](false)
            })
        },
        onCancel() {}
      })
    },
    // 预览
    handlePreview(id) {
      this['SET_CLICK'](true)
      this.$apis
        .get_help_doc_detail({ id })
        .then(res => {
          this.previewVisible = true
          this['SET_CLICK'](false)
          let hkContent = res.content_zhhk
          let hkTitle = res.title_zhhk
          if (hkContent) {
            this.previewInfo.title = hkTitle
            this.previewInfo.content = hkContent
          }
        })
        .catch(err => {
          console.log(err)
          this['SET_CLICK'](false)
        })
    },
    // 关闭预览
    cancelModal() {
      this.previewVisible = false
      setTimeout(() => {
        this.previewInfo = {}
      }, 300)
    },
    // 上移
    moveRowUp(row, index) {
      // let ids = []
      // const { current, pageSize } = this.pagination
      // const currentIndex = (current - 1) * pageSize + index
      // let preItem = this.dataList[currentIndex - 1]

      // this.dataList.splice(currentIndex - 1, 1, row)
      // this.dataList.splice(currentIndex, 1, preItem)

      // this.dataList.forEach((_item, _index) => {
      //   _item.key = _index + 1
      //   ids.push(_item.id)
      // })

      this.moveItemCall({ ids: row.id, type: 1 })
    },
    // 下移
    moveRowDown(row, index) {
      // let ids = []
      // const { current, pageSize } = this.pagination
      // const currentIndex = (current - 1) * pageSize + index
      // let nextItem = this.dataList[currentIndex + 1]

      // this.dataList.splice(currentIndex, 1, nextItem)
      // this.dataList.splice(currentIndex + 1, 1, row)

      // this.dataList.forEach((_item, _index) => {
      //   _item.key = _index + 1
      //   ids.push(_item.id)
      // })

      this.moveItemCall({ ids: row.id, type: 2 })
    },
    moveItemCall(data) {
      this['SET_CLICK'](true)
      this.$apis
        .sort_help_doc(data)
        .then(res => {
          this.getList()
          this['SET_CLICK'](false)
        })
        .catch(err => {
          this['SET_CLICK'](false)
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../style/init.less');
.right-button-wrap {
  display: flex;
}
.btn-group {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
