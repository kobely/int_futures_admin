<template>
  <div class="fund-flow">
    <div class="search-area">
      <a-form layout="inline" @submit="handleSubmit" style="marginbottom: 20px;">
        <a-form-item label="">
          <a-range-picker format="YYYY-MM-DD" :placeholder="['起始时间', '结束时间']" inputReadOnly v-model="rangeTime"></a-range-picker>
        </a-form-item>
        <a-form-item label="">
          <a-input style="width: 260px;" v-model="queryParam.keyword" placeholder="请输入姓名/机构名"></a-input>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.order_type"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 140px;"
            :allowClear="true"
            placeholder="订单类型"
          >
            <a-select-option value="79">出金</a-select-option>
            <a-select-option value="73">入金</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.pay_type"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 140px;"
            :allowClear="true"
            placeholder="出入金方式"
          >
            <a-select-option value="49">转账</a-select-option>
            <a-select-option value="50">支票</a-select-option>
            <a-select-option value="51">现金</a-select-option>
            <a-select-option value="52">换汇</a-select-option>
            <a-select-option value="53">银期转换</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.currency_no"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 140px;"
            :allowClear="true"
            placeholder="币种"
          >
            <a-select-option value="USD">USD</a-select-option>
            <a-select-option value="HKD">HKD</a-select-option>
            <a-select-option value="CNY">CNY</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :disabled="clickable">
            搜索
          </a-button>
          <a-button style="margin-left: 8px;" @click="resetQuery" :disabled="clickable">重置</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-table
      :columns="columns"
      :dataSource="dataList"
      :pagination="pagination"
      :loading="clickable"
      :scroll="{ x: 900, y: 600 }"
      rowKey="serial_id"
      bordered
    >
    </a-table>
  </div>
</template>

<script>
import { DatePicker, Modal } from 'ant-design-vue'
import { list } from '@/components/mixins/getList'
import columns from './table-utils/flowList'
import moment from 'moment'

export default {
  components: {
    [DatePicker.name]: DatePicker,
    [DatePicker.RangePicker.name]: DatePicker.RangePicker,
    [Modal.name]: Modal
  },
  mixins: [list],
  data() {
    return {
      // 表头
      columns,
      rangeTime: [],
      operateType: '',
      loading: false
    }
  },
  mounted() {
    this.getList()
  },
  watch: {
    rangeTime(newVal) {
      let rangeTime = {}
      if (newVal.length) {
        rangeTime = {
          start_date: newVal[0].format('YYYY-MM-DD'),
          end_date: newVal[1].format('YYYY-MM-DD')
        }
      } else {
        rangeTime.start_date = ''
        rangeTime.end_date = ''
      }
      this.queryParam = {
        ...this.queryParam,
        ...rangeTime
      }
    }
  },
  methods: {
    getList(query) {
      const { current, pageSize } = this.pagination
      const { currency, date } = this.$route.query
      if (currency && date) {
        this.queryParam.currency_no = currency
        this.queryParam.start_date = date
        this.queryParam.end_date = date
        this.rangeTime = [moment(date), moment(date)]

        this.$router.replace(this.$route.path)
      }

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
        .getFlowList(params)
        .then(res => {
          this.dataList = []
          this.pagination.total = res.total_no
          let resData = res.cashs
          resData.forEach((item, index) => {
            this.dataList.push(item)
            item.key = current * 10 - 10 + index + 1
          })
          this['SET_CLICK'](false)
        })
        .catch(err => {
          this['SET_CLICK'](false)
        })
    },
    // 查看结算单
    handleView(url) {
      window.open(url)
    },
    // 重置
    resetQuery() {
      this.rangeTime = []
      this.queryParam = {}
      this.pagination.current = 1
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../style/init.less');
/deep/ .ant-calendar-picker {
  width: 300px !important;
}
.right-button-wrap {
  display: flex;
  flex-wrap: wrap;
}
</style>
