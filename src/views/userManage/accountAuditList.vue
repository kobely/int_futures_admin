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
      <template slot="is_verify" slot-scope="text">
        <span>{{ VERIFY_STATUS[text] }}</span>
      </template>
      <template slot="open_status" slot-scope="text">
        <span>{{ COUNTRY[text - 1] }}</span>
      </template>
      <template slot="user_info.phone" slot-scope="text, record">
        <span>{{ text ? '+' + record.user_info.zone_code + ' ' + text : '-' }}</span>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="flex-center">
          <a-button type="primary" size="small" @click="goDetailPage(record.id)">
            核验
          </a-button>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import { list } from '@/components/mixins/getList'
import { COUNTRY, VERIFY_STATUS } from '@/utils/const'

export default {
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
          title: '业务受理号',
          dataIndex: 'acceptance_sn',
          align: 'center',
          width: '10%'
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
          width: '9%'
        },
        {
          title: '英文名',
          dataIndex: 'english_name',
          align: 'center',
          width: '9%'
        },
        {
          title: '国籍',
          dataIndex: 'nationality_name',
          align: 'center',
          width: '8%',
          customRender(value, row) {
            return value ? value : '-'
          }
        },
        {
          title: '电话',
          dataIndex: 'user_info.phone',
          align: 'center',
          width: '8%',
          scopedSlots: { customRender: 'user_info.phone' }
        },
        {
          title: '邮箱',
          dataIndex: 'user_info.email',
          align: 'center',
          width: '10%'
        },
        {
          title: '身份核验结果',
          dataIndex: 'is_verify',
          align: 'center',
          width: '8%',
          scopedSlots: { customRender: 'is_verify' }
        },
        {
          title: '提交时间',
          dataIndex: 'created_at',
          align: 'center',
          width: '11%'
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
          mb: 1,
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
      this.$router.push('/userManage/accountAuditDetail/' + id)
    }
  }
}
</script>

<style lang="less" scoped></style>
