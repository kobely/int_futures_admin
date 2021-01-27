<template>
  <div class="user-layout-wrapper">
    <div class="container">
      <div class="top">
        <div class="header">
          <span class="title">高盈金融后台管理系统</span>
        </div>
      </div>
      <div class="main">
        <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="账号"
              v-decorator="[
                'email',
                {
                  rules: [{ required: true, message: '请输入帐号' }, { validator: handleEmail }],
                  validateTrigger: 'change',
                  initialValue: state.email
                }
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              type="password"
              autocomplete="false"
              placeholder="密码 "
              v-decorator="[
                'password',
                {
                  rules: [{ required: true, message: '请输入密码' }],
                  validateTrigger: 'blur',
                  initialValue: state.psd
                }
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-checkbox
              v-decorator="[
                'rememberMe',
                {
                  valuePropName: 'checked',
                  initialValue: true
                }
              ]"
              >记住密码</a-checkbox
            >
            <span @click="showTip" class="forget-password" style="float: right;">忘记密码</span>
          </a-form-item>

          <a-form-item style="margin-top: 24px;">
            <a-button size="large" type="primary" htmlType="submit" class="login-button" :loading="state.loginBtn" :disabled="state.loginBtn"
              >确定</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
// import md5 from "md5";
import { Form, Icon, Input, Button } from 'ant-design-vue'
import { mapMutations, mapActions } from 'vuex'
import { timeFix } from '@/utils/util'

export default {
  components: {
    [Form.name]: Form,
    [Icon.name]: Icon,
    [Form.Item.name]: Form.Item,
    [Input.name]: Input,
    [Button.name]: Button
  },
  data() {
    return {
      form: this.$form.createForm(this),
      state: {
        loginBtn: false,
        email: '',
        psd: ''
      }
    }
  },
  created() {
    this.getLoginInfo()
  },
  methods: {
    ...mapMutations(['SET_SELECT_KEYS']),
    ...mapActions(['Login']),
    // handler
    handleEmail(rule, value, callback) {
      const regex = /^\w+(\.?\w+)?@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/

      if (value && !regex.test(value)) {
        callback('账号输入错误')
      }
      callback()
    },
    // 登录操作
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          console.log('login form', values)
          const loginParams = { ...values }
          loginParams.source = 1

          delete loginParams.rememberMe
          // this.delCookie('int_futures_server_session')
          Login(loginParams)
            .then(res => {
              if (values.rememberMe) {
                let userInfo = `${values.email}&${values.password}`
                this.setCookie('userInfo', userInfo, 7 * 24 * 60)
              } else {
                this.delCookie('userInfo')
              }
              this.loginSuccess(res)
            })
            .catch(err => {})
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    // 登录跳转
    jumpUrl(url) {
      this.SET_SELECT_KEYS([url])
      this.$router.replace(url)
    },
    // 登录成功回调
    loginSuccess(res) {
      const url = this.$route.query.redirect
      const rules = res.rules

      for (let item in rules) {
        const rulesList = rules[item]

        if (url && url != '/login') {
          const isExist = rulesList.some(item => item.path == url)

          if (isExist) {
            this.jumpUrl(url)
          } else {
            this.jumpUrl(rulesList[0].path)
          }
        } else {
          this.jumpUrl(rulesList[0].path)
        }
        break
      }

      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
    },
    // 获取cookie中的账号密码
    getLoginInfo() {
      let userInfo = this.getCookie('userInfo')
      if (userInfo) {
        this.state.email = userInfo.split('&')[0]
        this.state.psd = userInfo.split('&')[1]
      }
    },
    // 设置cookie
    setCookie: function(c_name, value, expiremMinutes) {
      var exdate = new Date()
      exdate.setTime(exdate.getTime() + expiremMinutes * 60 * 1000)
      document.cookie = c_name + '=' + escape(value) + (expiremMinutes == null ? '' : ';expires=' + exdate.toGMTString())
    },
    // 读取cookie
    getCookie: function(c_name) {
      if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + '=')
        if (c_start != -1) {
          c_start = c_start + c_name.length + 1
          var c_end = document.cookie.indexOf(';', c_start)
          if (c_end == -1) c_end = document.cookie.length
          return unescape(document.cookie.substring(c_start, c_end))
        }
      }
      return ''
    },
    // 删除cookie
    delCookie: function(c_name) {
      var exp = new Date()
      exp.setTime(exp.getTime() - 1)
      var cval = this.getCookie(c_name)
      if (cval != null) {
        document.cookie = c_name + '=' + cval + ';expires=' + exp.toGMTString()
      }
    },
    showTip() {
      this.$info({
        title: '提示',
        content: '忘记账号密码了？找开发小哥哥呀！'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-wrapper {
  height: 100%;
  .container {
    width: 100%;
    min-height: 100%;
    background: #f0f2f5 url('../../assets/background.svg') no-repeat 50%;
    background-size: 100%;
    padding: 110px 20px 0;
    position: relative;
    .top {
      margin-bottom: 50px;
      text-align: center;
      .header {
        .title {
          font-size: 33px;
          color: rgba(0, 0, 0, 0.85);
          font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
    }
    .main {
      min-width: 260px;
      max-width: 368px;
      margin: 0 auto;
    }
  }
}
.user-layout-login {
  .forget-password {
    font-size: 14px;
    color: #1890ff;
    cursor: pointer;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
</style>
