<template>
  <div :class="{ 'aside--collapse': collapse }">
    <el-popover
      popper-class="aside-popover p-61243749"
      placement="right"
      trigger="hover"
      :offset="20"
      :visible-arrow="false"
      :disabled="!collapse"
      :popper-options="{ boundariesElement: 'body' }">
      <div slot="reference" class="aside-head">
        <div class="aside-head__icon" @click="handleClickLogo">
          <img :src="logo" :alt="title">
        </div>
        <div class="aside-head__user" @click="handleClickMy">
          <el-avatar class="aside-head__user__avatar" :src="userAvatar">
            <i class="el-icon-user-solid" aria-hidden="true"></i>
          </el-avatar>
          <div class="aside-head__user__info">
            <div class="aside-head__user__name">{{ userName }}</div>
            <div class="aside-head__user__role">{{ userRole }}</div>
          </div>
        </div>
      </div>
      <div class="aside-head">
        <div class="aside-head__user" @click="handleClickMy">
          <el-avatar class="aside-head__user__avatar" :src="userAvatar">
            <i class="el-icon-user-solid" aria-hidden="true"></i>
          </el-avatar>
          <div class="aside-head__user__info">
            <div class="aside-head__user__name">{{ userName }}</div>
            <div class="aside-head__user__role">{{ userRole }}</div>
          </div>
        </div>
      </div>
    </el-popover>
    <PanelNav
      class="panel-nav"
      :collapse="collapse"
      :menu="menu"
      :id-key="idKey"
      :icon-key="iconKey"
      :label-key="labelKey"
      :href-key="hrefKey"
      :children-key="childrenKey">
    </PanelNav>
  </div>
</template>

<script>
import PanelNav from './PanelNav'
export default {
  components: { PanelNav },
  props: {
    title: {
      type: String,
      default: '网站标题'
    },
    logo: {
      type: String
    },
    logoTo: {
      type: [Object, String]
    },
    userAvatar: {
      type: String
    },
    userName: {
      type: String,
      default: '用户'
    },
    userRole: {
      type: String,
      default: ''
    },
    userTo: {
      type: [Object, String]
    },
    collapse: {
      type: Boolean,
      default: false
    },
    menu: {
      type: Array,
      default: () => []
    },
    idKey: {
      type: String,
      default: 'id'
    },
    iconKey: {
      type: String,
      default: 'icon'
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    hrefKey: {
      type: String,
      default: 'href'
    },
    childrenKey: {
      type: String,
      default: 'children'
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
    },
    handleClickLogo () {
      this.$emit('click-logo')
    },
    handleClickMy () {
      this.$emit('click-my')
    }
  }
}
</script>

<style lang="scss">
.aside-popover.p-61243749 {
  padding: 0;
  min-width: 200px;
  border-radius: 12px;
  .aside-head__user {
    margin: 0 !important;
    background: none !important;
    &:hover {
      transform: scale(1) !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.aside-head {
  .aside-head__icon {
    width: 100%;
    padding: 24px 20px;
    box-sizing: border-box;
    cursor: pointer;
    img {
      display: block;
      max-width: 100%;
      max-height: 35px;
    }
  }
  .aside-head__user {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-radius: 12px;
    background-color: rgba(145, 158, 171, 0.12);
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 16px;
    cursor: pointer;
    transition: all 0.3s;
    user-select: none;
    white-space: nowrap;
    &:hover {
      transform: scale(1.03);
    }
    &:active {
      transform: scale(1);
    }
    .aside-head__user__avatar {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      line-height: 1;
      border-radius: 50%;
      overflow: hidden;
      user-select: none;
    }
    .aside-head__user__info {
      margin-left: 16px;
    }
    .aside-head__user__name {
      margin: 0px;
      font-weight: 600;
      font-size: 14px;
      line-height: 22px;
      color: #212b36;
    }
    .aside-head__user__role {
      margin: 0px;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      color: #637381;
    }
  }
}

.aside--collapse {
  .aside-head {
    .aside-head__icon {
      display: none;
    }
    .aside-head__user {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border-radius: 0;
      margin: 0;
      height: 68px;
      &:hover {
        transform: scale(1);
      }
      .aside-head__user__info {
        display: none;
      }
    }
  }
}

</style>
