import { axios } from '@/utils/request'

/**
 * 获取配置状态
 * @param {Object} params
 */
export function get_exchange_status(params) {
  return axios({
    url: '/api/admin/exchange/list',
    method: 'get',
    data: params
  })
}

/**
 * 更新配置状态
 * @param {Object} params
 */
export function set_exchange_update(params) {
  return axios({
    url: '/api/admin/exchange/update',
    method: 'post',
    data: params
  })
}
