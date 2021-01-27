export default [
  {
    title: '序号',
    dataIndex: 'key',
    align: 'center',
    width: '50px'
  },
  {
    title: '流水号',
    dataIndex: 'serial_id',
    align: 'center',
  },
  {
    title: '操作单号',
    dataIndex: 'out_serial_id',
    align: 'center',
  },
  {
    title: 'UserID',
    dataIndex: 'user_id',
    align: 'center',
  },
  {
    title: '姓名/机构名(中)',
    dataIndex: 'real_name',
    align: 'center',
  },
  {
    title: '时间',
    dataIndex: 'update_time',
    align: 'center',
  },
  {
    title: '订单类型',
    dataIndex: 'cash_type',
    align: 'center',
    customRender(value,row){
      const valueKey={
        73:'入金',
        79:'出金'
      }
      return valueKey[row.cash_type]
    }
  },
  {
    title: '出入金方式',
    dataIndex: 'cash_mode',
    align: 'center',
    customRender(value,row){
      const valueKey={
        49:'转账',50:'支票',51:'现金',52:'换汇',53:'银期转换'
      }
      return valueKey[row.cash_mode]
    }
  },
  {
    title: '币种',
    dataIndex: 'currency_no',
    align: 'center',
  },
  {
    title: '金额',
    dataIndex: 'cash_value',
    align: 'center',
  },
  {
    title: '操作账户',
    dataIndex: 'account_type',
    align: 'center',
    customRender(value,row){
      return 'A账户'
    }
  },
  /* {
    title: '对应账户资金量',
    dataIndex: 'total_amount',
    align: 'center',
  }   */
]