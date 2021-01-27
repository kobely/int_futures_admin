<template>
  <div class="bank-list">
    <div class="search-area">
      <a-form layout="inline" style="marginbottom: 20px;" @submit="handleSubmit">
        <a-form-item label="">
          <a-input style="width: 285px;" v-model="queryParam.keyword" placeholder="UserId/姓名/银行/银行卡号"></a-input>
        </a-form-item>
        <a-form-item label="">
          <a-select v-model="queryParam.is_activity" style="width: 140px;" placeholder="银行卡状态" :allowClear="true">
            <a-select-option value="1">已绑定</a-select-option>
            <a-select-option value="0">已解绑</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :disabled="clickable">
            搜索
          </a-button>
          <a-button style="margin-left: 8px;" @click="resetQuery" :disabled="clickable">重置</a-button>
        </a-form-item>
      </a-form>
      <a-button type="primary" @click="handleAdd">新增</a-button>
    </div>
    <a-table :columns="columns" :dataSource="dataList" :pagination="pagination" :loading="clickable" :scroll="{ y: tableHeight }" bordered>
      <template slot="operation" slot-scope="text, record">
        <div class="flex-center">
          <a-button type="primary" size="small" @click="handleUpdate(record.id)">
            修改
          </a-button>
          <a-divider type="vertical" />
          <a-button type="primary" size="small" :disabled="!record.is_activity" @click="handleUnbind(record)">
            解绑
          </a-button>
        </div>
      </template>
    </a-table>
    <bank-card-add :visible.sync="modalShow" :bank-id="bankId" v-if="modalShow" />
  </div>
</template>

<script>
import { DatePicker, button } from 'ant-design-vue'
import { list } from '@/components/mixins/getList'
import columns from './table-utils/bankColumn'
import BankCardAdd from './components/BankCardAdd'

export default {
  components: {
    BankCardAdd,
    [DatePicker.name]: DatePicker,
    [DatePicker.RangePicker.name]: DatePicker.RangePicker,
    [button.name]: button
  },
  mixins: [list],
  data() {
    return {
      modalShow: false,
      columns, // 表头
      bankId: ''
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
        .get_bank_list(params)
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

    // 解绑
    handleUnbind(cardInfo) {
      const that = this
      this.$confirm({
        title: `确定解绑银行卡号为${cardInfo.bank_card}的银行卡？`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          that.$apis
            .unbind_bank_card({ id: cardInfo.id })
            .then(res => {
              that.getList()
              that.$message.success('解绑成功')
            })
            .catch(err => {})
        }
      })
    },

    // 新增
    handleAdd() {
      this.modalShow = true
      this.bankId = ''
    },

    // 修改
    handleUpdate(id) {
      this.modalShow = true
      this.bankId = id
    }
  }
}
</script>

<style lang="less" scoped></style>
