<template>
  <div class="announcement">
    <div class="search-area">
      <a-form layout="inline" style="marginbottom: 20px" @submit="handleSubmit">
        <a-form-item label="">
          <a-input style="width: 285px" v-model="queryParam.keyword" allowClear placeholder="请输入标题"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :disabled="clickable"> 搜索 </a-button>
          <a-button style="margin-left: 8px" @click="resetQuery" :disabled="clickable">重置</a-button>
        </a-form-item>
      </a-form>
      <div class="right-button-wrap">
        <a-button type="primary" @click="addAnnounceFn">新增</a-button>
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
          <div>
            <a-button type="primary" size="small" icon="edit" @click="editAnnounce(record)">编辑</a-button>
            <a-button type="primary" size="small" icon="eye" @click="onPreview(record.id)">预览</a-button>
            <a-button :type="record.status == 0 ? 'primary' : 'danger'" ghost size="small" icon="poweroff" @click="updateStatus(record)">{{
              record.status == 0 ? '开启' : '禁用'
            }}</a-button>
          </div>
          <div style="margin-top: 5px" v-if="canSort">
            <a-button type="danger" size="small" icon="delete" @click="deleteRow(record.id)">删除</a-button>
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
        </div>
      </template>
    </a-table>
    <add-announce :modalVisible.sync="modalVisible" :modalInfo="modalInfo" v-if="modalVisible"></add-announce>
    <a-modal :visible="previewVisible" :maskClosable="false" :footer="null" @cancel="cancelModal">
      <div style="max-height: 500px; overflow: auto" v-html="previewInfo"></div>
      <div><img style="width: 100%" :src="previewUrl" alt="" /></div>
    </a-modal>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { list } from '@/components/mixins/getList'
import columns from './table-utils/announcement'
import AddAnnounce from './addAnnounce'

export default {
  mixins: [list],
  components: {
    AddAnnounce,
    [Modal.name]: Modal,
  },
  data() {
    return {
      columns,
      modalVisible: false,
      previewVisible: false,
      previewInfo: '',
      previewUrl: '',
      modalInfo: {
        title: '新增公告',
      },
      canSort: true,
    }
  },
  computed: {
    disabledCount() {
      const disabledList = this.dataList.filter((item) => item.status == 0)
      return disabledList.length
    },
  },
  methods: {
    getList(query) {
      const { current, pageSize } = this.pagination
      let params = Object.assign(
        {
          page: current,
          page_size: pageSize,
        },
        this.queryParam,
        query
      )
      this['SET_CLICK'](true)
      this.$apis
        .getNoticeList(params)
        .then((res) => {
          this.dataList = []
          this.pagination.total = res.total
          let resData = res.data
          resData.forEach((item, index) => {
            item.key = current * 10 - 10 + index + 1
            this.dataList.push(item)
            // this.dataList['key']=
          })
          this.canSort = this.queryParam.keyword ? false : true
          console.log(this.dataList, 'dataList')
          this['SET_CLICK'](false)
        })
        .catch((err) => {
          this['SET_CLICK'](false)
        })
    },
    // 重置
    resetQuery() {
      this.rangeTime = []
      this.queryParam = {}
      this.pagination.current = 1
      this.getList()
    },
    addAnnounceFn() {
      this.modalVisible = true
      this.modalInfo.id = ''
    },
    editAnnounce(row) {
      this.modalVisible = true
      this.modalInfo.title = '公告编辑'
      this.modalInfo.id = row.id
    },
    deleteRow(id) {
      this['SET_CLICK'](true)
      this.$apis
        .deleteNotice({ id })
        .then((res) => {
          this['SET_CLICK'](false)
          this.getList()
        })
        .catch((error) => {
          this['SET_CLICK'](false)
        })
    },
    onPreview(id) {
      this['SET_CLICK'](true)
      this.$apis
        .noticeDetail({ id })
        .then((res) => {
          this.previewVisible = true
          this['SET_CLICK'](false)
          let hkContent = res.hk_text
          if (res.content_type) {
            if (hkContent) {
              this.previewInfo = hkContent
            } else {
              let fileType = res.file_url.split('.')[1]
              if (fileType == 'pdf') {
                this.previewVisible = false
                window.open(
                  res.file_url_sign,
                  '_blank',
                  'height=700, width=700, top=100, left=200, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no'
                )
              } else {
                this.previewUrl = res.file_url_sign
              }
            }
          } else {
            this.previewInfo = res.hk_title
          }
        })
        .catch((err) => {
          console.log(err)
          this['SET_CLICK'](false)
        })
    },
    cancelModal() {
      this.previewVisible = false
      setTimeout(() => {
        this.previewInfo = ''
        this.previewUrl = ''
      }, 300)
    },
    updateStatus(row) {
      let params = {
        id: row.id,
      }
      if (row.status == 0) {
        params.status = 1
      } else if (row.status == 1) {
        params.status = 0
      }
      this['SET_CLICK'](true)
      this.$apis
        .updateNoticeStatus(params)
        .then((res) => {
          this['SET_CLICK'](false)
          this.getList()
        })
        .catch((error) => {
          this['SET_CLICK'](false)
          console.log(error)
        })
    },
    moveRowUp(row, index) {
      // let preItem = this.dataList[index - 1]
      // this.dataList.splice(index - 1, 1, row)
      // this.dataList.splice(index, 1, preItem)
      // let ids = []
      // this.dataList.forEach((item) => {
      //   ids.push(item.id)
      // })

      this.moveItemCall({ ids: row.id, type: 1 })
    },
    moveRowDown(row, index) {
      // let nextItem = this.dataList[index + 1]
      // this.dataList.splice(index, 1, nextItem)
      // this.dataList.splice(index + 1, 1, row)
      // let ids = []
      // this.dataList.forEach((item) => {
      //   ids.push(item.id)
      // })

      this.moveItemCall({ ids: row.id, type: 2 })
    },
    moveItemCall(data) {
      this['SET_CLICK'](true)
      this.$apis
        .sortNotice(data)
        .then((res) => {
          this.getList()
          this['SET_CLICK'](false)
        })
        .catch((err) => {
          this['SET_CLICK'](false)
        })
    },
  },
}
</script>

<style lang='less' scoped>
@import url('../../style/init.less');
.right-button-wrap {
  display: flex;
}
.btn-group {
  display: flex;
  flex-wrap: wrap;
  div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    /* button {
      margin-left: 10px;
      &:first-child {
        margin-left: 0;
      }
    } */
  }
}
</style>
