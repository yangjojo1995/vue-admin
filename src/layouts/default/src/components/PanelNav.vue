<template>
  <el-menu class="el-menu" :default-active="active" :default-openeds="openeds" :collapse="collapse" router>
    <PanelNavItem
      v-for="(firstItem, index) in menu"
      :key="firstItem[idKey] || firstItem[hrefKey] || `${index}`"
      :index="index"
      :data="firstItem"
      :id-key="idKey"
      :icon-key="iconKey"
      :label-key="labelKey"
      :href-key="hrefKey"
      :children-key="childrenKey">
    </PanelNavItem>
  </el-menu>
</template>

<script>
import debounce from '@/utils/debounce'
import PanelNavItem from './PanelNavItem'
export default {
  components: { PanelNavItem },
  props: {
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
  data () {
    return {
      active: '',
      openeds: []
    }
  },
  watch: {
    // 路由改变 更新导航
    menu: 'updateActive',
    $route: 'updateActive'
  },
  async created () {
    this.updateActive = debounce(this.updateActive, 100)
  },
  mounted () {
    // 默认展开第一层
    this.menu.map(item => {
      this.openeds.push(item.id)
    })
    this.updateActive()
  },
  methods: {
    // 更新初始显示菜单
    updateActive () {
      const active = this.getActive(this.menu)
      if (active) this.active = active
    },
    // 获取菜单叶导航
    getLeafMenu (menu) {
      const childrenKey = this.childrenKey
      const result = []
      for (const item of menu) {
        if (item[childrenKey] && item[childrenKey].length) {
          const leafs = this.getLeafMenu(item[childrenKey])
          result.push(...leafs)
        } else {
          result.push(item)
        }
      }
      return result
    },
    // 获取初始显示菜单
    getActive (menu) {
      const leafs = this.getLeafMenu(menu)
      const idKey = this.idKey
      const hrefKey = this.hrefKey
      leafs.length && leafs.sort((a, b) => {
        const aArr = a.href.replace(/\/$/, '').split('/')
        const bArr = b.href.replace(/\/$/, '').split('/')
        return bArr.length - aArr.length
      })
      const leaf = leafs.find(item => this.$route.path === item[hrefKey] || this.whetherPathParent(this.$route.path, item[hrefKey]))
      return leaf ? leaf[idKey] || leaf[hrefKey] : undefined
    },
    // 判断路径是否在该路径下
    whetherPathParent (path, parent) {
      if (!path) return false
      if (!parent) return false
      const parentArray = parent.replace(/\/$/, '').split('/')
      const pathArray = path.replace(/\/$/, '').split('/')
      return !parentArray.some((parentItem, index) => {
        return parentItem !== pathArray[index]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu {
  background: none !important;
  border-right: none;
  user-select: none;
  transition: none;
  width: 100% !important;
  &::v-deep {
    .el-menu {
      // background: none !important;
    }
    // 一级
    > .el-menu-item,
    > .el-menu-item:focus,
    > .el-submenu > .el-submenu__title {
      position: relative;
      overflow: hidden;
      color: #637381;
      font-size: 14px;
      background: none;
      height: 48px;
      line-height: 48px;
      > i:first-child {
        margin-right: 10px;
        display: inline-block;
        width: 18px;
        height: 18px;
        vertical-align: middle;
        line-height: 18px;
      }
      &:hover {
        background-color: rgba($--ym-text-color-secondary, 0.08);
      }
    }

    // 一级激活
    > .el-menu-item.is-active,
    > .el-menu-item.is-active:focus,
    > .el-submenu.is-active > .el-submenu__title {
      position: relative;
      color: $--ym-color-primary;
      font-weight: 600;
      background-color: rgba($--ym-color-primary, 0.08);
      i {
        color: $--ym-color-primary;
      }
      &::after {
        content: "";
        top: 0px;
        right: 0px;
        width: 3px;
        bottom: 0px;
        position: absolute;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        background-color: $--ym-color-primary;
      }
    }

    > .el-submenu > .el-menu--inline {
      .el-menu-item {
        > i:first-child {
          display: none;
        }
      }

      // 二级
      > .el-menu-item,
      > .el-menu-item:focus,
      > .el-submenu > .el-submenu__title {
        padding-left: 50px !important;
        background: none;
        &::before {
          content: '';
          position: absolute;
          left: 26px;
          top: 24px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #919eab;
          transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        }
        &:hover {
          background-color: rgba(145, 158, 171, 0.08);
        }
        i:first-child {
          display: none;
        }
      }

      // 二级激活
      > .el-menu-item.is-active,
      > .el-menu-item.is-active:focus,
      > .el-submenu.is-active > .el-submenu__title {
        position: relative;
        overflow: hidden;
        color: #212b36;
        font-weight: 600;
        &::before {
          transform: scale(2);
          background: $--ym-color-primary;
        }
      }

      > .el-submenu > .el-menu--inline {
        // 三级
        .el-menu-item {
          > i:first-child {
            display: none;
          }
        }

        // 三级
        > .el-menu-item,
        > .el-menu-item:focus,
        > .el-submenu > .el-submenu__title {
          position: relative;
          overflow: hidden;
          color: #637381;
          font-size: 14px;
          background: none;
          height: 48px;
          line-height: 48px;
          &:hover {
            background-color: rgba(145, 158, 171, 0.08);
          }
          i:first-child {
            display: none;
          }
        }

        // 三级激活
        > .el-menu-item.is-active,
        > .el-menu-item.is-active:focus,
        > .el-submenu.is-active > .el-submenu__title {
          position: relative;
          color: $--ym-color-primary;
          font-weight: 600;
        }
      }
    }

    .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
      transform: rotateZ(-90deg)
    }
    .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
      transform: rotateZ(0)
    }

    .el-menu-item,
    .el-menu-item:focus,
    .el-submenu > .el-submenu__title {
      > i:first-child {
        font-weight: normal !important;
      }
    }

    // 收起来 图标居中
    &.el-menu--collapse {
      .el-menu-item,
      .el-menu-item:focus,
      .el-submenu > .el-submenu__title {
        > i:first-child {
          width: 100%;
          text-align: center;
          margin: 0 !important;
        }
      }
    }
  }
}

</style>

<style lang="scss">
// 收起来 移除图标
.el-menu--vertical {
  .el-menu-item,
  .el-menu-item:focus,
  .el-submenu > .el-submenu__title {
    > i:first-child {
      display: none;
    }
  }
}
</style>
