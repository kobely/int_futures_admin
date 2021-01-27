import axios from 'axios'
import qs from 'qs'
import { message } from 'ant-design-vue'
import router from '../router'
import { loading } from './util'

const serve = axios.create({
  baseURL: api_config.VUE_APP_API_SETTLEMENT_URL, // api 的 base_url
  timeout: 30000, // request timeout
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
})

let pending = new Map()
/**
 * 添加请求
 * @param {Object} config
 */
const addPending = config => {
  const url = [config.method, config.url, qs.stringify(config.params), qs.stringify(config.data)].join('&')
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken(cancel => {
      if (!pending.has(url)) {
        // 如果 pending 中不存在当前请求，则添加进去
        pending.set(url, cancel)
      }
    })
}

/**
 * 移除请求
 * @param {Object} config
 */
const removePending = config => {
  const url = [config.method, config.url, qs.stringify(config.params), qs.stringify(config.data)].join('&')
  if (pending.has(url)) {
    // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
    const cancel = pending.get(url)
    cancel(url)
    pending.delete(url)
  }
}

/**
 * 清空 pending 中的请求（在路由跳转时调用）
 */
export const clearPending = () => {
  for (const [url, cancel] of pending) {
    cancel(url)
  }
  pending.clear()
}

const err = error => {
  if (axios.isCancel(error)) {
    console.log('repeated request: ' + error.message)
  } else {
    const _error = error.response
    if (_error) {
      handleErrorCode(error)
    } else {
      message.error('网络异常，请稍后再试！')
    }
  }
  return Promise.reject(error)
}

function handleErrorCode(err) {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '错误请求'
        break
      case 401:
        err.message = '未授权，请重新登录'
        break
      case 403:
        err.message = '拒绝访问'
        break
      case 404:
        err.message = '请求错误,未找到该资源'
        break
      case 405:
        err.message = '请求方法未允许'
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器端出错'
        break
      case 501:
        err.message = '网络未实现'
        break
      case 502:
        err.message = '网络错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网络超时'
        break
      case 505:
        err.message = 'http版本不支持该请求'
        break
      default:
        err.message = `连接错误${err.response.status}`
    }
    const errData = {
      code: err.response.status,
      message: err.message
    }
    message.error(err.message)
    // 统一错误处理可以放这，例如页面提示错误...
    console.log('统一错误处理: ', errData)
  }
}

// request interceptor
serve.interceptors.request.use(config => {
  // const token = sessionStorage.getItem('token')
  // if (token) {
  //     config.headers['Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  // }
  removePending(config) // 请求开始前，对之前的请求做检查取消操作
  addPending(config) // 将当前请求添加到pending中
  return config
}, err)

// response interceptor
serve.interceptors.response.use(response => {
  removePending(response) // 请求结束后，移除本次请求

  const data = response.data
  if (data.code == 0 || data.code == 119) {
    console.log('成功')
    return Object.keys(data.data).length ? data.data : data
  } else if (data.code == 401) {
    let redirectUrl = window.location.hash.split('#')[1]
    message.error(data.msg || '登陆失效,请重新登录')
    router.push({ path: '/login', query: { redirect: redirectUrl } })
  } else {
    message.error(data.msg || '请求出问题啦！')
    return Promise.reject(response)
  }
}, err)

const fetch = opt => {
  return new Promise((resolve, reject) => {
    const { url, method, data, needLoading, ...config } = opt
    const params = {
      url,
      method,
      [method.toLowerCase() == 'get' ? 'params' : 'data']: data,
      ...config
    }

    // loading提示显示
    if (needLoading) {
      loading.show()
    }

    serve(params)
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        loading.hide()
      })
  })
}

export { fetch }
