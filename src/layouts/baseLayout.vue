<template>
  <a-layout class="layout-custom-trigger">
    <a-layout-sider
      collapsible
      breakpoint="xl"
      width="230px"
      style="overflow: 'auto',min-height: '100vh'"
      v-model="collapsed"
      v-if="!$route.meta.repeatOpen"
    >
      <div class="logo">高盈金融</div>
      <a-menu theme="dark" mode="inline" :openKeys.sync="openKeys" :selectedKeys="selectedKeys">
        <a-sub-menu v-for="(item, index) in menuList" :key="index">
          <span slot="title">
            <a-icon :type="iconList[index]" />
            <span>{{ index }}</span>
          </span>
          <a-menu-item v-for="_item in item" :key="_item.path">
            <router-link :to="_item.path">{{ _item.title }}</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout style="overflow: hidden;">
      <a-layout-header style="background: #fff; padding: 0;" v-if="!$route.meta.repeatOpen">
        <div class="header">
          <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)" />
          <a-dropdown>
            <div class="user-wrapper ant-dropdown-link">
              <a-avatar style="margin-right: 8px; backgroundcolor: #001529;" icon="user" />
              <span>{{ userName }}</span>
            </div>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="showModal = true">
                  <a-icon type="setting" />
                  <span>修改密码</span>
                </a>
              </a-menu-item>
              <a-menu-divider></a-menu-divider>
              <a-menu-item>
                <a href="javascript:;" @click="logout">
                  <a-icon type="logout" />
                  <span>退出登录</span>
                </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="layout-content" :style="repeatStyle">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>

    <!-- 修改密码弹层 -->
    <change-password :show-modal.sync="showModal"></change-password>
  </a-layout>
</template>

<script>
import { Layout, Avatar, Menu, Icon, Dropdown } from 'ant-design-vue'
import { mapState, mapMutations, mapActions } from 'vuex'
import changePassword from '../views/user/changePsd'

export default {
  components: {
    changePassword,
    [Layout.name]: Layout,
    [Layout.Header.name]: Layout.Header,
    [Layout.Content.name]: Layout.Content,
    [Layout.Footer.name]: Layout.Footer,
    [Layout.Sider.name]: Layout.Sider,
    [Avatar.name]: Avatar,
    [Menu.name]: Menu,
    [Menu.Divider.name]: Menu.Divider,
    [Menu.Item.name]: Menu.Item,
    [Menu.SubMenu.name]: Menu.SubMenu,
    [Icon.name]: Icon,
    [Dropdown.name]: Dropdown
  },
  data() {
    return {
      iconList: {
        用户管理: 'user',
        账户管理: 'solution',
        资金管理: 'wallet',
        内容管理: 'file',
        系统管理: 'setting'
      },
      //menuList: [
      // {
      //     key: 'adminManage',
      //     menuTitle: '权限管理',
      //     children: [
      //         {
      //             url: '/adminManage/list',
      //             childTitle: '账号管理'
      //         }
      //     ]
      // },
      // {
      //     key: 'userManage',
      //     menuTitle: '用户管理',
      //     children: [
      //         {
      //             url: '/userManage/userList',
      //             childTitle: '个人用户管理列表'
      //         },
      //         {
      //             url: '/userManage/accountAuditList',
      //             childTitle: '开户待审核列表'
      //         },
      //         {
      //             url: '/userManage/registerList',
      //             childTitle: '注册列表'
      //         }
      //     ]
      // },
      // {
      //     key: 'accountManage',
      //     menuTitle: '账户管理',
      //     children: [
      //         {
      //             url: '/accountManage/futuresAccountList',
      //             childTitle: '期货账号管理'
      //         },
      //         {
      //             url: '/accountManage/statementList',
      //             childTitle: '客户结算单列表'
      //         }
      //     ]
      // }
      //],
      openKeys: [],
      collapsed: false,
      showModal: false
    }
  },
  computed: {
    ...mapState(['userName', 'selectedKeys', 'menuList']),
    repeatStyle() {
      const objStyle = {
        backgroundColor: '#fff'
      }
      return this.$route.meta.repeatOpen ? objStyle : {}
    }
  },
  watch: {
    $route(newVal) {
      if (newVal.meta.isMenu) {
        this.SET_SELECT_KEYS([newVal.path])
      }
    },
    menuList(newVal) {
      this.setOpenKeys(newVal)
    }
  },
  created() {
    // let regexp = /^(\/)(.+)(\/)/
    // const matchResult = this.selectedKeys[0].match(regexp)
    // this.openKeys.push(matchResult[0].replace(/\//g, ''))
    // 后退监听
    // window.addEventListener('popstate', () => {
    //     if (this.$route.path != this.selectedKeys[0]) {
    //         this.SET_SELECT_KEYS([this.$route.path])
    //     }
    // })
    this.SET_SELECT_KEYS([this.$route.path])
    this.setOpenKeys(this.menuList)
  },
  methods: {
    ...mapActions(['Logout']),
    ...mapMutations(['SET_SELECT_KEYS']),
    setOpenKeys(list) {
      if (Object.keys(list).length) {
        for (let i in list) {
          this.openKeys.push(i)
        }
      }
    },
    logout() {
      const { Logout } = this
      const that = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          Logout()
            .then(() => {
              that.$router.push('/login')
            })
            .catch(err => {})
        },
        onCancel() {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-layout {
  height: 100vh;
  .header {
    height: 64px;
    padding: 0 12px 0 0;
    background: #fff;
    -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    position: relative;
  }
  .user-wrapper {
    float: right;
    margin-right: 12px;
    height: 100%;
    cursor: pointer;
  }
  .layout-content {
    position: relative;
    margin: 0;
    padding: 16px;
    background-color: #f0f2f5;
    min-height: 280px;
    overflow-y: auto;
  }
}
/deep/ .ant-dropdown-menu-item {
  width: 160px;
  i {
    margin-right: 8px;
  }
}

.layout-custom-trigger {
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
      color: #1890ff;
    }
  }
  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
    max-width: 200px;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 20px;
    color: #fff;
  }
}
</style>
