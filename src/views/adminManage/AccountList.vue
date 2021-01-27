<template>
    <div>
        <a-form layout="inline" @submit="handleSubmit" style="marginBottom: 20px;">
            <a-form-item label="关键字">
                <a-input v-model="queryParam.keyword" style="width: 190px" placeholder="请输入用户名"></a-input>
            </a-form-item>
            <!-- <a-form-item label="平台">
                <a-select v-model="queryParam.source" style="width: 150px" placeholder="请选择平台">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="index" v-for="(item, index) in PLATFORM_STYLE" :key="index">{{ item }}</a-select-option>
                </a-select>
            </a-form-item> -->
            <a-form-item label="用户组">
                <a-select v-model="queryParam.group_id" style="width: 150px" placeholder="请选择用户组">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="item.id" v-for="(item, index) in userGroup" :key="index">{{ item.title }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" :disabled="clickable">
                    搜索
                </a-button>
                <a-button style="margin: 0 28px 0 8px" @click="resetQuery" :disabled="clickable">重置</a-button>
            </a-form-item>
            <a-form-item style="float: right">
                <a-button type="primary" @click="showAccountModal = true">新增</a-button>
            </a-form-item>
        </a-form>
        <a-table :columns="columns" :dataSource="dataList" :pagination="pagination" :loading="clickable" bordered>
            <template slot="source" slot-scope="text">
                {{ PLATFORM_STYLE[text] }}
            </template>
            <template slot="groups" slot-scope="text">
                {{ text.length ? text[0].title : '--' }}
            </template>
            <template slot="operation" slot-scope="text, record, index">
                <div v-if="record.uid != 1">
                    <a-button type="primary" size="small" ghost @click="resetPassword(record)">重置密码</a-button>
                    <a-divider type="vertical" />
                    <a-button type="danger" size="small" ghost @click="accountDel(record.uid, index)">删除</a-button>
                </div>
                <span v-else>--</span>
            </template>
        </a-table>
        <reset-password :show-modal.sync="showModal" :change-account-info="changeAccountInfo" />
        <account-add :show-account-modal.sync="showAccountModal" :is-need-update.sync="isNeedUpdate" />
    </div>
</template>

<script>
import { list } from '@/components/mixins/getList'
import { PLATFORM_STYLE } from '@/utils/const'
import { mapState } from 'vuex'
import resetPassword from './ResetPassword'
import accountAdd from './AccountAdd'

export default {
    data() {
        return {
            PLATFORM_STYLE,
            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                    align: 'center',
                    width: '8%'
                },
                {
                    title: '用户名',
                    dataIndex: 'name',
                    align: 'center',
                    width: '10%'
                },
                {
                    title: '邮箱',
                    dataIndex: 'email',
                    align: 'center',
                    width: '15%'
                },
                {
                    title: '平台',
                    dataIndex: 'source',
                    align: 'center',
                    width: '12%',
                    scopedSlots: { customRender: 'source' }
                },
                {
                    title: '用户组',
                    dataIndex: 'groups',
                    align: 'center',
                    width: '12%',
                    scopedSlots: { customRender: 'groups' }
                },
                {
                    title: '创建时间',
                    dataIndex: 'created_at',
                    align: 'center',
                    width: '18%'
                },
                {
                    title: '操作',
                    dataIndex: 'operate',
                    align: 'center',
                    scopedSlots: { customRender: 'operation' }
                }
            ],
            showModal: false, // 重置密码弹层是否显示
            showAccountModal: false, // 新增账号弹层是否显示
            isNeedUpdate: false, // 是否需要更新列表
            changeAccountInfo: ''
        }
    },
    mixins: [list],
    components: {
        resetPassword,
        accountAdd
    },
    computed: {
        ...mapState(['userGroup'])
    },
    watch: {
        isNeedUpdate(newVal) {
            if (newVal) {
                this.getList()
            }
        }
    },
    methods: {
        getList() {
            const { current, pageSize } = this.pagination
            let params = Object.assign(
                {
                    page: current,
                    page_size: pageSize
                },
                this.queryParam
            )
            this['SET_CLICK'](true)
            this.$apis
                .get_user_list(params)
                .then(res => {
                    if (current == 1) {
                        this.dataList = []
                    }
                    this.dataList.length = this.pagination.total = res.total
                    this.dataList.splice((current - 1) * pageSize, res.data.length, ...res.data)
                    this.dataList.forEach((item, index) => {
                        item.key = index + 1
                    })
                    this['SET_CLICK'](false)
                    this.isNeedUpdate = false
                })
                .catch(err => {
                    this['SET_CLICK'](false)
                })
        },
        resetPassword(info) {
            this.changeAccountInfo = info
            this.showModal = true
        },
        accountDel(uid, _index) {
            const that = this
            this.$confirm({
                title: '确定删除该账号？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    that.$apis
                        .user_del({ uid: uid })
                        .then(res => {
                            that.dataList.splice(_index, 1)
                            that.$nextTick(() => {
                                that.getList()
                            })
                            that.$message.success('删除成功')
                        })
                        .catch(err => {})
                }
            })
        }
    }
}
</script>

<style lang="less" scoped></style>
