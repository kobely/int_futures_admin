<template>
  <div class="banner-list">
    <div class="search-area">
      <a-form layout="inline" @submit="handleSubmit" style="marginbottom: 20px;">
        <a-form-item label="关键字">
          <a-input style="width: 260px;" v-model="queryParam.keyword" placeholder="用户名（UserId）、姓名或邮箱"></a-input>
        </a-form-item>
        <a-form-item label="身份核验结果">
          <a-select
            v-model="queryParam.is_verify"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 140px;"
            placeholder="请选择"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="0">待核验</a-select-option>
            <a-select-option value="1">不通过</a-select-option>
            <a-select-option value="2">通过</a-select-option>
          </a-select>
        </a-form-item>
        <!-- <a-form-item label="账户是否激活">
          <a-select v-model="queryParam.is" :getPopupContainer="triggerNode => triggerNode.parentNode" style="width: 140px;" placeholder="请选择">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="">已激活</a-select-option>
            <a-select-option value="">待激活</a-select-option>
          </a-select>
        </a-form-item> -->
        <a-form-item>
          <a-button type="primary" html-type="submit" :disabled="clickable">
            搜索
          </a-button>
          <a-button style="margin-left: 8px;" @click="resetQuery" :disabled="clickable">重置</a-button>
        </a-form-item>
      </a-form>
      <a-button type="primary" @click="$router.push('/userManage/openAccount')">新增个人开户</a-button>
    </div>
    <a-table :columns="columns" :dataSource="dataList" :pagination="pagination" :loading="clickable" :scroll="{ y: tableHeight }" bordered>
      <template slot="hk_account_open" slot-scope="text">
        <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" v-if="text == 1" />
        <a-icon type="close-circle" theme="twoTone" twoToneColor="#f81d22" v-else />
      </template>
      <template slot="hq_account_open" slot-scope="text">
        <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" v-if="text == 1" />
        <a-icon type="close-circle" theme="twoTone" twoToneColor="#f81d22" v-else />
      </template>
      <template slot="lx_account_open" slot-scope="text">
        <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" v-if="text == 1" />
        <a-icon type="close-circle" theme="twoTone" twoToneColor="#f81d22" v-else />
        <!-- <a-icon type="close-circle" theme="twoTone" twoToneColor="#ff6100" /> -->
      </template>
      <template slot="account_active">
        <span>已激活</span>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="flex-center">
          <a-button type="primary" size="small" @click="goDetailPage(record.id)">账户操作</a-button>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'
import { list } from '@/components/mixins/getList'
import { COUNTRY, VERIFY_STATUS } from '@/utils/const'

export default {
  components: {
    [Icon.name]: Icon
  },
  mixins: [list],
  data() {
    return {
      COUNTRY,
      VERIFY_STATUS,
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
          dataIndex: 'user_info.user_id',
          align: 'center',
          width: '8%'
        },
        {
          title: '中文名',
          dataIndex: 'real_name',
          align: 'center',
          width: '7%'
        },
        {
          title: '英文名',
          dataIndex: 'english_name',
          align: 'center',
          width: '7%'
        },
        {
          title: '国籍',
          dataIndex: 'nationality_name',
          align: 'center',
          width: '7%',
          customRender(value, row) {
            return value ? value : '-'
          }
        },
        {
          title: '电话',
          dataIndex: 'user_info.phone',
          align: 'center',
          width: '8%',
          scopedSlots: { customRender: 'user_info.phone' },
          customRender(value, row) {
            const phone = value ? '+' + row.user_info.zone_code + ' ' + value : '-'
            return phone
          }
        },
        {
          title: '邮箱',
          dataIndex: 'user_info.email',
          align: 'center',
          width: '8%'
        },
        {
          title: '身份核验结果',
          dataIndex: 'is_verify',
          align: 'center',
          width: '6%',
          customRender(value, row) {
            return VERIFY_STATUS[value]
          }
        },
        {
          title: '香港期货',
          dataIndex: 'hk_account_open',
          align: 'center',
          width: '6%',
          scopedSlots: { customRender: 'hk_account_open' }
        },
        {
          title: '环球期货',
          dataIndex: 'hq_account_open',
          align: 'center',
          width: '6%',
          scopedSlots: { customRender: 'hq_account_open' }
        },
        // {
        //   title: '连续合约',
        //   dataIndex: 'lx_account_open',
        //   align: 'center',
        //   width: '6%',
        //   scopedSlots: { customRender: 'lx_account_open' }
        // },
        // {
        //     title: '是否激活账户',
        //     dataIndex: 'account_active',
        //     align: 'center',
        //     width: '6%',
        //     scopedSlots: { customRender: 'account_active' }
        // },
        {
          title: '是否代开户',
          dataIndex: 'is_admin',
          align: 'center',
          width: '8%',
          customRender(value, row, index) {
            return row.user_info.is_admin ? '是' : '否'
          }
        },
        {
          title: '业务受理编号',
          dataIndex: 'acceptance_sn',
          align: 'center',
          width: '8%'
        },
        {
          title: '提交时间',
          dataIndex: 'created_at',
          align: 'center',
          width: '8%'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  // mounted() {
  //     this.getList()
  // },
  methods: {
    getList(query) {
      const { current, pageSize } = this.pagination
      let params = Object.assign(
        {
          mb: 0,
          page: current,
          page_size: pageSize
        },
        this.queryParam,
        query
      )

      this['SET_CLICK'](true)
      this.$apis
        .get_account_list(params)
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
    goDetailPage(id) {
      sessionStorage.setItem('query', JSON.stringify(this.queryParam))
      this.$router.push('/userManage/userDetail/' + id)
    }
  }
}
</script>

<style lang="less" scoped></style>
