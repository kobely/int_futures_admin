export default [
  {
    title: '序号',
    dataIndex: 'key',
    align: 'center',
    width:50
  },
  {
    title: '资金单号',
    dataIndex: 'transfer_no',
    align: 'center',
    width:100
  },
  {
    title: 'UserID',
    dataIndex: 'get_user_info',
    align: 'center',
    width:80,
    customRender(value,row){
      return row.get_user_info&&row.get_user_info.user_id||''
    }
  },
  {
    title: '姓名/机构名(中)',
    dataIndex: 'real_name',
    align: 'center',
    customRender(value,row){
      return row.get_user_info&&row.get_user_info.real_name||''
    }
  },
  {
    title: '标准合约账户(A账户)',
    dataIndex: 'a_account',
    align: 'center',
  },
  {
    title: '划转金额(USD)',
    dataIndex: 'amount',
    align: 'center',
  },
  {
    title: '连续合约账户(B账户)',
    dataIndex: 'b_account',
    align: 'center',
  },
  {
    title: '转出资金单号',
    dataIndex: 'funds_no_out',
    align: 'center',
  },
  {
    title: '转入资金单号',
    dataIndex: 'funds_no_in',
    align: 'center',
  },
  {
    title: '订单状态',
    dataIndex: 'transfer_status',
    align: 'center',
    customRender(value,row){
      const valueKeys={
        0:'待处理',1:'成功'
      }
      return valueKeys[row.transfer_status]
    }
  },
  {
    title: '订单时间',
    dataIndex: 'created_at',
    align: 'center',
  },
  {
    title: '处理情况',
    dataIndex: 'handler_status',
    align: 'center',
    customRender(value,row){
      const valueKeys={
        0:'未处理',1:'已处理'
      }
      return valueKeys[row.handler_status]
    }
  },
  {
    title: '处理时间',
    dataIndex: 'handler_at',
    align: 'center',
  },
  {
    title: '处理人',
    dataIndex: 'admin_name',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    width:150,
    scopedSlots: { customRender: 'operation' }
  },
]