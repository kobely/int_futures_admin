<template>
  <div class="banner-list">
    <div class="search-area">
      <a-form layout="inline" @submit="handleSubmit" style="marginbottom: 20px">
        <a-form-item label="">
          <a-input style="width: 260px" v-model="queryParam.keyword" placeholder="服务单号、用户名(UserID)、姓名、账户号、资金单号">
            <a-tooltip slot="suffix" title="服务单号、用户名(UserID)、姓名、账户号、资金单号">
              <a-icon type="info-circle" style="color: rgba(0, 0, 0, 0.45)" />
            </a-tooltip>
          </a-input>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.currency_out"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 140px"
            placeholder="换出币种"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="USD">USD</a-select-option>
            <a-select-option value="HKD">HKD</a-select-option>
            <a-select-option value="CNY">CNY</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.currency_in"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 140px"
            placeholder="换入币种"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="USD">USD</a-select-option>
            <a-select-option value="HKD">HKD</a-select-option>
            <a-select-option value="CNY">CNY</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="">
          <a-range-picker
            format="YYYY-MM-DD"
            :mode="['date', 'date']"
            :placeholder="['起始日期', '结束日期']"
            inputReadOnly
            v-model="rangeTime"
            @panelChange="handlePanelChange"
          ></a-range-picker>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.status"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 160px"
            placeholder="处理情况"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option :value="index" v-for="(item, index) in DEAL_STATUS" :key="index">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :disabled="clickable"> 搜索 </a-button>
          <a-button style="margin-left: 8px" @click="resetQuery" :disabled="clickable">重置</a-button>
        </a-form-item>
      </a-form>
      <div class="right-button-wrap">
        <a-button type="primary" @click="showModal = true">录入订单</a-button>
      </div>
    </div>
    <a-table :columns="columns" :dataSource="dataList" :pagination="pagination" :loading="clickable" :scroll="{ x: 1920, y: tableHeight }" bordered>
      <template slot="status" slot-scope="text">
        {{ DEAL_STATUS[text] }}
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="flex-center">
          <a-button type="primary" ghost size="small" @click="handleOperate(record.transfer_no, 'view')">查看</a-button>
          <a-divider type="vertical" />
          <a-button type="primary" size="small" :disabled="record.status != 0" @click="handleOperate(record.transfer_no, 'deal')">处理</a-button>
        </div>
      </template>
    </a-table>

    <!-- 录入 -->
    <swap-entry v-if="showModal" :visible.sync="showModal" />

    <!-- 处理/查看 -->
    <swap-view v-if="showViewModal" :visible.sync="showViewModal" :operate-type="operateType" :transfer-no="transferNo" />
  </div>
</template>

<script>
import { DatePicker, Icon, Tooltip } from 'ant-design-vue'
import { list } from '@/components/mixins/getList'
import columns from './table-utils/swap'
import SwapEntry from './components/SwapEntry'
import SwapView from './components/SwapView'

export default {
  components: {
    SwapEntry,
    SwapView,
    [DatePicker.name]: DatePicker,
    [DatePicker.RangePicker.name]: DatePicker.RangePicker,
    [Icon.name]: Icon,
    [Tooltip.name]: Tooltip
  },
  mixins: [list],
  data() {
    return {
      columns,
      DEAL_STATUS: ['待处理', '处理中', '成功', '失败', '已取消', '服务异常'],
      rangeTime: [],
      showModal: false,
      showViewModal: false,
      transferNo: '',
      operateType: ''
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
    handlePanelChange(value, mode) {
      this.rangeTime = value
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
        .get_exchange_list(params)
        .then(res => {
          this.pagination.total = res.total
          this.dataList = [...res.data]

          this.dataList.forEach((item, index) => {
            item.key = (current - 1) * pageSize + index + 1
          })
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
    // 去处理
    handleOperate(transferNo, operateType) {
      this.transferNo = transferNo
      this.showViewModal = true
      this.operateType = operateType
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
