export default [
  {
    title: '序号',
    dataIndex: 'key',
    align: 'center',
    width: '5%',
    customCell(record, rowIndex){
      return {
        style: {// 行背景色
          'background-color': record.status == 1 ? '#ffcc33' : '',
        }
      }
    }
  },
  {
    title: '生效日期',
    dataIndex: 'effective_date',
    align: 'center',
    width: '12%',
    customCell(record, rowIndex){
      return {
        style: {// 行背景色
          'background-color': record.status == 1 ? '#ffcc33' : '',
        }
      }
    }
  },
  {
    title: '换出币种',
    dataIndex: 'currency_out',
    align: 'center',
    width: '10%',
    customCell(record, rowIndex){
      return {
        style: {// 行背景色
          'background-color': record.status == 1 ? '#ffcc33' : '',
        }
      }
    }
  },
  {
    title: '换入币种',
    dataIndex: 'currency_in',
    align: 'center',
    width: '10%',
    customCell(record, rowIndex){
      return {
        style: {// 行背景色
          'background-color': record.status == 1 ? '#ffcc33' : '',
        }
      }
    }
  },
  {
    title: '汇率',
    dataIndex: 'rate',
    align: 'center',
    width: '10%',
    customCell(record, rowIndex){
      return {
        style: {// 行背景色
          'background-color': record.status == 1 ? '#ffcc33' : '',
        }
      }
    }
  },
  {
    title: '是否生效',
    dataIndex: 'status',
    align: 'center',
    width: '10%',
    customCell(record, rowIndex){
      return {
        style: {// 行背景色
          'background-color': record.status == 1 ? '#ffcc33' : '',
          'font-size': record.status == 1 ? '18px' : ''
        }
      }
    },
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    align: 'center',
    width: '12%',
    customCell(record, rowIndex){
      return {
        style: {// 行背景色
          'background-color': record.status == 1 ? '#ffcc33' : '',
        }
      }
    },
    customRender(value, row) {
      const handler_at = value ? value : '-'
      return handler_at
    }
  },
  {
    title: '创建人',
    dataIndex: 'created_user.name',
    align: 'center',
    width: '10%',
    customCell(record, rowIndex){
      return {
        style: {// 行背景色
          'background-color': record.status == 1 ? '#ffcc33' : '',
        }
      }
    },
    customRender(value, row) {
      const handler = value ? value : '-'
      return handler
    }
  }
]
