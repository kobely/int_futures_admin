export default [
  {
    title: '序号',
    dataIndex: 'key',
    align: 'center',
    width: 50
  },
  {
    title: '资金单号',
    dataIndex: 'funds_no',
    align: 'center',
    width: 100
  },
  {
    title: 'UserID',
    dataIndex: 'user_id',
    align: 'center',
    width: 80
  },
  {
    title: '姓名/机构名(中)',
    dataIndex: 'remitter_name',
    align: 'center'
  },
  {
    title: '账户号',
    dataIndex: 'funds_account',
    align: 'center'
  },
  {
    title: '入金方式',
    dataIndex: 'pay_type',
    align: 'center',
    customRender(value, row) {
      const payTypeKey = {
        1: '汇款',
        2: '划转',
        3: '录入',
        4: '换汇'
      }
      return payTypeKey[row.pay_type]
    }
  },
  {
    title: '入金币种',
    dataIndex: 'remittance_currency',
    align: 'center'
  },
  {
    title: '入金金额',
    dataIndex: 'amount',
    align: 'center'
  },
  {
    title: '手续费',
    dataIndex: 'handling_fee',
    align: 'center'
  },
  {
    title: '到账金额',
    dataIndex: 'received_amount',
    align: 'center'
  },
  {
    title: '订单状态',
    dataIndex: 'order_status',
    align: 'center',
    customRender(value, row) {
      const orderStatusKey = {
        0: '待处理',
        1: '处理成功',
        2: '处理失败',
        3: '自动处理',
        4: '退款到账'
      }
      return orderStatusKey[row.order_status]
    }
  },
  {
    title: '入金时间',
    dataIndex: 'created_at',
    align: 'center',
    customRender(value, row) {
      return value || '-'
    }
  },
  {
    title: '申请人',
    dataIndex: 'applicant_info_name',
    align: 'center',
    width: '7%',
    customRender(value, row) {
      const applicantName = row.applicant_info && row.applicant_info.name ? row.applicant_info.name : '-'
      return applicantName
    }
  },
  {
    title: '审批时间',
    dataIndex: 'updated_at',
    align: 'center',
    width: '8%',
    customRender(value, row) {
      const handle_at = row.order_status == 0 ? '-' : value
      return handle_at
    }
  },
  {
    title: '审批人',
    dataIndex: 'handler_info',
    align: 'center',
    customRender(value, row) {
      return (row.handler_info && row.handler_info.name) || '-'
    }
  },
  {
    title: '到账时间',
    dataIndex: 'received_at',
    align: 'center',
    customRender(value, row) {
      return value || '-'
    }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    width: 150,
    scopedSlots: { customRender: 'operation' }
  }
]
