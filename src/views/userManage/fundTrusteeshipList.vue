<template>
  <div class="banner-list">
    <div class="search-area">
      <a-form layout="inline" @submit="handleSubmit">
        <a-form-item label="关键字">
          <a-input style="width: 260px;" v-model="queryParam.keyword" placeholder="用户名（UserId）、姓名或账户号"></a-input>
        </a-form-item>
        <a-form-item label="处理情况">
          <a-select v-model="queryParam.status" :getPopupContainer="triggerNode => triggerNode.parentNode" style="width: 140px;" placeholder="请选择">
            <a-select-option value="">全部</a-select-option>
            <a-select-option v-for="(item, index) in STATUS" :value="index" :key="index">{{ item }}</a-select-option>
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
    <a-table :columns="columns" :dataSource="dataList" :pagination="pagination" :loading="clickable" :scroll="{ y: tableHeight }" bordered>
      <template slot="payee_sub_account" slot-scope="text">
        {{ text ? text : '-' }}
      </template>
      <template slot="status" slot-scope="text">
        {{ STATUS[text] }}
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="flex-center">
          <a-button type="primary" ghost size="small" class="copy-btn" :data-clipboard-target="'#digitAmount' + record.key">
            复制
          </a-button>
          <p :id="'digitAmount' + record.key" style="width: 1px;height: 1px;overflow: hidden;opacity: 0">
            <span>{{ record.user_id }}</span>
            <span>{{ record.real_name }}</span>
            <span>{{ record.english_name }}</span>
            <span>{{ record.receiver_bank_cn }}</span>
            <span>{{ record.swift_code }}</span>
            <span>{{ record.bank_code }}</span>
            <span>{{ record.payee_name }}</span>
            <span>{{ record.payee_sub_account }}</span>
          </p>
          <a-divider type="vertical" />
          <a-button type="primary" size="small" :disabled="record.status == 1" @click="handleOpen(record)">
            开通
          </a-button>
        </div>
      </template>
    </a-table>

    <!-- 开通资金托管银行子账号 -->
    <a-modal
      title="开通资金托管银行子账号"
      :visible="showModal"
      :destroyOnClose="true"
      :maskClosable="false"
      :footer="null"
      width="500px"
      @cancel="showModal = false"
    >
      <fund-open-modal :info="info" :is-need-reload.sync="isNeedReload" :show-modal.sync="showModal" />
    </a-modal>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import { Modal, message } from 'ant-design-vue'
import { list } from '@/components/mixins/getList'
import FundOpenModal from './components/FundOpenModal'

var clipboard = new Clipboard('.copy-btn')
clipboard.on('success', function(e) {
  message.success('复制成功！')

  e.clearSelection()
})
clipboard.on('error', function(e) {
  message.success('制失败，请手动选择复制！')
})

export default {
  mixins: [list],
  components: {
    FundOpenModal,
    [Modal.name]: Modal
  },
  data() {
    return {
      STATUS: ['待开通', '已开通'],
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'key',
          align: 'center',
          width: '5%'
        },
        {
          title: 'UserId',
          dataIndex: 'user_id',
          align: 'center',
          width: '7%'
        },
        {
          title: '姓名/机构名(中)',
          dataIndex: 'real_name',
          align: 'center',
          width: '10%'
        },
        {
          title: '姓名/机构名(英)',
          dataIndex: 'english_name',
          align: 'center',
          width: '10%'
        },
        {
          title: '收款银行',
          dataIndex: 'receiver_bank_cn',
          align: 'center',
          width: '10%'
        },
        {
          title: 'SWIFT Code',
          dataIndex: 'swift_code',
          align: 'center',
          width: '8%'
        },
        {
          title: 'Bank Code',
          dataIndex: 'bank_code',
          align: 'center',
          width: '7%'
        },
        {
          title: '收款人名称',
          dataIndex: 'payee_name',
          align: 'center',
          width: '10%'
        },
        {
          title: '收款账号',
          dataIndex: 'payee_sub_account',
          align: 'center',
          width: '10%',
          scopedSlots: { customRender: 'payee_sub_account' }
        },
        {
          title: '处理情况',
          dataIndex: 'status',
          align: 'center',
          width: '8%',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      info: {},
      showModal: false,
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
          mb: 1,
          page: current,
          page_size: pageSize
        },
        this.queryParam,
        query
      )

      this['SET_CLICK'](true)
      this.$apis
        .get_sub_account_list(params)
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
    handleOpen(info) {
      this.info = info
      this.showModal = true
    }
  }
}
</script>

<style lang="less" scoped></style>
