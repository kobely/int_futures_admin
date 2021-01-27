export default [
  {
    title: '序号',
    dataIndex: 'key',
    align: 'center',
    width: 50
  },
  {
    title: '文档名称',
    dataIndex: 'title_zhcn',
    align: 'center',
    width: '10%'
  },
  {
    title: '发布时间',
    dataIndex: 'created_at',
    align: 'center',
    width: '7%'
  },
  {
    title: '更新时间',
    dataIndex: 'updated_at',
    align: 'center',
    width: '7%'
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    width: '5%',
    customRender(value, row, index) {
      const valueKeys = {
        1: '启用',
        0: '禁用'
      }
      return valueKeys[row.status]
    }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    width: '130px',
    scopedSlots: { customRender: 'operation' }
  }
]
