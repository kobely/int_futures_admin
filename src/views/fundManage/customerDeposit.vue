<template>
  <div class="customer-deposit">
    <div class="search-area">
      <a-form layout="inline" style="marginbottom: 20px;" @submit="handleSubmit">
        <a-form-item label="">
          <a-input style="width: 285px;" v-model="queryParam.keyword" placeholder="服务单号/用户名(UserId)/姓名/账户号"></a-input>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.pay_type"
            style="width: 140px;"
            placeholder="入金方式"
            :allowClear="true"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
          >
            <a-select-option value="1">汇款</a-select-option>
            <a-select-option value="2">划转</a-select-option>
            <a-select-option value="3">录入</a-select-option>
            <a-select-option value="4">换汇</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.remittance_currency"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 140px;"
            placeholder="入金币种"
            :allowClear="true"
          >
            <a-select-option value="CNY">人民币</a-select-option>
            <a-select-option value="USD">美元</a-select-option>
            <a-select-option value="HKD">港币</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="">
          <a-range-picker format="YYYY-MM-DD" :placeholder="['起始时间', '结束时间']" v-model="rangeTime"></a-range-picker>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.order_status"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 140px;"
            placeholder="订单状态"
            :allowClear="true"
          >
            <a-select-option value="0">待处理</a-select-option>
            <a-select-option value="1">处理成功</a-select-option>
            <a-select-option value="2">处理失败</a-select-option>
            <a-select-option value="3">自动处理</a-select-option>
            <a-select-option value="4">退款到账</a-select-option>
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
        <a-button type="primary" @click="inputOrder">录入订单</a-button>
      </div>
    </div>
    <a-table :columns="columns" :dataSource="dataList" :pagination="pagination" :loading="clickable" :scroll="{ y: tableHeight }" bordered>
      <template slot="operation" slot-scope="text, record">
        <div class="flex-center">
          <a-button type="primary" ghost size="small" @click="handleView(record)">查看</a-button>
          <a-divider type="vertical" />
          <a-button type="primary" size="small" :disabled="record.order_status != 0" @click="handleOrder(record)">处理</a-button>
        </div>
      </template>
    </a-table>
    <create-order :inputVisible.sync="inputVisible"></create-order>
  </div>
</template>

<script>
import { DatePicker, Modal } from 'ant-design-vue'
import { list } from '@/components/mixins/getList'
import columns from './table-utils/customerDeposit'
import CreateOrder from './components/createOrder'

export default {
  components: {
    CreateOrder,
    [DatePicker.name]: DatePicker,
    [DatePicker.RangePicker.name]: DatePicker.RangePicker,
    [Modal.name]: Modal
  },
  mixins: [list],
  data() {
    return {
      addStatus: false,
      inputVisible: false,
      // 表头
      columns,
      statementType: '',
      rangeTime: []
    }
  },
  watch: {
    rangeTime(newVal) {
      let rangeTime = {}
      console.log(newVal, 'newVal')
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
    },
    isNeedReload(newVal) {
      if (newVal) {
        this.getList()
      }
    }
  },
  mounted() {
    this.getList()
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
        .getFundList(params)
        .then(res => {
          this.dataList = []
          let resData = res.data
          this.pagination.total = res.total
          resData.forEach((item, index) => {
            item.key = current * 10 - 10 + index + 1
            this.dataList.push(item)
          })
          console.log(this.dataList, 'dataList')
          this['SET_CLICK'](false)
        })
        .catch(err => {
          this['SET_CLICK'](false)
        })
    },
    addSuccess(val) {
      console.log(val, '录入状态')
    },
    // 查看结算单
    handleView(record) {
      this.$router.push(`/fundManage/depositHandle?recordId=${record.record_id}&isEdit=0`)
    },
    // 处理订单
    handleOrder(record) {
      this.$router.push(`/fundManage/depositHandle?recordId=${record.record_id}&isEdit=1`)
    },
    // 录入订单
    inputOrder() {
      this.inputVisible = true
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
.email-send-confirm {
  p {
    line-height: 2;
  }
  .email-send-result {
    font-size: 12px;
    .success {
      color: #ff0000;
    }
    .fail {
      color: #ff6600;
    }
  }
}
</style>
