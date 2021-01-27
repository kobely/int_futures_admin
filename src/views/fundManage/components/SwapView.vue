<template>
  <a-modal :visible="visible" :maskClosable="false" width="800px" @cancel="$emit('update:visible', false)">
    <div slot="title">
      <span class="mr-20">客户换汇订单</span>
      <a-tag :color="detailInfo.status == 2 ? '#87d068' : '#f50'" v-if="operateType == 'view'">
        {{ DEAL_STATUS[detailInfo.status] }}
      </a-tag>
    </div>
    <template slot="footer" v-if="operateType == 'view'">
      <a-button key="back" @click="$emit('update:visible', false)">关闭</a-button>
    </template>
    <template slot="footer" v-else>
      <a-button key="back" @click="$emit('update:visible', false)">取消</a-button>
      <a-button key="submit" type="primary" @click="handleSubmit">
        确定
      </a-button>
    </template>
    <a-form layout="inline" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" :form="form">
      <a-row>
        <a-col :span="12">
          <div class="left-wrapper">
            <a-form-item label="UserID">
              <span class="form-right-text">{{ detailInfo.users && detailInfo.users.user_id }}</span>
            </a-form-item>
            <a-form-item label="账号">
              <span class="form-right-text">{{ detailInfo.account }}</span>
            </a-form-item>
            <a-form-item label="服务单号">
              <span class="form-right-text">{{ detailInfo.transfer_no }}</span>
            </a-form-item>
            <p class="section-title">原始订单</p>
            <a-form-item label="换出币种">
              <span class="form-right-text">{{ detailInfo.currency_out }}</span>
            </a-form-item>
            <a-form-item label="换出金额">
              <span class="form-right-text">{{ detailInfo.amount_out }}</span>
            </a-form-item>
            <a-form-item label="参考汇率">
              <span class="form-right-text">{{ rate }}</span>
            </a-form-item>
            <a-form-item label="换入币种">
              <span class="form-right-text">{{ detailInfo.currency_in }}</span>
            </a-form-item>
            <a-form-item label="换入金额">
              <span class="form-right-text">{{ detailInfo.amount_in }}</span>
            </a-form-item>
            <a-form-item label="客户备注">
              <span class="form-right-text">{{ detailInfo.customer_remark ? detailInfo.customer_remark : '--' }}</span>
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="right-wrapper">
            <a-form-item label="用户姓名">
              <span class="form-right-text">{{ detailInfo.users && detailInfo.users.real_name }}</span>
            </a-form-item>
            <a-form-item label="是否代录入">
              <span class="form-right-text">
                {{ detailInfo.created_id ? `（${detailInfo.created_user.name} ${detailInfo.created_user.uid}） 是` : '否' }}
              </span>
            </a-form-item>
            <a-form-item label="订单时间">
              <span class="form-right-text">{{ detailInfo.created_at }}</span>
            </a-form-item>
            <p class="section-title">处理订单</p>
            <template v-if="operateType == 'view'">
              <a-form-item label="处理结果" class="mt-10">
                <span class="form-right-text">{{ detailInfo.status == 2 || detailInfo.status == 3 ? DEAL_STATUS[detailInfo.status] : '--' }}</span>
              </a-form-item>
              <a-form-item label="换出金额" class="mt-10">
                <span class="form-right-text">{{ detailInfo.real_amount_out > 0 ? detailInfo.real_amount_out : '--' }}</span>
              </a-form-item>
              <a-form-item label="兑换汇率" class="mt-10">
                <span class="form-right-text">{{ detailInfo.status == 2 || detailInfo.status == 3 ? realRate : '--' }}</span>
              </a-form-item>
              <a-form-item label="换入金额" class="mt-10">
                <span class="form-right-text">{{ detailInfo.real_amount_in > 0 ? detailInfo.real_amount_in : '--' }}</span>
              </a-form-item>
              <a-form-item label="备注" class="mt-10">
                <span class="form-right-text">{{ detailInfo.handler_remark ? detailInfo.handler_remark : '--' }}</span>
              </a-form-item>
            </template>
            <swap-deal v-else :form="form" :detail-info="detailInfo" :act_method.sync="act_method" />
          </div>
        </a-col>
      </a-row>
    </a-form>
    <spin v-show="loading" loading-desc="加载中" />
  </a-modal>
</template>

<script>
import { Modal, Form, Row, Col, Button, Tag } from 'ant-design-vue'
import SwapDeal from './SwapDeal'

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

export default {
  components: {
    SwapDeal,
    [Modal.name]: Modal,
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
    [Tag.name]: Tag
  },
  data() {
    return {
      formItemLayout,
      form: this.$form.createForm(this),
      DEAL_STATUS: ['待处理', '处理中', '成功', '失败', '已取消', '服务异常'],
      detailInfo: {},
      act_method: 2, // 告诉后台修改的哪个框，默认除。换出金额：1（乘） 换入金额：2（除）
      loading: false
    }
  },
  computed: {
    rate() {
      return this.detailInfo.currency_out + ' 1 = ' + this.detailInfo.currency_in + ' ' + this.detailInfo.rate
    },
    realRate() {
      return this.detailInfo.currency_out + ' 1 = ' + this.detailInfo.currency_in + ' ' + this.detailInfo.real_rate
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    transferNo: {
      type: String,
      default: ''
    },
    operateType: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 获取利率列表
    getRateList() {
      return new Promise((resolve, reject) => {
        if (this.operateType == 'view') {
          resolve([])
        } else {
          this.$apis
            .get_rate_list()
            .then(res => {
              resolve(res.list)
            })
            .catch(err => {
              reject(err)
            })
        }
      })
    },
    async init() {
      const rateList = await this.getRateList()
      this.$apis
        .get_exchange_detail({ transfer_no: this.transferNo })
        .then(res => {
          this.detailInfo = { ...res }

          if (!rateList.length) return
          const { currency_in, currency_out } = this.detailInfo
          this.detailInfo.goalRate = rateList.filter(i => i.currency_in == currency_in && i.currency_out == currency_out)[0].rate
        })
        .catch(err => {})
    },
    // 提交
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, formQuery) => {
        if (!err) {
          // console.log(formQuery)
          const params = Object.assign(formQuery, {
            transfer_no: this.transferNo,
            act_method: this.act_method
          })

          this.loading = true
          this.$apis
            .set_exchange_deal(params)
            .then(res => {
              this.$toast.success('处理成功')
              this.$emit('update:visible', false)
              this.$parent.getList()
            })
            .catch(err => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../../style/init.less');
.left-wrapper,
.right-wrapper {
  padding: 0 35px;
  .ant-row {
    width: 100%;
  }
}
.left-wrapper {
  border-right: 1px solid #e5e5e5;
}

.form-right-text {
  width: 208px;
  display: inline-block;
  text-align: right;
}
.mr-20 {
  margin-right: 20px;
}
/deep/ .ant-form-item > .ant-form-item-label {
  text-align: left;
}
.section-title {
  margin: 15px 0;
  font-weight: bold;
  font-size: 16px;
}
</style>
