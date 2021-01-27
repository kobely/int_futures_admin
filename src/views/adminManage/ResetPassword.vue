<template>
    <a-modal
        title="重置密码"
        :visible="showModal"
        :destroyOnClose="true"
        :maskClosable="false"
        :confirmLoading="isLoading"
        @ok="handleSubmit"
        @cancel="$emit('update:showModal', false)"
        width="450px"
    >
        <a-form :form="form" @submit="handleSubmit">
            <a-form-item v-bind="formItemLayout" label="邮 箱">
                <span class="color-dark">{{ changeAccountInfo.email }}</span>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="用户名">
                <span class="color-dark">{{ changeAccountInfo.name }}</span>
            </a-form-item>

            <!-- 新密码 start -->
            <a-form-item v-bind="formItemLayout" label="新密码">
                <a-input
                    v-decorator="[
                        'password',
                        {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入新密码！'
                                },
                                {
                                    validator: validateToNextPassword
                                }
                            ]
                        }
                    ]"
                    type="password"
                />
            </a-form-item>
            <!-- 新密码 end -->

            <!-- 确认密码 start -->
            <a-form-item v-bind="formItemLayout" label="确认密码">
                <a-input
                    v-decorator="[
                        're_password',
                        {
                            rules: [
                                {
                                    required: true,
                                    message: '请再次确认密码！'
                                },
                                {
                                    validator: compareToFirstPassword
                                }
                            ]
                        }
                    ]"
                    type="password"
                    @blur="handleConfirmBlur"
                />
            </a-form-item>
            <!-- 确认密码 end -->
        </a-form>
    </a-modal>
</template>

<script>
import { Form, Input, Modal } from 'ant-design-vue'

export default {
    data() {
        return {
            isLoading: false,
            confirmBlur: false,
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
    props: ['showModal', 'changeAccountInfo'],
    components: {
        [Modal.name]: Modal,
        [Form.name]: Form,
        [Form.Item.name]: Form.Item,
        [Input.name]: Input
    },
    methods: {
        handleConfirmBlur(e) {
            const value = e.target.value
            this.confirmBlur = this.confirmBlur || !!value
        },
        validateToNextPassword(rule, value, callback) {
            const form = this.form

            if (value && this.confirmBlur) {
                form.validateFields(['re_password'], { force: true })
            }
            callback()
        },
        compareToFirstPassword(rule, value, callback) {
            const form = this.form

            if (value && value !== form.getFieldValue('password')) {
                callback('两次输入密码不一致！')
            } else {
                callback()
            }
        },
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFieldsAndScroll((err, formQuery) => {
                if (!err) {
                    this.isLoading = true
                    let params = {
                        ...{ uid: this.changeAccountInfo.uid },
                        ...formQuery
                    }
                    this.$apis
                        .reset_password(params)
                        .then(res => {
                            this.$message.success('重置密码成功！')
                            this.$emit('update:showModal', false)
                            this.isLoading = false
                        })
                        .catch(err => {
                            this.isLoading = false
                        })
                }
            })
        }
    }
}
</script>
