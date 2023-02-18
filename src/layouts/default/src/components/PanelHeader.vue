<template>
  <div class="panel-header">
    <div class="panel-header__container">
      <div class="panel-header__nav-switch" :class="{ 'is-rotate-180': !asideOpened }" @click="handleAsideToggle">
        <ym-icon icon="zhanshou"></ym-icon>
      </div>

      <!-- 面包屑 -->
      <el-breadcrumb v-if="false" class="panel-header__breadcrumb" separator="/">
        <el-breadcrumb-item
          v-for="(item, index) in breadcrumb"
          :key="index"
          :to="index < (breadcrumb.length - 1) && item[breadcrumbToKey]">
          <span>{{ item[breadcrumbNameKey] }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div class="panel-header__right">
        <slot name="right"></slot>
        <!-- <div class="panel-header__item">
          <div class="panel-header__notice">
            <i class="el-icon-search" aria-hidden="true"></i>
          </div>
        </div> -->
        <div class="panel-header__item" @click="messageTo && $router.push(messageTo)">
          <div class="panel-header__notice">
            <el-badge style="display: block;" :value="messageUnreadCount" :max="100" :hidden="!messageUnreadCount">
              <i class="el-icon-message-solid" aria-hidden="true"></i>
            </el-badge>
          </div>
        </div>
        <div class="panel-header__item">
          <el-popover placement="bottom" popper-class="user-popover p-61243748" trigger="click">
            <span slot="reference" class="user-wrapper">
              <el-avatar class="user-wrapper-avatar" :src="userAvatar">
                <i class="el-icon-user-solid" aria-hidden="true"></i>
              </el-avatar>
            </span>
            <slot name="user-popover"></slot>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '网站标题'
    },
    breadcrumb: {
      type: Array,
      default: () => []
    },
    breadcrumbNameKey: {
      type: String,
      default: 'name'
    },
    breadcrumbToKey: {
      type: String,
      default: 'to'
    },
    userName: {
      type: String,
      default: '管理员'
    },
    userAvatar: {
      type: String
    },
    asideOpened: {
      type: Boolean,
      default: true
    },
    messageTo: {
      type: String
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  filters: {
    firstChar (value) {
      return String(value || '').substring(0, 1).toUpperCase()
    }
  },
  methods: {
    handleAsideToggle () {
      this.$emit('aside-toggle')
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-header {
  position: relative;
  height: 60px;
  width: 100%;

  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  background-image: none;
  box-sizing: border-box;
  box-shadow: none;
  backdrop-filter: blur(6px);
  background-color: rgba(255, 255, 255, 0.72);
}

.panel-header__container {
  width: 100%;
  height: 100%;
  display: block;
}

.panel-header__nav-switch {
  display: inline-block;
  line-height: 60px;
  height: 60px;
  margin-left: 32px;
  font-size: 20px;
  cursor: pointer;
  color: $--ym-text-color-regular;
  user-select: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.3s;
  vertical-align: middle;
  &.is-rotate-180 {
    transform: rotate(180deg);
  }
}

.panel-header__breadcrumb {
  display: inline-block;
  line-height: 30px;
  height: 30px;
  white-space: normal;
  padding: 15px 32px;
  vertical-align: middle;
}

.panel-header__right {
  float: right;
  line-height: 60px;
  height: 60px;
  padding-right: 40px;
  .panel-header__item {
    margin-left: 40px;
  }
}

.panel-header__item {
  display: inline-block;
  vertical-align: middle;
  line-height: 60px;
  height: 60px;
  user-select: none;
  cursor: pointer;
  transition: color .2s;
  -webkit-tap-highlight-color: transparent;
  > i {
    font-size: 14px;
    margin-right: 8px;
    transition: color .2s;
  }
}

.user-wrapper {
  display: inline-block;
  line-height: 60px;
  height: 60px;
  span {
    display: inline-block;
    vertical-align: middle;
  }
  .el-avatar {
    vertical-align: middle;
    width: 32px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s;
    &:hover {
      transform: scale(1.1);
    }
    &:active {
      transform: scale(1);
    }
  }
  .el-icon-arrow-down {
    font-weight: bold;
  }
}

.panel-header__notice {
  display: inline-block;
  vertical-align: middle;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  cursor: pointer;
  color: $--ym-text-color-regular;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.03);
  }
  &:active {
    transform: scale(1);
  }
}
</style>

<style lang="scss">
.user-popover.p-61243748 {
  padding: 0;
  min-width: 100px;
}
</style>
