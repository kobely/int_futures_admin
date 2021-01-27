<template>
  <div class="banner-list">
    <div class="search-area">
      <a-form layout="inline" @submit="handleSubmit" style="marginbottom: 20px;">
        <a-form-item label="关键字">
          <a-input style="width: 260px;" v-model="queryParam.keyword" placeholder="用户名（UserId）、姓名、电话或邮箱"></a-input>
        </a-form-item>
        <a-form-item label="开户情况">
          <a-select
            v-model="queryParam.open_account_status"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 140px;"
            placeholder="请选择"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="1">已开户</a-select-option>
            <a-select-option value="0">未开户</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="账号状态">
          <a-select v-model="queryParam.status" :getPopupContainer="triggerNode => triggerNode.parentNode" style="width: 140px;" placeholder="请选择">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="1">可用</a-select-option>
            <a-select-option value="2">锁定</a-select-option>
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
      <template slot="from" slot-scope="text">
        <span>{{ FROM[text - 1] }}</span>
      </template>
      <template slot="register_type" slot-scope="text">
        <span>{{ REGISTERTYPE[text - 1] }}</span>
      </template>
      <template slot="operation">
        <div class="flex-center">
          <a-button type="primary" size="small">修改密码</a-button>
          <a-divider type="vertical" />
          <a-button type="primary" size="small">锁定账号</a-button>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import { list } from '@/components/mixins/getList'

export default {
  mixins: [list],
  data() {
    return {
      FROM: ['ios', 'Android', 'web'],
      REGISTERTYPE: ['手机', '邮箱'],
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
          title: '用户名',
          dataIndex: 'user_name',
          align: 'center',
          width: '7%',
          customRender(value, row) {
            return row.user_id
          }
        },
        {
          title: '中文名',
          dataIndex: 'real_name',
          align: 'center',
          width: '8%',
          customRender(value, row, index) {
            return value ? value : '-'
          }
        },
        {
          title: '注册终端',
          dataIndex: 'from',
          align: 'center',
          width: '8%',
          scopedSlots: { customRender: 'from' }
        },
        {
          title: '注册方式',
          dataIndex: 'register_type',
          align: 'center',
          width: '8%',
          scopedSlots: { customRender: 'register_type' }
        },
        {
          title: '是否代注册',
          dataIndex: 'is_admin',
          align: 'center',
          width: '8%',
          customRender(value, row, index) {
            return value ? '是' : '否'
          }
        },
        {
          title: '电话',
          dataIndex: 'phone',
          align: 'center',
          width: '8%',
          customRender(value, row, index) {
            return value ? '+' + row.zone_code + ' ' + value : '-'
          }
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          align: 'center',
          width: '8%',
          customRender(value, row, index) {
            return value ? value : '-'
          }
        },
        {
          title: '开户情况',
          dataIndex: 'open_account_status',
          align: 'center',
          width: '8%',
          customRender(value, row, index) {
            return value == 1 ? '已开户' : '未开户'
          }
        },
        {
          title: '账号状态',
          dataIndex: 'status',
          align: 'center',
          width: '8%',
          customRender(value, row, index) {
            return value == 1 ? '可用' : '锁定'
          }
        },
        {
          title: '注册时间',
          dataIndex: 'created_at',
          align: 'center',
          width: '8%'
        }
        // {
        //   title: '操作',
        //   dataIndex: 'operation',
        //   align: 'center',
        //   scopedSlots: { customRender: 'operation' }
        // }
      ],
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
        .get_register_list(params)
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
    }
  }
}
</script>

<style lang="less" scoped></style>
