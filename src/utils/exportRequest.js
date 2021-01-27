import axios from 'axios'
import { message } from 'ant-design-vue'

export function exportRequest(data) {
  return new Promise((resolve,reject)=>{
    axios({
      method: data.method,
      url: `${data.url}${data.params ? '?' + data.params : ''}`,
      responseType: 'blob'
    }).then((res) => {
      const link = document.createElement('a')
      let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
  
      // link.download = data.fileName //下载的文件名
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      resolve(res)
    }).catch(error => {
      message.error(error.msg || '网络连接错误')
      console.log(error)
      reject(error)
    })
  })
}