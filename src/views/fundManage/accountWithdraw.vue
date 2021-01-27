<template>
  <div class="banner-list">
    <div class="search-area">
      <a-form layout="inline" @submit="handleSubmit" style="marginbottom: 20px">
        <a-form-item label="">
          <a-input style="width: 260px" v-model="queryParam.keyword" placeholder="服务单号、用户名(UserID)、姓名、账户号、银行卡号">
            <a-tooltip slot="suffix" title="服务单号、用户名(UserID)、姓名、账户号、银行卡号">
              <a-icon type="info-circle" style="color: rgba(0, 0, 0, 0.45)" />
            </a-tooltip>
          </a-input>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.pay_type"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 140px"
            placeholder="出金方式"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option :value="index + 1" v-for="(item, index) in WITHDRAW_METHORD" :key="index">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.remittance_currency"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 140px"
            placeholder="出金币种"
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
            :placeholder="['起始时间', '结束时间']"
            inputReadOnly
            v-model="rangeTime"
            @panelChange="handlePanelChange"
          ></a-range-picker>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.order_status"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 160px"
            placeholder="订单状态"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option :value="index" v-for="(item, index) in ORDER_STATUS" :key="index">{{ item }}</a-select-option>
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
      <template slot="pay_type" slot-scope="text">
        {{ WITHDRAW_METHORD[text - 1] }}
      </template>
      <template slot="order_status" slot-scope="text">
        {{ ORDER_STATUS[text] }}
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="flex-center">
          <a-button type="primary" ghost size="small" @click="$router.push('withdraw-detail?isView=1&record_id=' + record.record_id)">查看</a-button>
          <a-divider type="vertical" />
          <a-button
            type="primary"
            size="small"
            :disabled="record.order_status != 0"
            @click="$router.push('withdraw-detail?record_id=' + record.record_id)"
            >处理</a-button
          >
        </div>
      </template>
    </a-table>

    <!-- 批量发送邮件 -->
    <a-modal
      title="录入客户资金订单"
      :visible="showModal"
      :destroyOnClose="true"
      :maskClosable="false"
      :footer="null"
      width="800px"
      @cancel="showModal = false"
    >
      <entry-order :show-modal.sync="showModal" :is-need-reload.sync="isNeedReload" />
    </a-modal>
  </div>
</template>

<script>
import { DatePicker, Icon, Modal, Tooltip } from 'ant-design-vue'
import { list } from '@/components/mixins/getList'
import EntryOrder from './components/EntryOrder'

export default {
  components: {
    EntryOrder,
    [DatePicker.name]: DatePicker,
    [DatePicker.RangePicker.name]: DatePicker.RangePicker,
    [Icon.name]: Icon,
    [Modal.name]: Modal,
    [Tooltip.name]: Tooltip
  },
  mixins: [list],
  data() {
    return {
      WITHDRAW_METHORD: ['汇款', '划转', '录入', '换汇'],
      ORDER_STATUS: ['待处理', '处理成功', '处理失败', '自动处理', '退款到账'],
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'key',
          align: 'center',
          width: '5%'
        },
        {
          title: '资金单号',
          dataIndex: 'funds_no',
          align: 'center',
          width: '8%'
        },
        {
          title: 'UserId',
          dataIndex: 'user_id',
          align: 'center',
          width: '6%'
        },
        {
          title: '姓名/机构名(中)',
          dataIndex: 'remitter_name',
          align: 'center',
          width: '7%'
        },
        {
          title: '账户号',
          dataIndex: 'funds_account',
          align: 'center',
          width: '7%'
        },
        {
          title: '出金方式',
          dataIndex: 'pay_type',
          align: 'center',
          width: '6%',
          scopedSlots: { customRender: 'pay_type' }
        },
        {
          title: '出金币种',
          dataIndex: 'remittance_currency',
          align: 'center',
          width: '6%'
        },
        {
          title: '出金金额',
          dataIndex: 'amount',
          align: 'center',
          width: '8%'
        },
        {
          title: '预计到账',
          dataIndex: 'received_amount',
          align: 'center',
          width: '8%'
        },
        {
          title: '手续费',
          dataIndex: 'handling_fee',
          align: 'center',
          width: '8%'
        },
        {
          title: '出金银行卡',
          dataIndex: 'payee_account',
          align: 'center',
          width: '8%',
          customRender(value, row) {
            const payee_account = value ? value : '-'
            return payee_account
          }
        },
        {
          title: '订单状态',
          dataIndex: 'order_status',
          align: 'center',
          width: '7%',
          scopedSlots: { customRender: 'order_status' }
        },
        {
          title: '出金时间',
          dataIndex: 'created_at',
          align: 'center',
          width: '8%',
          customRender(value, row) {
            const createdDate = value ? value : '-'
            return createdDate
          }
        },
        {
          title: '申请人',
          dataIndex: 'applicant_info_name',
          align: 'center',
          width: '7%',
          customRender(value, row) {
            const applicantName = row.applicant_info && row.applicant_info.name ? row.applicant_info.name : '-'
            return applicantName
          }
        },
        {
          title: '审批时间',
          dataIndex: 'updated_at',
          align: 'center',
          width: '8%',
          customRender(value, row) {
            const handle_at = row.order_status == 0 ? '-' : value
            return handle_at
          }
        },
        {
          title: '审批人',
          dataIndex: 'handler_info_name',
          align: 'center',
          width: '7%',
          customRender(value, row) {
            const handlerName = row.handler_info && row.handler_info.name ? row.handler_info.name : '-'
            return handlerName
          }
        },
        {
          title: '到账时间',
          dataIndex: 'received_at',
          align: 'center',
          width: '8%',
          customRender(value, row) {
            const received_at = value ? value : '-'
            return received_at
          }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          width: '180px',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      rangeTime: [],
      showModal: false,
      isNeedReload: false
    }
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
        .get_withdraw_list(params)
        .then(res => {
          this.pagination.total = res.total
          this.dataList = [...res.data]

          this.isNeedReload = false
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
