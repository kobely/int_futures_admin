export default [
  {
    title: '序号',
    dataIndex: 'key',
    align: 'center',
    width:50,
  },
  {
    title: '标题',
    dataIndex: 'zh_title',
    align: 'center',
    width:'10%',
  },
  {
    title: '状态',
    dataIndex: 'shelf_status',
    align: 'center',
    width:'5%',
    customRender(value,row,index){
      const valueKeys={
        1:'上架',2:'待上架',3:'下架'
      }
      return valueKeys[row.shelf_status]
    }
  },
  {
    title: '位置',
    dataIndex: 'notice_type',
    align: 'center',
    width:'10%',
    customRender(value,row){
      return 'APP应用--首页-跑马灯'
    }
  },
  {
    title: '推送周期',
    dataIndex: 'start_time',
    align: 'center',
    width:'110px',
    customRender(value,row){
      return `${row.start_time}开始\n${row.end_time}结束`
    }
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    align: 'center',
    width:'8%',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    width:'130px',
    scopedSlots: { customRender: 'operation' }
  },
  
]