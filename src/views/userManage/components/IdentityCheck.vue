<template>
  <div>
    <a-row>
      <a-col :span="5">证件类型：</a-col>
      <a-col :span="7">
        <span class="color-dark" v-if="[1, 2].includes(detailInfo.open_status)">{{ COUNTRY[detailInfo.open_status - 1] }}</span
        ><span class="color-dark">{{ ID_TYPE[detailInfo.id_type - 1] }}</span>
      </a-col>
      <a-col :span="5">身份核验方式：</a-col>
      <a-col :span="7">
        <span class="color-dark">{{ VERIFY_TYPE[detailInfo.verify_action - 1] }}</span>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="5">证件号：</a-col>
      <a-col :span="7">
        <span class="color-dark">{{ detailInfo.id_card }}</span>
      </a-col>
      <a-col :span="5" v-if="detailInfo.verify_action != 3">回调单号：</a-col>
      <!-- <a-col :span="5" v-else-if="detailInfo.verify_action == 3 && detailInfo.is_verify != 0">审核人：</a-col> -->
      <a-col :span="7">
        <span class="color-dark" v-if="detailInfo.verify_action != 3">{{ detailInfo.order_no }}</span>
        <!-- <span class="color-dark" v-else-if="detailInfo.verify_action == 3 && detailInfo.is_verify != 0">--</span> -->
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="5">大陆公安库校验：</a-col>
      <a-col :span="7">
        <span class="color-dark">{{
          detailInfo.open_status == 1 ? (detailInfo.is_verify == 2 && detailInfo.verify_action == 1 ? '通过' : '未校验') : '非内地无此项'
        }}</span>
      </a-col>
      <a-col :span="5">身份核验结果：</a-col>
      <a-col :span="7">
        <span class="color-dark">{{ VERIFY_STATUS[detailInfo.is_verify] }}</span>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { Row, Col } from 'ant-design-vue'
import { COUNTRY, ID_TYPE, VERIFY_TYPE, VERIFY_STATUS } from '@/utils/const'

export default {
  components: {
    [Row.name]: Row,
    [Col.name]: Col
  },
  data() {
    return {
      COUNTRY,
      ID_TYPE,
      VERIFY_TYPE,
      VERIFY_STATUS
    }
  },
  props: ['detailInfo']
}
</script>

<style lang="less" scoped></style>
