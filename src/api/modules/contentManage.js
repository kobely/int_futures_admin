import { axios } from '@/utils/request'

/**
 * 获取公告列表
 * @param {Object} params
 */
export function getNoticeList(params) {
  return axios({
    url: '/api/admin/notice/list',
    method: 'get',
    data: params
  })
}
/**
 * 获取公告详情
 * @param {Object} params
 */
export function noticeDetail(params) {
  return axios({
    url: '/api/admin/notice/detail',
    method: 'get',
    data: params
  })
}
/**
 * 添加公告
 * @param {Object} params
 */
export function addNotice(params) {
  return axios({
    url: '/api/admin/notice/add',
    method: 'post',
    data: params
  })
}
/**
 * 修改公告
 * @param {Object} params
 */
export function updateNotice(params) {
  return axios({
    url: '/api/admin/notice/edit',
    method: 'post',
    data: params
  })
}
/**
 * 更新公告状态
 * @param {Object} params
 */
export function updateNoticeStatus(params) {
  return axios({
    url: '/api/admin/notice/update/status',
    method: 'post',
    data: params
  })
}
/**
 * 删除公告
 * @param {Object} params
 */
export function deleteNotice(params) {
  return axios({
    url: '/api/admin/notice/delete',
    method: 'post',
    data: params
  })
}
/**
 * 公告顺序
 * @param {Object} params
 */
export function sortNotice(params) {
  return axios({
    url: '/api/admin/notice/sort',
    method: 'post',
    data: params
  })
}

/**
 * 帮助文档列表
 * @param {Object} params
 */
export function get_help_doc_list(params) {
  return axios({
    url: '/api/admin/help/list',
    method: 'get',
    data: params
  })
}

/**
 * 帮助文档详情
 * @param {Object} params
 */
export function get_help_doc_detail(params) {
  return axios({
    url: '/api/admin/help/detail',
    method: 'get',
    data: params
  })
}

/**
 * 帮助文档添加
 * @param {Object} params
 */
export function add_help_doc(params) {
  return axios({
    url: '/api/admin/help/add',
    method: 'post',
    data: params
  })
}

/**
 * 帮助文档修改
 * @param {Object} params
 */
export function update_help_doc(params) {
  return axios({
    url: '/api/admin/help/edit',
    method: 'post',
    data: params
  })
}

/**
 * 帮助文档删除
 * @param {Object} params
 */
export function delete_help_doc(params) {
  return axios({
    url: '/api/admin/help/delete',
    method: 'post',
    data: params
  })
}

/**
 * 帮助文档上下移
 * @param {Object} params
 */
export function sort_help_doc(params) {
  return axios({
    url: '/api/admin/help/sort',
    method: 'post',
    data: params
  })
}
