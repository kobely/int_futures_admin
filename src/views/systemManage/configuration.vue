<template>
  <div>
    <p class="title">换汇功能</p>
    <div class="mt-20">
      <span class="mr-30">换汇功能开关</span>
      <a-switch v-model="swapChecked" checked-children="开" un-checked-children="关" :loading="loading" @click="handleChange" />
      <span class="swap-instruction">说明：本开关仅限制app端换汇入口是否开放，不影响后台录入换汇订单。</span>
    </div>
  </div>
</template>

<script>
import { Switch } from 'ant-design-vue'
export default {
  components: {
    [Switch.name]: Switch
  },
  data() {
    return {
      swapChecked: true,
      id: '',
      loading: false
    }
  },
  mounted() {
    this.getStatus()
  },
  methods: {
    getStatus() {
      this.loading = true
      this.$apis
        .get_exchange_status()
        .then(res => {
          const { exchange, id } = res[0]
          this.swapChecked = exchange == 1 ? true : false
          this.id = id
        })
        .catch(err => {})
        .finally(() => {
          this.loading = false
        })
    },
    handleChange(val) {
      const isOpen = !!val
      this.swapChecked = !val
      const that = this
      this.$confirm({
        title: `是否${isOpen ? '开启' : '关闭'}换汇功能？`,
        okText: `${isOpen ? '确定开启' : '确定关闭'}`,
        cancelText: '取消',
        onOk() {
          that.$apis
            .set_exchange_update({ id: that.id, exchange: isOpen ? 1 : 0 })
            .then(res => {
              that.swapChecked = val
            })
            .catch(err => {})
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../style/init.less');
.title {
  position: relative;
  display: flex;
  padding-bottom: 15px;
  font-size: 18px;
  &::before {
    content: '';
    margin-right: 10px;
    width: 3px;
    height: 18px;
    background-color: #d3d3d3;
  }
  &::after {
    position: absolute;
    left: 0;
    bottom: 0;
    content: '';
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #e5e5e5;
  }
}

.swap-instruction {
  margin-left: 50px;
  color: #aaa;
}
</style>
