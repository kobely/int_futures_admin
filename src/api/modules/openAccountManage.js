import { axios } from '@/utils/request'
import { fetch } from '@/utils/request_settlement'

/**
 * 结算列表
 * @param {Object} params
 */
export function get_statement_list(params) {
  return fetch({
    url: '/api/admin/statement/lists',
    method: 'get',
    data: params
  })
}

/**
 * 分发邮件总数
 * @param {Object} params
 */
export function email_count(params) {
  return fetch({
    url: '/api/admin/statement/email/count',
    method: 'get',
    data: params
  })
}

/**
 * 分发邮件
 * @param {Object} params
 */
export function distribute_email(params) {
  return fetch({
    url: '/api/admin/statement/email',
    method: 'get',
    data: params
  })
}

/**
 * 发送邮件
 * @param {Object} params
 */
export function send_email(params) {
  return fetch({
    url: '/api/admin/statement/email/once',
    method: 'get',
    data: params
  })
}

/**
 * 【开户】获取全部地区码
 * @param {Object} params
 */
export function get_address_list(params) {
  return axios({
    url: '/api/tools/get_admin_address_lists',
    method: 'get',
    data: params
  })
}

/**
 * 【开户】获取税务地区列表
 * @param {Object} params
 */
export function get_tax_place_list(params) {
  return axios({
    url: '/api/account/tax/place/lists',
    method: 'get',
    data: params
  })
}

/**
 * 【开户】获取全部国家名称
 * @param {Object} params
 */
export function get_all_country_list(params) {
  return axios({
    url: '/api/tools/get_country_lists',
    method: 'get',
    data: params
  })
}

/**
 * 【开户】 获取适当性，风险评估，客户声明结果
 * @param {Object} params
 */
export function get_info_extend(params) {
  return axios({
    url: '/api/admin/usermanager/account/get_info_extend',
    method: 'get',
    data: params
  })
}

/**
 * 【开户】保存适当性调查
 * @param {Object} params
 */
export function save_examine(params) {
  return axios({
    url: '/api/admin/usermanager/account/save_examine',
    method: 'post',
    data: params
  })
}

/**
 * 【开户】保存风险评估
 * @param {Object} params
 */
export function save_risk_assessment(params) {
  return axios({
    url: '/api/admin/usermanager/account/save_risk_assessment',
    method: 'post',
    data: params
  })
}

/**
 * 【开户】保存客户声明
 * @param {Object} params
 */
export function save_customer_State(params) {
  return axios({
    url: '/api/admin/usermanager/account/save_customer_State',
    method: 'post',
    data: params
  })
}

/**
 * 【开户】提交开户信息
 * @param {Object} params
 */
export function commit_account_info(params) {
  return axios({
    url: '/api/admin/usermanager/account/store',
    method: 'post',
    data: params,
    needLoading: true
  })
}

/**
 * 【开户】修改开户信息
 * @param {Object} params
 */
export function edit_account_info(params) {
  return axios({
    url: '/api/admin/usermanager/account/edit',
    method: 'post',
    data: params,
    needLoading: true
  })
}

/**
 * 【开户】开户详情
 * @param {Object} params
 */
export function get_open_account_detail(params) {
  return axios({
    url: '/api/admin/usermanager/account/detail',
    method: 'get',
    data: params,
    needLoading: true
  })
}

/**
 * 【开户】下载开户申请书
 * @param {Object} params
 */
export function get_account_statement(params) {
  return axios({
    url: '/api/admin/usermanager/account/statement',
    method: 'get',
    data: params,
    needLoading: true
  })
}

/**
 * 下载获取文件流
 * @param {Object} params
 */
export function get_file_pdf(params) {
  return axios({
    url: '/api/admin/usermanager/pdf',
    method: 'get',
    data: params,
    responseType: 'blob',
    needLoading: true
  })
}
