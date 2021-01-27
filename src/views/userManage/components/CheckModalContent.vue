<template>
  <div>
    <a-form layout="inline" :form="form" @submit="handleSubmit">
      <p>正在对 {{ detailInfo.real_name }} ({{ detailInfo.user_info && detailInfo.user_info.user_id }}) 进行身份核验</p>
      <a-row class="mt-10">
        <a-col>
          <a-form-item label="核验结果">
            <a-select
              v-decorator="[
                'is_verify',
                {
                  rules: [
                    {
                      required: true,
                      message: '请选择核验结果！'
                    }
                  ]
                }
              ]"
              style="width: 180px;"
              placeholder="请选择核验结果"
            >
              <a-select-option value="2">核验通过</a-select-option>
              <a-select-option value="1">核验不通过</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="mt-10" v-if="form.getFieldValue('is_verify') == 1">
        <a-col>
          <a-form-item label="不通过原因选择">
            <a-checkbox-group
              v-decorator="[
                'pass_reason',
                {
                  rules: [
                    {
                      required: true,
                      message: '请选择不通过原因！'
                    }
                  ],
                  initialValue: []
                }
              ]"
              style="width: 100%;"
            >
              <a-row>
                <a-col :span="12">
                  <a-checkbox value="1">身份证照片与录入信息不符</a-checkbox>
                </a-col>
                <a-col :span="12">
                  <a-checkbox value="2">录像资料不符合要求</a-checkbox>
                </a-col>
                <a-col :span="24"><p class="reason-select-tip">提示：如身份证照片与录像不是同一人，请同时勾选上述两项</p></a-col>
                <a-col :span="12" v-if="detailInfo.open_status != 1">
                  <a-checkbox value="3">住址证明不合规范</a-checkbox>
                </a-col>
                <a-col :span="24" v-if="detailInfo.open_status != 1">
                  <p class="reason-select-tip">
                    提示：中国内地用户住址证明为身份证正面；非中国内地用户需提供真实的信用账单、水电单等住址证明。
                  </p>
                </a-col>
                <a-col :span="12">
                  <a-checkbox value="4">税务资料有误</a-checkbox>
                </a-col>
                <a-col :span="12">
                  <a-checkbox value="5">W-8BEN资料有误</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="mt-10">
        <a-col>
          <a-form-item label="备注">
            <a-textarea
              style="width: 260px; height: 75px;"
              v-decorator="[
                'remark',
                {
                  rules: [
                    {
                      max: 200,
                      message: '备注最多不超过200字！'
                    }
                  ],
                  initialValue: ''
                }
              ]"
              placeholder="选填，只展示给后台人员查看"
            />
          </a-form-item>
          <!-- <p class="bz-tip" v-if="form.getFieldValue('is_verify') == 1">备注信息将发送给用户，请认真填写</p> -->
          <span class="input-num-wrap"> {{ form.getFieldValue('remark') ? form.getFieldValue('remark').length : 0 }}/200 </span>
        </a-col>
      </a-row>
      <a-row class="modal-button-wrap">
        <a-col>
          <a-form-item>
            <a-button type="default" style="display: inline-block; margin-right: 20px;" @click="$emit('update:showModal', false)">
              取消
            </a-button>
            <a-button type="primary" html-type="submit" :disabled="loading">
              确定
            </a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import { Form, Row, Col, Select, Checkbox, Input, Button } from 'ant-design-vue'

export default {
  components: {
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Row.name]: Row,
    [Col.name]: Col,
    [Select.name]: Select,
    [Select.Option.name]: Select.Option,
    [Checkbox.name]: Checkbox,
    [Input.name]: Input,
    [Input.TextArea.name]: Input.TextArea,
    [Button.name]: Button
  },
  props: ['detailInfo'],
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, formQuery) => {
        if (!err) {
          const params = Object.assign({ id: this.detailInfo.id }, formQuery)
          if (formQuery.pass_reason) {
            params.pass_reason = formQuery.pass_reason.join(',')
          }

          this.loading = true
          this.$apis
            .set_account_verify(params)
            .then(res => {
              this.$toast.success(res.msg || '操作成功')
              this.$emit('update:showModal', false)
              this.$router.push('/userManage/userList')
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
.input-num-wrap {
  position: absolute;
  top: 52px;
  left: 325px;
}
.reason-select-tip {
  padding: 5px 0 5px 24px;
  line-height: 1.2;
  font-size: 12px;
  color: #ff6600;
}
.bz-tip {
  text-indent: 50px;
  font-size: 12px;
  color: #ff0000;
}
</style>
