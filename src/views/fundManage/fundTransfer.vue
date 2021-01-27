<template>
  <div class="fund-transer">
    <div class="search-area">
      <a-form layout="inline" style="marginbottom: 20px;" @submit="handleSubmit">
        <a-form-item label="">
          <a-input style="width: 285px;" v-model="queryParam.keyword" placeholder="服务单号/UserId/姓名/账户号/银行卡号"></a-input>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.type"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 140px;"
            :allowClear="true"
            placeholder="划转方向"
          >
            <a-select-option value="1">A转B</a-select-option>
            <a-select-option value="2">B转A</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="">
          <a-range-picker format="YYYY-MM-DD" :placeholder="['起始时间', '结束时间']" inputReadOnly v-model="rangeTime"></a-range-picker>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.handler_status"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 140px;"
            :allowClear="true"
            placeholder="处理状态"
          >
            <a-select-option value="0">未处理</a-select-option>
            <a-select-option value="1">已处理</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :disabled="clickable">
            搜索
          </a-button>
          <a-button style="margin-left: 8px;" @click="resetQuery" :disabled="clickable">重置</a-button>
        </a-form-item>
      </a-form>
      <div class="right-button-wrap">
        <a-button type="primary" @click="batchExportFn">批量导出</a-button>
        <a-button type="primary" style="margin-left:10px;" @click="batchHandleFn">批量处理</a-button>
      </div>
    </div>
    <a-table
      :columns="columns"
      :dataSource="dataList"
      :pagination="pagination"
      :loading="clickable"
      :scroll="{ y: tableHeight }"
      rowKey="transfer_no"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      bordered
    >
      <template slot="operation" slot-scope="text, record">
        <div class="flex-center">
          <a-button type="primary" size="small" v-if="record.handler_status == 0" @click="singleHandleFn(record)">处理</a-button>
          <a-button type="primary" size="small" disabled v-if="record.handler_status == 1">处理</a-button>
        </div>
      </template>
    </a-table>
    <batch-handle
      :transferInfo="transferInfo"
      :title="handleTitle"
      :handleParams="handleParams"
      :batchHandleVisible.sync="batchHandleVisible"
    ></batch-handle>
    <batch-export
      :exportVisible.sync="exportVisible"
      :handleParams="handleParams"
      :transferInfo="transferInfo"
      :multipleSelection="selectedRows"
    ></batch-export>
  </div>
</template>

<script>
import { DatePicker, Modal } from 'ant-design-vue'
import { list } from '@/components/mixins/getList'
import columns from './table-utils/fundTransfer'
import BatchHandle from './components/batchHandle'
import BatchExport from './components/batchExport'

export default {
  components: {
    [DatePicker.name]: DatePicker,
    [DatePicker.RangePicker.name]: DatePicker.RangePicker,
    [Modal.name]: Modal,
    BatchHandle,
    BatchExport
  },
  mixins: [list],
  data() {
    return {
      batchHandleVisible: false,
      exportVisible: false,
      // 表头
      columns,
      statementType: '',
      rangeTime: [],
      transferInfo: {},
      handleTitle: '',
      handleParams: {},
      selectedRows: [],
      selectedRowKeys: []
    }
  },
  watch: {
    rangeTime(newVal) {
      let rangeTime = {}
      if (newVal.length) {
        rangeTime = {
          start_time: newVal[0].format('YYYY-MM-DD'),
          end_time: newVal[1].format('YYYY-MM-DD')
        }
      } else {
        rangeTime.start_time = ''
        rangeTime.end_time = ''
      }
      this.queryParam = {
        ...this.queryParam,
        ...rangeTime
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRows changed: ', selectedRows)
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
    },
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
        .transferList(params)
        .then(res => {
          this.selectedRowKeys = []
          this.selectedRows = []
          this.dataList = []
          this.pagination.total = res.total
          let resData = res.data
          resData.forEach((item, index) => {
            item.key = current * 10 - 10 + index + 1
            this.dataList.push(item)
            // this.dataList['key']=
          })
          this.isShowTable = true
          console.log(this.dataList, 'dataList')
          this['SET_CLICK'](false)
        })
        .catch(err => {
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
    getHandleInfo(params) {
      this.$store.commit('SET_CLICK', true)
      return new Promise((resolve, reject) => {
        this.$apis
          .getTransferInfo(params)
          .then(res => {
            this.transferInfo = res
            this.$store.commit('SET_CLICK', false)
            resolve(res)
          })
          .catch(err => {
            console.log(err, 'err')
            reject(err)
          })
      })
    },
    singleHandleFn(row) {
      let params = {
        transfer_no: row.transfer_no,
        check_type: 1
      }
      this.getHandleInfo(params).then(res => {
        this.batchHandleVisible = true
      })
      this.handleParams = params
      this.handleTitle = '处理操作确认'
    },
    batchHandleFn() {
      if (this.selectedRows.length > 0) {
        let transfer_no_list = this.selectedRows.map(item => item.transfer_no).join(',')
        let params = {
          transfer_no_list,
          check_type: 2
        }
        this.getHandleInfo(params).then(res => {
          this.batchHandleVisible = true
        })
        this.handleParams = params
        this.handleTitle = '批量处理'
      } else {
        this.$message.warning('请选择要处理的数据')
      }
    },
    batchExportFn() {
      if (this.selectedRows.length > 0) {
        let transfer_no_list = this.selectedRows.map(item => item.transfer_no).join(',')
        let params = {
          transfer_no_list,
          check_type: 2
        }
        this.getHandleInfo(params).then(res => {
          this.exportVisible = true
          this.handleParams = { transfer_no_list }
        })
      } else {
        this.$message.warning('请选择要导出的数据')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../style/init.less');
.right-button-wrap {
  display: flex;
}
</style>
