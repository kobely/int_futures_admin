import { axios } from '@/utils/request'

/**
 * 个人用户管理列表/待审核列表
 * @param {Object} params
 */
export function get_account_list(params) {
  return axios({
    url: '/api/admin/usermanager/account_list',
    method: 'get',
    data: params
  })
}

/**
 * 个人用户管理详情
 * @param {Object} params
 */
export function get_account_detail(params) {
  return axios({
    url: '/api/admin/usermanager/account_detail',
    method: 'get',
    data: params,
    needLoading: true
  })
}

/**
 * 个人用户管理详情_扩展信息
 * @param {Object} params
 */
export function get_account_extend(params) {
  return axios({
    url: '/api/admin/usermanager/account_extend',
    method: 'get',
    data: params,
    needLoading: true
  })
}

/**
 * 个人用户管理校验
 * @param {Object} params
 */
export function set_account_verify(params) {
  return axios({
    url: '/api/admin/usermanager/account_verify',
    method: 'post',
    data: params
  })
}

/**
 * 注册列表
 * @param {Object} params
 */
export function get_register_list(params) {
  return axios({
    url: '/api/admin/usermanager/list',
    method: 'get',
    data: params
  })
}

/**
 * 资金托管子账号列表
 * @param {Object} params
 */
export function get_sub_account_list(params) {
  return axios({
    url: '/api/admin/funds/sub_account_list',
    method: 'get',
    data: params
  })
}

/**
 * 开通资金托管子账号
 * @param {Object} params
 */
export function open_sub_account(params) {
  return axios({
    url: '/api/admin/funds/open_sub_account',
    method: 'post',
    data: params
  })
}

/**
 * 人工开通
 * @param {Object} params
 */
export function set_human_open(params) {
  return axios({
    url: '/api/admin/usermanager/human_open',
    method: 'post',
    data: params
  })
}

/**
 * 激活获取账户资金总计
 * @param {Object} params
 */
export function get_account_info(params) {
  return axios({
    url: '/api/admin/funds/account/balance',
    method: 'post',
    data: params,
    needLoading: true
  })
}

/**
 * 账号激活
 * @param {Object} params
 */
export function set_account_activity(params) {
  return axios({
    url: '/api/admin/usermanager/account_activity',
    method: 'post',
    data: params
  })
}

/**
 * 获取银行列表
 * @param {Object} params
 */
export function get_bank_list(params) {
  return axios({
    url: '/api/admin/funds/bank_list',
    method: 'get',
    data: params
  })
}

/**
 * 【银行卡】添加
 * @param {Object} params
 */
export function add_bank_card(params) {
  return axios({
    url: '/api/admin/funds/add_bank',
    method: 'post',
    data: params
  })
}

/**
 * 【银行卡】详情
 * @param {Object} params
 */
export function get_bank_info(params) {
  return axios({
    url: '/api/admin/funds/bank_info',
    method: 'get',
    data: params
  })
}

/**
 * 【银行卡】修改
 * @param {Object} params
 */
export function update_bank_info(params) {
  return axios({
    url: '/api/admin/funds/up_bank',
    method: 'post',
    data: params
  })
}

/**
 * 【银行卡】解绑
 * @param {Object} params
 */
export function unbind_bank_card(params) {
  return axios({
    url: '/api/admin/funds/del_bank',
    method: 'post',
    data: params
  })
}
