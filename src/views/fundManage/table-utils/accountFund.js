export default [
  {
    title: '序号',
    dataIndex: 'key',
    align: 'center',
    width: '5%'
  },
  {
    title: 'UserID',
    dataIndex: 'user_id',
    align: 'center',
    width: '8%'
  },
  {
    title: '姓名/机构名(中)',
    dataIndex: 'real_name',
    align: 'center',
    width: '8%'
  },
  {
    title: '是否激活',
    dataIndex: 'is_activity',
    align: 'center',
    width: '6%',
    customRender(value,row){
      const valueKeys={
        1:'激活',2:'待激活',3:'未激活'
      }
      return valueKeys[row.is_activity]
    }
  },
  {
    title: '账户总资金量(base：USD)',
    dataIndex: 'base_balance',
    align: 'center',
    width: '8%',
  },
  {
    title: '标准合约账户号',
    dataIndex: 'futures_login_id',
    align: 'center',
    width: '8%'
  },
  {
    title: '标准合约美元账户',
    dataIndex: 'usd_balance',
    align: 'center',
    width: '10%',
  },
  {
    title: '美元账户可用资金',
    dataIndex: 'usd_can_draw',
    align: 'center',
    width: '10%',
  },
  {
    title: '标准合约港币账户',
    dataIndex: 'hkd_balance',
    align: 'center',
    width: '9%',
  },
  {
    title: '港币账户可用资金',
    dataIndex: 'hkd_can_draw',
    align: 'center',
    width: '9%',
  },
  {
    title: '标准合约人民币账户',
    dataIndex: 'cny_balance',
    align: 'center',
    width: '8%',
  },
  {
    title: '人民币账户可用资金',
    dataIndex: 'cny_can_draw',
    align: 'center',
    width: '10%',
  },
/*   {
    title: '连续合约账户号',
    dataIndex: 'mt4_login_id',
    align: 'center',
    width: '140px',
  },
  {
    title: '连续合约账户资金(USD)',
    dataIndex: 'balance',
    align: 'center',
    width: '140px',
  },
  {
    title: '连续合约账户可用资金(USD)',
    dataIndex: 'fetch_amount',
    align: 'center',
    width: '140px',
  }, */
  
]