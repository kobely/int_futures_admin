import { axios } from '@/utils/request'

/**
 * 用户-列表
 * @param {Object} params
 */
export function get_user_list(params) {
    return axios({
        url: '/api/admin/access/user/list',
        method: 'get',
        data: params
    })
}

/**
 * 用户组-列表
 * @param {Object} params
 */
export function get_user_groups(params) {
    return axios({
        url: '/api/admin/access/user/groups',
        method: 'get',
        data: params
    })
}

/**
 * 用户-添加
 * @param {Object} params
 */
export function user_add(params) {
    return axios({
        url: '/api/admin/access/user/add',
        method: 'post',
        data: params
    })
}

/**
 * 用户-删除
 * @param {Object} params
 */
export function user_del(params) {
    return axios({
        url: '/api/admin/access/user/del',
        method: 'post',
        data: params
    })
}

/**
 * 用户-重置密码
 * @param {Object} params
 */
export function reset_password(params) {
    return axios({
        url: '/api/admin/access/user/reset_password',
        method: 'post',
        data: params
    })
}
