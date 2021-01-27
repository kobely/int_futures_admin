export default [
  {
    title: '序号',
    dataIndex: 'key',
    align: 'center',
    width: '5%'
  },
  {
    title: 'UserID',
    dataIndex: 'user_account',
    align: 'center',
    width: '8%'
  },
  {
    title: '姓名/机构名(中)',
    dataIndex: 'cn_name',
    align: 'center',
    width: '12%'
  },
  {
    title: '姓名/机构名(英)',
    dataIndex: 'en_name',
    align: 'center',
    width: '12%',
    customRender(value){
      return value ? value : '-'
    }
  },
  {
    title: '银行',
    dataIndex: 'bank_name',
    align: 'center',
    width: '10%'
  },
  {
    title: '银行卡号',
    dataIndex: 'bank_card',
    align: 'center',
    width: '12%'
  },
  {
    title: '支持币种',
    dataIndex: 'currency_type',
    align: 'center',
    width: '10%',
    customRender(value){
      return value && value.replace('CNY','人民币').replace('HKD','港币').replace('USD','美元')
    }
  },
  {
    title: '是否主银行卡',
    dataIndex: 'is_main',
    align: 'center',
    width: '10%',
    customRender(value){
      return value ? '是' : '否'
    }
  },
  {
    title: '状态',
    dataIndex: 'is_activity',
    align: 'center',
    width: '8%',
    customRender(value,row,index){
      const statusObj={
        0:'已解绑',
        1:'已绑定'
      }
      return statusObj[value]
    }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]