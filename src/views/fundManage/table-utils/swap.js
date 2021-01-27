export default [
  {
    title: '序号',
    dataIndex: 'key',
    align: 'center',
    width: '5%'
  },
  {
    title: '服务单号',
    dataIndex: 'transfer_no',
    align: 'center',
    width: '8%'
  },
  {
    title: 'UserId',
    dataIndex: 'users.user_id',
    align: 'center',
    width: '6%'
  },
  {
    title: '姓名/机构名(中)',
    dataIndex: 'users.real_name',
    align: 'center',
    width: '7%'
  },
  {
    title: '账户',
    dataIndex: 'account',
    align: 'center',
    width: '7%'
  },
  {
    title: '换出币种',
    dataIndex: 'currency_out',
    align: 'center',
    width: '6%'
  },
  {
    title: '换出金额',
    dataIndex: 'amount_out',
    align: 'center',
    width: '8%'
  },
  {
    title: '转出资金单号',
    dataIndex: 'funds_no_out',
    align: 'center',
    width: '8%',
    customRender(value, row) {
      const funds_no = value ? value : '-'
      return funds_no
    }
  },
  {
    title: '汇率',
    dataIndex: 'rate',
    align: 'center',
    width: '7%',
    customRender(value, row) {
      const rateDesc = `${row.currency_out} 1 = ${row.currency_in} ${row.rate}`
      return rateDesc
    }
  },
  {
    title: '换入币种',
    dataIndex: 'currency_in',
    align: 'center',
    width: '6%'
  },
  {
    title: '换入金额',
    dataIndex: 'amount_in',
    align: 'center',
    width: '8%'
  },
  {
    title: '转入资金单号',
    dataIndex: 'funds_no_in',
    align: 'center',
    width: '8%',
    customRender(value, row) {
      const funds_no = value ? value : '-'
      return funds_no
    }
  },
  {
    title: '订单时间',
    dataIndex: 'created_at',
    align: 'center',
    width: '8%'
  },
  {
    title: '处理情况',
    dataIndex: 'status',
    align: 'center',
    width: '7%',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '处理时间',
    dataIndex: 'handler_at',
    align: 'center',
    width: '8%',
    customRender(value, row) {
      const handler_at = value ? value : '-'
      return handler_at
    }
  },
  {
    title: '处理人',
    dataIndex: 'handler_user.name',
    align: 'center',
    width: '7%',
    customRender(value, row) {
      const handler = value ? value : '-'
      return handler
    }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    width: '180px',
    fixed: 'right',
    scopedSlots: { customRender: 'operation' }
  }
]
