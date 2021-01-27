<template>
    <a-modal
        title="新增账号"
        :visible="showAccountModal"
        :destroyOnClose="true"
        :maskClosable="false"
        :confirmLoading="isLoading"
        @ok="handleSubmit"
        @cancel="$emit('update:showAccountModal', false)"
        width="450px"
    >
        <a-form :form="form" @submit="handleSubmit">
            <!-- 邮箱 start -->
            <a-form-item v-bind="formItemLayout" label="邮箱">
                <a-input
                    v-decorator="[
                        'email',
                        {
                            rules: [
                                {
                                    type: 'email',
                                    message: '请输入正确的邮箱格式！'
                                },
                                {
                                    required: true,
                                    message: '请输入邮箱！'
                                }
                            ]
                        }
                    ]"
                    placeholder="例如，admin@1quant.com"
                    autocomplete="off"
                />
            </a-form-item>
            <!-- 邮箱 end -->

            <!-- 用户名 start -->
            <a-form-item v-bind="formItemLayout" label="用户名">
                <a-input
                    v-decorator="[
                        'name',
                        {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入用户名！'
                                }
                            ]
                        }
                    ]"
                    placeholder="例如，admin"
                    autocomplete="off"
                />
            </a-form-item>
            <!-- 用户名 end -->

            <!-- 登录密码 start -->
            <a-form-item v-bind="formItemLayout" label="登录密码">
                <a-input
                    v-decorator="[
                        'password',
                        {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入登录密码！'
                                },
                                {
                                    min: 6,
                                    max: 18,
                                    message: '密码格式为6-20位数字字母组合！'
                                },
                                {
                                    validator: validPassword
                                }
                            ]
                        }
                    ]"
                    placeholder="6-20位数字字母组合"
                    type="password"
                />
            </a-form-item>
            <!-- 登录密码 end -->

            <!-- 平台 start -->
            <a-form-item v-bind="formItemLayout" label="平台">
                <a-select
                    placeholder="请选择平台"
                    v-decorator="[
                        'source',
                        {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择平台！'
                                }
                            ]
                        }
                    ]"
                    @change="handleChange"
                >
                    <a-select-option :value="index" v-for="(item, index) in PLATFORM_STYLE" :key="index">{{ item }}</a-select-option>
                </a-select>
            </a-form-item>
            <!-- 平台 end -->

            <!-- 用户组 start -->
            <a-form-item v-bind="formItemLayout" label="用户组" v-if="isNeedGroup">
                <a-select
                    placeholder="请选择用户组"
                    v-decorator="[
                        'group_id',
                        {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择用户组！'
                                }
                            ]
                        }
                    ]"
                >
                    <a-select-option :value="item.id" v-for="(item, index) in userGroup" :key="index">{{ item.title }}</a-select-option>
                </a-select>
            </a-form-item>
            <!-- 用户组 end -->
        </a-form>
    </a-modal>
</template>

<script>
import { Form, Input, Select, Modal } from 'ant-design-vue'
import { PLATFORM_STYLE } from '@/utils/const'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            PLATFORM_STYLE,
            isLoading: false,
            isNeedGroup: false,
            form: this.$form.createForm(this),
            formItemLayout: {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 6 }
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 12 }
                }
            }
        }
    },
    computed: {
        ...mapState(['userGroup'])
    },
    props: ['showAccountModal', 'isNeedUpdate'],
    components: {
        [Modal.name]: Modal,
        [Form.name]: Form,
        [Form.Item.name]: Form.Item,
        [Input.name]: Input,
        [Select.name]: Select,
        [Select.Option.name]: Select.Option
    },
    methods: {
        validPassword(rule, value, callback) {
            if (/^\d{6,18}$/.test(value) || /^[a-zA-Z]{6,18}$/.test(value)) {
                callback('密码格式为6-20位数字字母组合！')
            } else {
                callback()
            }
        },
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFieldsAndScroll((err, formQuery) => {
                if (!err) {
                    this.isLoading = true
                    this.$apis
                        .user_add(formQuery)
                        .then(res => {
                            this.$message.success('新增账号成功！')
                            this.$emit('update:isNeedUpdate', true)
                            this.$emit('update:showAccountModal', false)
                            this.isLoading = false
                        })
                        .catch(err => {
                            this.isLoading = false
                        })
                }
            })
        },
        handleChange(val) {
            this.isNeedGroup = val == 1 ? true : false
        }
    }
}
</script>
