import { axios } from '@/utils/request'

/**
 * 登录
 * @param {Object} params
 */
export function login(params) {
  return axios({
    url: '/api/admin/auth/login',
    method: 'post',
    data: params
  })
}

/**
 * 退出
 * @param {Object} params
 */
export function logout(params) {
  return axios({
    url: '/api/admin/auth/logout',
    method: 'post',
    data: params
  })
}

/**
 * 用户信息
 * @param {Object} params
 */
export function getUserInfo(params) {
  return axios({
    url: '/api/admin/auth/user_info',
    method: 'get',
    data: params
  })
}

/**
 * 修改密码
 * @param {Object} params
 */
export function change_password(params) {
  return axios({
    url: '/api/admin/auth/change_password',
    method: 'post',
    data: params
  })
}

/**
 * oss图片上传公共接口
 * @param {Object} params
 */
export function uploadImgMulti(params) {
  return axios({
    url: '/api/tools/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: params
  })
}
