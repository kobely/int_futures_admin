export default [
  {
    title: '序号',
    dataIndex: 'key',
    align: 'center',
    width: '60px'
  },
  {
    title: '日期',
    dataIndex: 'cash_date',
    align: 'center'
  },
  {
    title: '当日出金笔数',
    dataIndex: 'cash_withdraw_count',
    align: 'center'
  },
  {
    title: '当日出金流水总额',
    dataIndex: 'cash_withdraw_value',
    align: 'center'
  },
  {
    title: '当日入金笔数',
    dataIndex: 'cash_recharge_count',
    align: 'center'
  },
  {
    title: '当日入金流水总额',
    dataIndex: 'cash_recharge_value',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]
