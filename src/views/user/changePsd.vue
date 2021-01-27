<template>
    <a-modal
        title="修改密码"
        :visible="showModal"
        :destroyOnClose="true"
        :maskClosable="false"
        :confirmLoading="isLoading"
        @ok="handleSubmit"
        @cancel="$emit('update:showModal', false)"
        width="450px"
    >
        <a-form :form="form" @submit="handleSubmit">
            <!-- 原密码 start -->
            <a-form-item v-bind="formItemLayout" label="原密码" has-feedback>
                <a-input
                    v-decorator="[
                        'password',
                        {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入原密码！'
                                }
                            ]
                        }
                    ]"
                    type="password"
                    placeholder="请输入原密码"
                />
            </a-form-item>
            <!-- 原密码 end -->

            <!-- 新密码 start -->
            <a-form-item v-bind="formItemLayout" label="新密码" has-feedback>
                <a-input
                    v-decorator="[
                        'new_password',
                        {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入新密码！'
                                },
                                {
                                    pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,20}$/,
                                    message: '密码格式为长度6-20位，包含大小写字母和数字'
                                },
                                {
                                    validator: validateToNextPassword
                                }
                            ]
                        }
                    ]"
                    type="password"
                    placeholder="新密码为长度6-20位大小写字母和数字"
                />
            </a-form-item>
            <!-- 新密码 end -->

            <!-- 确认密码 start -->
            <a-form-item v-bind="formItemLayout" label="确认密码" has-feedback>
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
                    placeholder="请重复输入新密码"
                    @blur="handleConfirmBlur"
                />
            </a-form-item>
            <!-- 确认密码 end -->
        </a-form>
    </a-modal>
</template>

<script>
import { Form, Input, Modal } from 'ant-design-vue'
import { mapActions } from 'vuex'

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
                    sm: { span: 16 }
                }
            }
        }
    },
    props: ['showModal'],
    components: {
        [Modal.name]: Modal,
        [Form.name]: Form,
        [Form.Item.name]: Form.Item,
        [Input.name]: Input
    },
    methods: {
        ...mapActions(['Logout']),
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
            if (value && value !== form.getFieldValue('new_password')) {
                callback('两次输入密码不一致！')
            } else {
                callback()
            }
        },
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFieldsAndScroll(async (err, formQuery) => {
                if (!err) {
                    this.isLoading = true
                    await this.changePassword(formQuery)
                    this.Logout()
                        .then(() => {
                            this.$router.push('/login')
                        })
                        .catch(err => {})
                }
            })
        },
        changePassword(params) {
            return new Promise((resolve, reject) => {
                this.$apis
                    .change_password(params)
                    .then(res => {
                        this.$toast.success(res.msg)
                        this.$emit('update:showModal', false)
                        this.isLoading = false
                        resolve()
                    })
                    .catch(err => {
                        this.isLoading = false
                        reject()
                    })
            })
        }
    }
}
</script>

<style lang="less" scoped></style>
