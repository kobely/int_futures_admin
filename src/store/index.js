import Vue from 'vue'
import Vuex from 'vuex'
import apis from '@/api'
import openAccount from './modules/openAccount'
Vue.use(Vuex)

const state = {
  menuList: [],
  token: sessionStorage.getItem('token') || '',
  selectedKeys: JSON.parse(sessionStorage.getItem('selectedKeys')) || ['/userManage/userList'],
  userName: '',
  clickable: false,
  userGroup: []
}

const getters = {}

const mutations = {
  SET_MENULIST(state, list) {
    state.menuList = list
  },
  SET_TOKEN(state, token) {
    sessionStorage.setItem('token', token)
    state.token = token
  },
  SET_SELECT_KEYS(state, selectKeys) {
    sessionStorage.setItem('selectedKeys', JSON.stringify(selectKeys))
    state.selectedKeys = selectKeys
  },
  SET_USERNAME(state, name) {
    state.userName = name
  },
  SET_CLICK(state, isClick) {
    state.clickable = isClick
  },
  SET_USER_GROUP(state, group) {
    state.userGroup = [...group]
  }
}

const actions = {
  // 登录
  Login({ commit }, loginInfo) {
    return new Promise((resolve, reject) => {
      apis
        .login(loginInfo)
        .then(res => {
          commit('SET_TOKEN', res.uid)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  Logout({ commit }) {
    return new Promise((resolve, reject) => {
      apis
        .logout()
        .then(res => {
          commit('SET_TOKEN', '')
          commit('SET_USERNAME', '')
          commit('SET_SELECT_KEYS', [])
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取用户信息、菜单权限
  GetMenuList({ commit }) {
    return new Promise((resolve, reject) => {
      apis
        .getUserInfo()
        .then(res => {
          commit('SET_MENULIST', res.rules)
          commit('SET_USERNAME', res.name)
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取用户组
  GetUserGroup({ commit }) {
    return new Promise((resolve, reject) => {
      apis
        .get_user_groups()
        .then(res => {
          commit('SET_USER_GROUP', res)
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

const store = new Vuex.Store({
  modules: {
    openAccount
  },
  state,
  getters,
  mutations,
  actions
})

export default store
