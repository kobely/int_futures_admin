<template>
  <div class="banner-list">
    <div class="search-area">
      <a-form layout="inline" @submit="handleSubmit" style="marginbottom: 20px;">
        <a-form-item label="">
          <a-input style="width: 260px;" v-model="queryParam.keyword" placeholder="用户名（UserId）、姓名或账号名"></a-input>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.account_type"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 140px;"
            placeholder="账户类型"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="1">期货账户</a-select-option>
            <!-- <a-select-option value="3">连续合约账户</a-select-option> -->
          </a-select>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.statement_type"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 140px;"
            placeholder="结算单类型"
            @change="handleStatementTypeChange"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="1">日结单</a-select-option>
            <a-select-option value="2">月结单</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="" v-if="statementType">
          <a-range-picker
            :format="statementType == 1 ? 'YYYY-MM-DD' : 'YYYY-MM'"
            :mode="statementType == 1 ? ['date', 'date'] : ['month', 'month']"
            :placeholder="['起始时间', '结束时间']"
            inputReadOnly
            v-model="rangeTime"
            @panelChange="handlePanelChange"
          ></a-range-picker>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.email_status"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 160px;"
            placeholder="邮件发送状态"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="0">未发送</a-select-option>
            <a-select-option value="1">发送成功</a-select-option>
            <a-select-option value="2">发送失败</a-select-option>
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
        <a-button type="primary" @click="handleOperate('email')">批量发送邮件</a-button>
      </div>
    </div>
    <a-table :columns="columns" :dataSource="dataList" :pagination="pagination" :loading="clickable" :scroll="{ y: tableHeight }" bordered>
      <template slot="statement_type" slot-scope="text">
        <span>{{ STATE_TYPE[text] }}</span>
      </template>
      <template slot="account_type" slot-scope="text">
        <span>{{ ACCOUNT_TYPE[text] }}</span>
      </template>
      <template slot="email_status" slot-scope="text">
        <span>{{ EMAIL_STATUS[text] }}</span>
      </template>
      <template slot="email" slot-scope="text">
        <span>{{ text ? text : '-' }}</span>
      </template>
      <template slot="email_at" slot-scope="text">
        <span>{{ text ? text : '-' }}</span>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="flex-center">
          <a-button type="primary" ghost size="small" @click="handleView(record.pdf_url)">查看</a-button>
          <a-divider type="vertical" />
          <a-button type="primary" size="small" @click="handleSend(record)">发送邮件</a-button>
        </div>
      </template>
    </a-table>
    <!-- 发送邮件确认 start -->
    <a-modal
      title="重新发送邮件操作"
      :visible="showConfirmModal"
      :destroyOnClose="true"
      :maskClosable="false"
      ok-text="发送邮件"
      width="500px"
      :confirm-loading="loading"
      @cancel="showConfirmModal = false"
      @ok="handleConfirm"
      :bodyStyle="{ minHeight: '150px' }"
    >
      <div class="email-send-confirm">
        <p v-if="info.user_id">用户 {{ info.real_name }}（{{ info.user_id }}） {{ info.email }}</p>
        <p>邮件【高盈金融】 {{ info.statement_time }} {{ ACCOUNT_TYPE[info.account_type] }} {{ STATE_TYPE[info.statement_type] }}</p>
        <p class="email-send-result">
          <span class="fail" v-if="info.email_status == 2">* 原邮件发送失败，是否重新发送？</span>
          <span class="success" v-else-if="info.email_status == 1">* 检测到邮件已发送成功，是否重新发送？</span>
        </p>
      </div>
      <spin loading-desc="正在发送邮件" v-show="loading" />
    </a-modal>
    <!-- 发送邮件确认 end -->

    <!-- 批量发送邮件 -->
    <a-modal
      title="批量发送邮件"
      :visible="showModal"
      :destroyOnClose="true"
      :maskClosable="false"
      :footer="null"
      width="500px"
      :confirm-loading="loading"
      @cancel="showModal = false"
      :bodyStyle="{ minHeight: '150px' }"
    >
      <email-modal-content :is-need-reload.sync="isNeedReload" :show-modal.sync="showModal" />
    </a-modal>
  </div>
</template>

<script>
import { DatePicker, Modal } from 'ant-design-vue'
import { list } from '@/components/mixins/getList'
import EmailModalContent from './components/EmailModalContent'

export default {
  components: {
    EmailModalContent,
    [DatePicker.name]: DatePicker,
    [DatePicker.RangePicker.name]: DatePicker.RangePicker,
    [Modal.name]: Modal
  },
  mixins: [list],
  data() {
    return {
      STATE_TYPE: {
        1: '日结单',
        2: '月结单'
      },
      ACCOUNT_TYPE: {
        1: '香港期货',
        3: '连续合约'
      },
      EMAIL_STATUS: ['未发送', '发送成功', '发送失败'],
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'key',
          align: 'center',
          width: '5%'
        },
        // {
        //   title: '服务单号',
        //   dataIndex: 'server_sn',
        //   align: 'center',
        //   width: '8%'
        // },
        {
          title: '结算单编号',
          dataIndex: 'sn',
          align: 'center',
          width: '8%'
        },
        {
          title: '结算日期',
          dataIndex: 'statement_time',
          align: 'center',
          width: '7%'
        },
        {
          title: '结算单类型',
          dataIndex: 'statement_type',
          align: 'center',
          width: '7%',
          scopedSlots: { customRender: 'statement_type' }
        },
        {
          title: 'UserId',
          dataIndex: 'user_id',
          align: 'center',
          width: '6%'
        },
        {
          title: '姓名/机构名(中)',
          dataIndex: 'real_name',
          align: 'center',
          width: '7%'
        },
        {
          title: '账户类型',
          dataIndex: 'account_type',
          align: 'center',
          width: '8%',
          scopedSlots: { customRender: 'account_type' }
        },
        {
          title: '账户号',
          dataIndex: 'account_id',
          align: 'center',
          width: '7%'
        },
        {
          title: '用户邮箱',
          dataIndex: 'email',
          align: 'center',
          width: '8%',
          scopedSlots: { customRender: 'email' }
        },
        {
          title: '邮件发送状态',
          dataIndex: 'email_status',
          align: 'center',
          width: '8%',
          scopedSlots: { customRender: 'email_status' }
        },
        {
          title: '发送时间',
          dataIndex: 'email_at',
          align: 'center',
          width: '8%',
          scopedSlots: { customRender: 'email_at' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      statementType: '',
      rangeTime: [],
      operateType: '',
      info: {},
      showConfirmModal: false,
      showModal: false,
      loading: false,
      isNeedReload: false
    }
  },
  watch: {
    rangeTime(newVal) {
      let rangeTime = {}
      if (newVal.length) {
        rangeTime = {
          start_time: this.statementType == 1 ? newVal[0].format('YYYY-MM-DD') : newVal[0].format('YYYY-MM'),
          end_time: this.statementType == 1 ? newVal[1].format('YYYY-MM-DD') : newVal[1].format('YYYY-MM')
        }
      } else {
        rangeTime.start_time = ''
        rangeTime.end_time = ''
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
    handleStatementTypeChange(val) {
      this.rangeTime = []
      this.statementType = val
    },
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
        .get_statement_list(params)
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
    // 导入结算单、批量发送邮件
    handleOperate(type) {
      this.showModal = true
      this.operateType = type
    },
    // 查看结算单
    handleView(url) {
      window.open(url)
    },
    // 打开发送邮件弹层
    handleSend(info) {
      this.info = info
      this.showConfirmModal = true
    },
    // 发送邮件
    handleConfirm() {
      this.loading = true
      this.$apis
        .send_email({ id: this.info.id })
        .then(res => {
          this.isNeedReload = true
          this.showConfirmModal = false
          this.$toast.success('发送邮件成功')
        })
        .catch(err => {})
        .finally(() => {
          this.loading = false
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
