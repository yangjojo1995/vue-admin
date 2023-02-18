<template>
  <PanelLayout :aside-opened.sync="asideOpened" :aside-collapse="asideCollapse">
    <PanelHeader
      slot="header"
      title="后台"
      :breadcrumb="breadcrumb"
      breadcrumb-name-key="label"
      breadcrumb-to-key="to"
      message-to="/my/message"
      :message-unread-count="userMessageUnreadCount"
      :user-name="userInfo.userName || userInfo.loginName || userInfo.phone"
      :user-avatar="$assets(userInfo.avatar, 'account') || userAvatar"
      :aside-opened="asideCollapse || asideOpened"
      @aside-toggle="handleAsideToggle"
    >
      <ul slot="user-popover" class="user-popover-ul">
        <li class="user-popover-li" @click="handleToMy">
          <i class="el-icon-user" aria-hidden="true"></i>
          <span>基本信息</span>
        </li>
        <li class="user-popover-li" @click="handleToMyPassword">
          <i class="el-icon-edit" aria-hidden="true"></i>
          <span>修改密码</span>
        </li>
        <li class="user-popover-li" @click="handleLogout()">
          <i class="el-icon-switch-button" aria-hidden="true"></i>
          <span>退出登录</span>
        </li>
      </ul>
    </PanelHeader>

    <PanelAside
      slot="aside"
      :title="appTitle"
      :logo="appLogo || defaultAppLogo"
      :user-avatar="$assets(userInfo.avatar, 'account') || userAvatar"
      :user-name="userInfo.userName || userInfo.loginName || userInfo.phone"
      :user-role="userInfo.roleName"
      :collapse="asideCollapse"
      :menu="userMenu"
      id-key="id"
      icon-key="icon"
      label-key="label"
      href-key="href"
      children-key="children"
      @click-logo="handleToHome"
      @click-my="handleToMy"
    >
    </PanelAside>

    <PanelTheme slot="right-drawer"> </PanelTheme>

    <transition name="fade-in">
      <!-- keep-alive加在这儿 -->
      <!-- <keep-alive include="activity"> -->
      <router-view
        v-if="routerViewVisible"
        class="router-view"
        :class="{ [`is-${containerStretch}`]: containerStretch }"
        @click="toggleContainerStretch()"
      ></router-view>
      <!-- </keep-alive> -->
    </transition>
  </PanelLayout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { compile as pathToRegexpCompile } from 'path-to-regexp'
import PanelLayout from './components/PanelLayout'
import PanelHeader from './components/PanelHeader'
import PanelAside from './components/PanelAside'
import PanelTheme from './components/PanelTheme'

export default {
  components: {
    PanelLayout,
    PanelHeader,
    PanelAside,
    PanelTheme
  },
  data () {
    return {
      menu: [],
      breadcrumb: [],
      userAvatar: require('@/assets/images/global/user-avatar.png'),
      defaultAppLogo: require('@/assets/images/global/app-login.png'),

      asideOpened: false,
      asideCollapse: false,

      routerViewVisible: true
    }
  },
  computed: {
    ...mapState('app', {
      containerStretch: 'containerStretch',
      appTitle: 'title',
      appLogo: 'logo'
    }),
    ...mapState('user', {
      userInfo: 'userInfo',
      userRoles: 'roles',
      userMenu: 'menu',
      userMessageUnreadCount: 'messageUnreadCount'
    }),
    userUpdatePath () {
      if (!this.userInfo) return ''
      return '/app/account/user/update'
    }
  },
  watch: {
    $route (to, from) {
      this.updateBreadcrumb(to, from)
    }
  },
  created () {
    if (window.document.body.clientWidth < 768) {
      this.asideCollapse = false
    } else if (window.document.body.clientWidth < 992) {
      this.asideCollapse = true
    }
  },
  async mounted () {
    this.updateMessageUnreadCount()
    this.updateBreadcrumb()
  },
  methods: {
    ...mapActions('user', ['logout', 'updateMessageUnreadCount']),
    // 更新 Breadcrumb
    updateBreadcrumb () {
      const breadcrumb = [{ label: '首页', to: '/' }]
      for (const route of this.$route.matched) {
        const metaInfo =
          route.instances.default && route.instances.default.$metaInfo
        if (
          metaInfo &&
          metaInfo.title &&
          route.path !== '/' &&
          route.path !== '/index'
        ) {
          const to = pathToRegexpCompile(route.path)(this.$route.params)
          breadcrumb.push({ label: metaInfo.title, to: to })
        }
      }
      this.breadcrumb = breadcrumb
    },
    // 刷新视图
    refreshRouterView () {
      this.routerViewVisible = false
      this.$nextTick(() => {
        this.routerViewVisible = true
      })
    },
    // 处理切换 nav
    handleAsideToggle () {
      if (window.document.body.clientWidth < 768) {
        this.asideOpened = !this.asideOpened
        this.asideCollapse = false
      } else {
        this.asideOpened = false
        this.asideCollapse = !this.asideCollapse
      }
    },
    handleToHome () {
      this.$router.push('/')
    },
    handleToMy () {
      this.$router.push('/my')
    },
    handleToMyPassword () {
      this.$router.push('/my/password')
    },
    // 退出登录
    handleLogout (command) {
      return this.$router.push('/login').then(() => {
        this.logout(null)
      })
    }
  }
}
</script>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
}
</style>
<style lang="scss" scoped>
// 用户弹出框操作项
.user-popover-ul {
  margin: 0;
  list-style: none;
  padding: 12px 0;
  .user-popover-li {
    padding: 0 12px;
    height: 38px;
    line-height: 38px;
    user-select: none;
    cursor: pointer;
    box-sizing: border-box;
    font-size: 14px;
    color: #606266;
    transition: all 0.2s;
    white-space: normal;
    i {
      margin-right: 8px;
    }
    &:hover {
      background-color: #e8edff;
      color: #486efe;
    }
  }
}

.panel-layout__notice {
  display: inline-block;
  vertical-align: middle;
  // width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  cursor: pointer;
  color: $--ym-text-color-regular;
  margin-right: 20px;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.03);
  }
  &:active {
    transform: scale(1);
  }
}

.router-view {
  margin: auto;
  max-width: 942px;
  transition: width 0.3s, max-width 0.3s;
  @media (min-width: 1280px) {
    max-width: 1280px;
  }
  &.is-fluid {
    max-width: 100%;
  }
}

// 淡入
.fade-in {
  &-enter {
    opacity: 0;
  }
  &-enter-active,
  &-enter-to {
    transition: opacity 0.5s;
  }
  &-leave,
  &-leave-active,
  &-leave-to {
    display: none;
  }
}
</style>
