<template>
  <div class="banner-list">
    <div class="search-area">
      <a-form layout="inline" @submit="handleSubmit" style="marginbottom: 20px;">
        <a-form-item label="">
          <a-input style="width: 260px;" v-model="queryParam.keyword" placeholder="用户名（UserId）、姓名或账号名"></a-input>
        </a-form-item>
        <a-form-item label="">
          <a-select
            v-model="queryParam.is_activity"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 140px;"
            :allowClear="true"
            placeholder="账号是否激活"
          >
            <a-select-option value="1">已激活</a-select-option>
            <a-select-option value="2">待激活</a-select-option>
            <a-select-option value="3">未激活</a-select-option>
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
    <a-table :columns="columns" :dataSource="dataList" :pagination="pagination" :loading="clickable" rowKey="id" bordered> </a-table>
  </div>
</template>

<script>
import { DatePicker, Modal } from 'ant-design-vue'
import { list } from '@/components/mixins/getList'
import columns from './table-utils/accountFund'

export default {
  components: {
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
      columns,
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
        .accountList(params)
        .then(res => {
          this.dataList = []
          this.pagination.total = res.total
          let resData = res.data
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
