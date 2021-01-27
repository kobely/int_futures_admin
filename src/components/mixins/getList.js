import { Table, Form, Input, Select, Button, Divider } from 'ant-design-vue'
import { mapState, mapMutations } from 'vuex'

export const list = {
    components: {
        [Table.name]: Table,
        [Form.name]: Form,
        [Form.Item.name]: Form.Item,
        [Input.name]: Input,
        [Select.name]: Select,
        [Select.Option.name]: Select.Option,
        [Button.name]: Button,
        [Divider.name]: Divider,
    },
    data() {
        return {
            pagination: {
                // 分页配置
                current: 1,
                pageSize: 10,
                showQuickJumper: true,
                total: 0,
                onChange: (page, pageSize) => this.changePage(page, pageSize),
            },
            dataList: [],
            queryParam: {},
        }
    },
    computed: {
        ...mapState({
            clickable: (state) => state.clickable,
        }),
        tableHeight() {
            const w_height = window.innerHeight
            const tableTop = 80 + 16 + 60
            const maxtableHeadHeight = 98
            const tableBottom = 32 + 16 * 4
            return w_height - tableTop - maxtableHeadHeight - tableBottom
        },
    },
    activated() {
        let query = {}
        if (sessionStorage.getItem('query')) {
            query = JSON.parse(sessionStorage.getItem('query'))
            sessionStorage.removeItem('query')
        } else {
            this.queryParam = {}
        }

        this.getList(query)
    },
    methods: {
        ...mapMutations(['SET_CLICK']),
        // 重置
        resetQuery() {
            this.queryParam = {}
            this.pagination.current = 1
            this.getList()
        },
        // 页码变化回调
        changePage(page) {
            this.pagination.current = page
            this.getList()
        },
        // 搜索
        handleSubmit(e) {
            e.preventDefault()
            this.pagination.current = 1
            this.getList()
        },
    },
}
