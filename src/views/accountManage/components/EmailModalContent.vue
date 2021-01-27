<template>
    <div>
        <a-form layout="inline" :form="form" @submit="handleSubmit">
            <a-row>
                <a-col>
                    <a-form-item label="客 户 类 型">
                        <a-radio-group
                            v-decorator="[
                                'user_type',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择客户类型！',
                                        },
                                    ],
                                    initialValue: '',
                                },
                            ]"
                            style="width: 100%;"
                        >
                            <a-radio value="1">个人用户</a-radio>
                            <a-radio value="2">机构用户</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col>
                    <a-form-item label="期 货 类 型">
                        <a-radio-group
                            v-decorator="[
                                'account_type',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择期货类型！',
                                        },
                                    ],
                                    initialValue: '',
                                },
                            ]"
                            style="width: 100%;"
                        >
                            <a-radio value="1">期货</a-radio>
                            <a-radio value="3">连续合约</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col>
                    <a-form-item label="结算单类型">
                        <a-radio-group
                            v-decorator="[
                                'statement_type',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择结算单类型！',
                                        },
                                    ],
                                    initialValue: '',
                                },
                            ]"
                            style="width: 100%;"
                        >
                            <a-radio value="1">日结单</a-radio>
                            <a-radio value="2">月结单</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-form-item label="结 算 日 期">
                <a-month-picker
                    v-decorator="[
                        'statement_time',
                        {
                            rules: [
                                {
                                    type: 'object',
                                    required: true,
                                    message: '请选择结算月份！',
                                },
                            ],
                        },
                    ]"
                    inputReadOnly
                    v-if="form.getFieldValue('statement_type') == 2"
                />
                <a-date-picker
                    v-decorator="[
                        'statement_time2',
                        {
                            rules: [
                                {
                                    type: 'object',
                                    required: true,
                                    message: '请选择结算日期！',
                                },
                            ],
                        },
                    ]"
                    inputReadOnly
                    v-else
                />
            </a-form-item>
            <p class="retrieve-result">检索到<span id="retrieveResult">0</span>份结算单</p>

            <a-row class="modal-button-wrap">
                <a-col>
                    <a-form-item>
                        <a-button type="default" style="display: inline-block; margin-right: 20px;" @click="$emit('update:showModal', false)">
                            取消
                        </a-button>
                        <a-button type="primary" html-type="submit" :disabled="loading">
                            确定发送
                        </a-button>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <spin loading-desc="正在发送邮件" v-show="loading" />
    </div>
</template>

<script>
import { Form, Row, Col, Input, Radio, DatePicker, Button } from 'ant-design-vue'
import apis from '@/api'

export default {
    components: {
        [Form.name]: Form,
        [Form.Item.name]: Form.Item,
        [Row.name]: Row,
        [Col.name]: Col,
        [Input.name]: Input,
        [Radio.name]: Radio,
        [Radio.Group.name]: Radio.Group,
        [DatePicker.name]: DatePicker,
        [DatePicker.MonthPicker.name]: DatePicker.MonthPicker,
        [Button.name]: Button,
    },
    data() {
        return {
            form: this.$form.createForm(this, {
                onValuesChange(props, values) {
                    let params = props.form.getFieldsValue()
                    params = Object.assign(params, values)

                    if (params.statement_type == 2 && params.statement_time) {
                        params.statement_time = params.statement_time.format('YYYY-MM')
                    } else if (params.statement_type == 1 && params.statement_time2) {
                        params.statement_time = params.statement_time2.format('YYYY-MM-DD')
                        delete params.statement_time2
                    }

                    let isOk = true
                    for (let i in params) {
                        if (params[i] == undefined || typeof params[i] != 'string') {
                            isOk = false
                            break
                        }
                    }

                    if (isOk) {
                        isOk = false
                        apis.email_count(params)
                            .then((res) => {
                                document.getElementById('retrieveResult').innerText = res.count
                            })
                            .catch((err) => {})
                    } else {
                        document.getElementById('retrieveResult').innerText = 0
                    }
                },
            }),
            loading: false,
        }
    },
    methods: {
        handleSubmit(e) {
            e.preventDefault()

            this.form.validateFieldsAndScroll((err, formQuery) => {
                if (!err) {
                    let params = {}
                    params = Object.assign(params, formQuery)

                    if (params.statement_type == 1) {
                        params.statement_time = formQuery.statement_time2.format('YYYY-MM-DD')
                        delete params.statement_time2
                    } else {
                        params.statement_time = formQuery.statement_time.format('YYYY-MM')
                    }

                    this.loading = true

                    apis.distribute_email(params)
                        .then((res) => {
                            this.$toast.success('批量发送邮件成功')
                            this.$emit('update:showModal', false)
                            this.$emit('update:isNeedReload', true)
                        })
                        .catch((err) => {})
                        .finally(() => {
                            this.loading = false
                        })
                }
            })
        },
    },
}
</script>

<style lang="less" scoped>
.retrieve-result {
    text-indent: 92px;
    font-size: 12px;
    color: #ff0000;
}
</style>
