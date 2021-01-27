<template>
  <div class="banner-list">
    <div class="search-area">
      <a-form layout="inline" @submit="handleSubmit" style="marginbottom: 20px;">
        <a-form-item label="关键字">
          <a-input style="width: 260px;" v-model="queryParam.keyword" placeholder="用户名（UserId）、姓名或账号名"></a-input>
        </a-form-item>
        <a-form-item label="账户是否激活">
          <a-select
            v-model="queryParam.is_activity"
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            style="width: 140px;"
            placeholder="请选择"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option :value="index + 1" :key="index" v-for="(item, index) in AVTIVITY_STATUS">{{ item }}</a-select-option>
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
      <template slot="is_activity" slot-scope="text">
        {{ AVTIVITY_STATUS[text - 1] }}
      </template>
      <template slot="futures_login_id" slot-scope="text">
        {{ text ? text : '-' }}
      </template>
      <template slot="hk_account" slot-scope="text, record">
        <div class="tl" v-if="record.hk_account_open">
          <div v-if="record.hk_account_open == 1">
            <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" class="mr-5" />
            <span class="mr-10">开通</span>
            <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" class="mr-5" v-if="record.hk_account_use == 1" />
            <a-icon type="check-circle" theme="twoTone" twoToneColor="#ff6100" class="mr-5" v-else />
            <span v-if="record.hk_account_use == 1">可用</span>
            <span v-else>不可用</span>
          </div>
          <div v-else><a-icon type="close-circle" theme="twoTone" twoToneColor="#f81d22" class="mr-5" /> 开通失败</div>
        </div>
        <span v-else>-</span>
      </template>
      <template slot="hq_account" slot-scope="text, record">
        <div class="tl" v-if="record.hq_account_open">
          <div v-if="record.hq_account_open == 1">
            <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" class="mr-5" />
            <span class="mr-10">开通</span>
            <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" class="mr-5" v-if="record.hq_account_use == 1" />
            <a-icon type="check-circle" theme="twoTone" twoToneColor="#ff6100" class="mr-5" v-else />
            <span v-if="record.hq_account_use == 1">可用</span>
            <span v-else>不可用</span>
          </div>
          <div v-else><a-icon type="close-circle" theme="twoTone" twoToneColor="#f81d22" class="mr-5" /> 开通失败</div>
        </div>
        <span v-else>-</span>
      </template>
      <template slot="lx_login_id" slot-scope="text">
        {{ text ? text : '-' }}
      </template>
      <template slot="lx_account" slot-scope="text, record">
        <div class="tl" v-if="record.lx_account_open">
          <div v-if="record.lx_account_open == 1">
            <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" class="mr-5" />
            <span class="mr-10">开通</span>
            <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" class="mr-5" v-if="record.lx_account_use == 1" />
            <a-icon type="check-circle" theme="twoTone" twoToneColor="#ff6100" class="mr-5" v-else />
            <span v-if="record.lx_account_use == 1">可用</span>
            <span v-else>不可用</span>
          </div>
          <div v-else><a-icon type="close-circle" theme="twoTone" twoToneColor="#f81d22" class="mr-5" /> 开通失败</div>
        </div>
        <span v-else>-</span>
      </template>
      <template slot="hk_account_list.created_at" slot-scope="text, record">
        {{
          record.hk_account_list.filter((item) => item.type == 2).length ? record.hk_account_list.filter((item) => item.type == 2)[0].created_at : '-'
        }}
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="flex-center">
          <a-button type="primary" size="small" @click="handleOpen(record)">人工开通</a-button>
          <a-divider type="vertical" />
          <a-button type="primary" ghost size="small" :disabled="record.is_activity != 2" @click="handleEnable(record)">激活</a-button>
          <!-- <a-divider type="vertical" />
          <a-button type="primary" size="small">账户权限</a-button> -->
        </div>
      </template>
    </a-table>
    <!-- 人工开通弹层 start -->
    <a-modal
      title="人工开通账户操作"
      :visible="showModal"
      :destroyOnClose="true"
      :maskClosable="false"
      :footer="null"
      @cancel="showModal = false"
      width="550px"
      :bodyStyle="{ minHeight: '150px' }"
    >
      <open-modal-content :info="info" :is-need-reload.sync="isNeedReload" :show-modal.sync="showModal" />
    </a-modal>
    <!-- 弹层 end -->
    <active-modal-content :info="info" :is-need-reload.sync="isNeedReload" :show-active-modal.sync="showActiveModal" />
  </div>
</template>

<script>
import { Icon, Modal } from 'ant-design-vue'
import { list } from '@/components/mixins/getList'
import OpenModalContent from './components/OpenModalContent'
import ActiveModalContent from './components/ActiveModalContent'

export default {
  components: {
    OpenModalContent,
    ActiveModalContent,
    [Icon.name]: Icon,
    [Modal.name]: Modal,
  },
  mixins: [list],
  data() {
    return {
      AVTIVITY_STATUS: ['已激活', '待激活', '未激活'],
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'key',
          align: 'center',
          width: '5%',
        },
        {
          title: 'UserId',
          dataIndex: 'user_info.user_id',
          align: 'center',
          width: '7%',
        },
        {
          title: '姓名/机构名(中)',
          dataIndex: 'real_name',
          align: 'center',
          width: '10%',
        },
        {
          title: '是否激活',
          dataIndex: 'is_activity',
          align: 'center',
          width: '7%',
          scopedSlots: { customRender: 'is_activity' },
        },
        {
          title: '期货账号',
          dataIndex: 'futures_login_id',
          align: 'center',
          width: '10%',
          scopedSlots: { customRender: 'futures_login_id' },
        },
        {
          title: '香港期货权限',
          dataIndex: 'hk_account',
          align: 'center',
          width: '15%',
          scopedSlots: { customRender: 'hk_account' },
        },
        {
          title: '环球期货权限',
          dataIndex: 'hq_account',
          align: 'center',
          width: '15%',
          scopedSlots: { customRender: 'hq_account' },
        },
        // {
        //   title: '连续合约账号',
        //   dataIndex: 'lx_login_id',
        //   align: 'center',
        //   width: '8%',
        //   scopedSlots: { customRender: 'lx_login_id' }
        // },
        // {
        //   title: '连续合约权限',
        //   dataIndex: 'lx_account',
        //   align: 'center',
        //   width: '11%',
        //   scopedSlots: { customRender: 'lx_account' }
        // },
        {
          title: '期货账户时间',
          dataIndex: 'hk_account_list.created_at',
          align: 'center',
          width: '12%',
          scopedSlots: { customRender: 'hk_account_list.created_at' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      showActiveModal: false,
      info: {},
      showModal: false,
      isNeedReload: false,
    }
  },
  watch: {
    isNeedReload(newVal) {
      if (newVal) {
        this.getList()
      }
    },
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList(query) {
      const { current, pageSize } = this.pagination
      let params = Object.assign(
        {
          mb: 2,
          page: current,
          page_size: pageSize,
        },
        this.queryParam,
        query
      )

      this['SET_CLICK'](true)
      this.$apis
        .get_account_list(params)
        .then((res) => {
          this.pagination.total = res.total
          this.dataList = [...res.data]

          this.dataList.forEach((item, index) => {
            item.key = (current - 1) * pageSize + index + 1
            const hk_account_list = item.hk_account_list
            const futures_login_id = hk_account_list.filter((_item) => _item.type == 2).length
              ? hk_account_list.filter((_item) => _item.type == 2)[0].futures_login_id
              : ''
            item.futures_login_id = futures_login_id

            const lx_account_list = item.lx_account_list
            const lx_login_id = lx_account_list.filter((item) => item.type == 2).length
              ? lx_account_list.filter((item) => item.type == 2)[0].mt4_login_id
              : ''
            item.lx_login_id = lx_login_id
          })
          this['SET_CLICK'](false)
        })
        .catch((err) => {
          this['SET_CLICK'](false)
        })
    },
    handleOpen(info) {
      this.info = info
      this.showModal = true
    },
    handleEnable(info) {
      this.$apis
        .get_account_info({
          qh_account: info.futures_login_id,
          lx_account: info.lx_login_id,
        })
        .then((res) => {
          this.info = Object.assign(info, res)
          this.showActiveModal = true
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>

<style lang="less" scoped>
@import url('../../style/init.less');
</style>
