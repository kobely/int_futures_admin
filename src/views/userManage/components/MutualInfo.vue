<template>
  <a-card title="用户增信材料" class="card-hei">
    <p>1、<router-link :to="'/userManage/educationCareerCondition?id=' + detailInfo.id" target="_blank">教育和职业情况</router-link></p>
    <p class="mt-10" v-if="detailInfo.examine_list_status">
      2、<router-link :to="'/userManage/survery?id=' + detailInfo.id" target="_blank">适当性调查</router-link>
    </p>
    <p class="mt-10" v-else>2、<span>适当性调查（未填）</span></p>
    <p class="mt-10" v-if="isNewInfo && detailInfo.estimate_examine_status">
      3、<router-link :to="'/userManage/questionnaire?id=' + detailInfo.id" target="_blank">风险承受能力问卷</router-link>
    </p>
    <p class="mt-10" v-else>3、<span>风险承受能力问卷（未填）</span></p>
    <p class="questionnaire-tip mt-5" v-if="isNewInfo && detailInfo.estimate_examine_status">
      得分{{ estimate_examine_result.score }}分，属于{{ estimate_examine_result.type }}投资者
    </p>
    <p class="mt-10" v-if="detailInfo.customer_state_status">
      4、<router-link :to="'/userManage/statement?id=' + detailInfo.id" target="_blank">客户声明</router-link>
    </p>
    <p class="mt-10" v-else>4、<span>客户声明（未填）</span></p>
  </a-card>
</template>

<script>
import { Card } from 'ant-design-vue'

export default {
  components: {
    [Card.name]: Card
  },
  props: ['detailInfo', 'isNewInfo'],
  computed: {
    estimate_examine_result() {
      return this.detailInfo.info_extend.estimate_examine.result != null && this.detailInfo.info_extend.estimate_examine.result
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../../style/init.less');
</style>
