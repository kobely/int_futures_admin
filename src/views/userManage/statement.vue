<template>
  <div>
    <div class="about-info" v-if="customerState.length">
      <div class="top-nav">
        <span class="title">客户声明</span>
      </div>
    </div>
    <div class="statement-content" v-if="customerState.length">
      <dl v-for="(item, index) in statement" :key="index">
        <dt>{{ index + 1 }}、{{ item.label }}</dt>
        <dd><a-radio :checked="customerState[index].value == 0" disabled /> 否</dd>
        <dd><a-radio :checked="customerState[index].value == 1" disabled /> 是</dd>
        <dd class="input-wrapper" v-if="item.level_two_title && customerState[index].input_value">
          <span>{{ item.level_two_title }}</span>
          <a-input :value="customerState[index].input_value" disabled style="width: 200px;" />
        </dd>
        <dd class="input-wrapper" style="margin-top: 10px;" v-if="item.level_two_relation && customerState[index].input_value_2">
          <span>{{ item.level_two_relation }}</span>
          <a-input :value="customerState[index].input_value_2" disabled style="width: 200px;" />
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { Radio, Input, Row, Col } from 'ant-design-vue'
import { statement } from '@/utils/question'

export default {
  components: {
    [Radio.name]: Radio,
    [Input.name]: Input,
    [Row.name]: Row,
    [Col.name]: Col
  },
  data() {
    return {
      statement: statement,
      customerState: []
    }
  },
  mounted() {
    this.getExtendDetail()
  },
  methods: {
    getExtendDetail() {
      this.$apis
        .get_account_extend({ id: this.$route.query.id })
        .then(res => {
          this.customerState = res.info_extend && res.info_extend.customer_state != null && res.info_extend.customer_state
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.about-info {
  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 99;
    width: 100%;
    height: 50px;
    padding: 0 30px;
    background-color: #f0f2f5;
    border-bottom: 1px solid #aaa;
    .title {
      font-size: 20px;
    }
  }
}
.statement-content {
  min-height: calc(100vh - 80px);
  background-color: #f0f2f5;
  dl {
    margin: 0;
    padding: 20px;
    overflow: hidden;
    width: 50%;
    dt {
      margin-bottom: 10px;
      font-size: 16px;
      color: #444;
    }
    dd {
      margin-right: 30px;
      padding-left: 25px;
      &.checked {
        color: #1890ff;
      }
      &.input-wrapper {
        width: 355px;
        text-align: right;
      }
    }
  }
}
/deep/.ant-checkbox-wrapper {
  margin-right: 8px;
}
</style>
