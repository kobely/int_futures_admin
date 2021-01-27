import { axios } from '@/utils/request'

/**
 * 获取客户入金列表
 * @param {Object} params
 */
export function getFundList(params) {
  return axios({
    url: '/api/admin/funds/recharge_list',
    method: 'get',
    data: params
  })
}
/**
/**
 * 获取资金流水
 * @param {Object} params
 */
export function getFlowList(params) {
  return axios({
    url: '/api/admin/funds/flow_list',
    method: 'get',
    data: params
  })
}
/**
 * 客户资金流水日报
 * @param {Object} params
 */
export function getFlowDailyList(params) {
  return axios({
    url: '/api/admin/funds/flow_daily',
    method: 'get',
    data: params
  })
}
/**
 * 资金管理列表
 * @param {Object} params
 */
export function accountList(params) {
  return axios({
    url: '/api/admin/funds/account/list',
    method: 'get',
    data: params
  })
}
/**
 * 资金划转列表
 * @param {Object} params
 */
export function transferList(params) {
  return axios({
    url: '/api/admin/funds/transfer_list',
    method: 'get',
    data: params
  })
}
/**
 * 获取客户入金详情
 * @param {Object} params
 */
export function getFundDetail(params) {
  return axios({
    url: '/api/admin/funds/recharge_detail',
    method: 'get',
    data: params
  })
}

/**
 * 前端用户详情
 * @param {Object} params
 */
export function frontUserDetail(params) {
  return axios({
    url: '/api/admin/usermanager/front_user_detail',
    method: 'get',
    data: params
  })
}
/**
 * 处理资金订单
 * @param {Object} params
 */
export function handleFundOrder(params) {
  return axios({
    url: '/api/admin/funds/recharge_update',
    method: 'post',
    data: params
  })
}
/**
 * 客户入金记录录入
 * @param {Object} params
 */
export function fundsOrderSave(params) {
  return axios({
    url: '/api/admin/funds/recharge_save',
    method: 'post',
    data: params
  })
}
/**
 * 客户入金记录录入
 * @param {Object} params
 */
export function transferHandler(params) {
  return axios({
    url: '/api/admin/funds/transfer_handler',
    method: 'post',
    data: params
  })
}

/**
 * 获取资金划转处理数据信息
 * @param {Object} params
 */
export function getTransferInfo(params) {
  return axios({
    url: '/api/admin/funds/transfer_info',
    method: 'get',
    data: params
  })
}
/**
 * 导出数据
 * @param {Object} params
 */
export function exportTransfer(params) {
  return axios({
    url: '/api/admin/funds/transfer_export',
    method: 'get',
    data: params
  })
}

/**
 * 客户出金记录列表
 * @param {Object} params
 */
export function get_withdraw_list(params) {
  return axios({
    url: '/api/admin/funds/withdraw_list',
    method: 'get',
    data: params
  })
}

/**
 * 客户出金记录详情
 * @param {Object} params
 */
export function get_withdraw_detail(params) {
  return axios({
    url: '/api/admin/funds/withdraw_detail',
    method: 'get',
    data: params,
    needLoading: true
  })
}

/**
 * 客户出金记录录入
 * @param {Object} params
 */
export function withdraw_save(params) {
  return axios({
    url: '/api/admin/funds/withdraw_save',
    method: 'post',
    data: params
  })
}

/**
 * 客户出金记录处理
 * @param {Object} params
 */
export function withdraw_update(params) {
  return axios({
    url: '/api/admin/funds/withdraw_update',
    method: 'post',
    data: params,
    needLoading: true
  })
}

/**
 * 换汇-列表
 * @param {Object} params
 */
export function get_exchange_list(params) {
  return axios({
    url: '/api/admin/funds/exchange_list',
    method: 'get',
    data: params
  })
}

/**
 * 换汇-详情
 * @param {Object} params
 */
export function get_exchange_detail(params) {
  return axios({
    url: '/api/admin/funds/exchange_info',
    method: 'get',
    data: params,
    needLoading: true
  })
}

/**
 * 获取汇率
 * @param {Object} params
 */
export function get_rate_list(params) {
  return axios({
    url: '/api/admin/funds/rate_list',
    method: 'get',
    data: params
  })
}

/**
 * 换汇-处理
 * @param {Object} params
 */
export function set_exchange_deal(params) {
  return axios({
    url: '/api/admin/funds/exchange_handel',
    method: 'post',
    data: params
  })
}

/**
 * 换汇-录入
 * @param {Object} params
 */
export function set_exchange_add(params) {
  return axios({
    url: '/api/admin/funds/exchange_add',
    method: 'post',
    data: params
  })
}

/**
 * 【汇率】列表
 * @param {Object} params
 */
export function get_manage_rate_list(params) {
  return axios({
    url: '/api/admin/funds/rate_manager_list',
    method: 'get',
    data: params
  })
}

/**
 * 【汇率】添加
 * @param {Object} params
 */
export function add_manage_rate(params) {
  return axios({
    url: '/api/admin/funds/rate_manager_add',
    method: 'post',
    data: params
  })
}