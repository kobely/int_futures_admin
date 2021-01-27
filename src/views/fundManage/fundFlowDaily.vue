<template>
  <div class="fund-flow">
    <div class="search-area">
      <a-form layout="inline" @submit="handleSubmit" style="marginbottom: 20px;">
        <a-form-item label="">
          <a-range-picker format="YYYY-MM-DD" :placeholder="['起始时间', '结束时间']" inputReadOnly v-model="rangeTime"></a-range-picker>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :disabled="clickable">
            搜索
          </a-button>
          <a-button style="margin-left: 8px;" @click="resetQuery" :disabled="clickable">重置</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-radio-group v-model="queryParam.currency_no" style="margin-bottom: 10px">
      <a-radio-button value="USD">
        A账户（USD）
      </a-radio-button>
      <a-radio-button value="CNY">
        A账户（CNY）
      </a-radio-button>
      <a-radio-button value="HKD">
        A账户（HKD）
      </a-radio-button>
    </a-radio-group>
    <a-table :columns="columns" :dataSource="dataList" :pagination="pagination" :loading="clickable" :scroll="{ y: tableHeight }" bordered>
      <template slot="operation" slot-scope="text, record">
        <router-link :to="'/fundManage/flowList?currency=' + queryParam.currency_no + '&date=' + record.cash_date">查看详情</router-link>
      </template>
    </a-table>
  </div>
</template>

<script>
import { DatePicker, Radio } from 'ant-design-vue'
import { list } from '@/components/mixins/getList'
import columns from './table-utils/flowDailyList'

export default {
  components: {
    [DatePicker.name]: DatePicker,
    [DatePicker.RangePicker.name]: DatePicker.RangePicker,
    [Radio.name]: Radio,
    [Radio.Group.name]: Radio.Group,
    [Radio.Button.name]: Radio.Button
  },
  mixins: [list],
  data() {
    return {
      // 表头
      columns,
      rangeTime: [],
      queryParam: {
        currency_no: 'USD'
      },
      loading: false
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
    'queryParam.currency_no'() {
      this.pagination.current = 1
      this.getList()
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
        .getFlowDailyList(params)
        .then(res => {
          let resData = res.data
          this.dataList = [...resData]
          this.pagination.total = res.total

          resData.forEach((item, index) => {
            item.key = (current - 1) * 10 + index + 1
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
      this.queryParam.start_date = ''
      this.queryParam.end_date = ''
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
</style>
