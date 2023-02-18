<template>
  <div class="layout" :class="{ 'layout--aside-opened': asideOpened, 'layout--aside-collapse': asideCollapse }">

    <div class="layout-header">
      <slot name="header"></slot>
    </div>

    <vue-scrollbar class="layout-aside" :wrap-style="[{ 'overflow-x': 'hidden' }]">
      <slot name="aside"></slot>
    </vue-scrollbar>

    <div class="layout-main">
      <slot></slot>
    </div>

    <div class="right-drawer" :class="{ 'is-opened': rightDrawerOpened }">
      <div class="right-drawer__button" @click="rightDrawerOpened = !rightDrawerOpened">
        <ym-icon v-if="rightDrawerOpened" icon="guanbi"></ym-icon>
        <ym-icon v-else icon="zhanshou"></ym-icon>
      </div>
      <div class="right-drawer__inner" :wrap-style="[{ 'overflow-x': 'hidden' }]">
        <slot name="right-drawer"></slot>
      </div>
    </div>

    <div v-if="maskOpened" class="layout-mask" @click="handleCloseMask()"></div>
  </div>
</template>

<script>
import { Scrollbar } from 'element-ui'

export default {
  components: {
    'vue-scrollbar': Scrollbar
  },
  props: {
    asideOpened: {
      type: Boolean,
      default: false
    },
    asideCollapse: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      rightDrawerOpened: false
    }
  },
  computed: {
    maskOpened () {
      return this.asideOpened || this.rightDrawerOpened
    }
  },
  methods: {
    handleCloseMask () {
      this.rightDrawerOpened = false
      this.$emit('update:aside-opened', false)
    }
  }
}
</script>

<style lang="scss" scoped>
$headerHeight: 60px;
$asideWidth: 240px;
$mainPadding: 32px;

.layout {
  min-height: 100vh;
}

.layout-header {
  position: absolute;
  left: $asideWidth;
  right: 0;
  top: 0;
  height: $headerHeight;
  z-index: 10;
  overflow: hidden;
  transition: left 0.3s;
}

.layout-aside {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: $asideWidth;
  min-height: calc(100% - #{$headerHeight});
  z-index: 10;
  background-color: #fff;
  border-right: 1px solid rgba(145, 158, 171, 0.24);
  transition: left 0.3s, width 0.3s;
}

.layout-main {
  position: relative;
  box-sizing: border-box;
  min-height: 100vh;
  padding: ($headerHeight + $mainPadding) $mainPadding $mainPadding ($asideWidth + $mainPadding);
  transition: padding 0.3s;
}

.layout-header,
.layout-aside {
  position: fixed;
}

// 主题弹窗
.right-drawer {
  position: fixed;
  top: 12px;
  bottom: 12px;
  right: -260px;
  z-index: 30;
  margin: auto;
  width: 260px;

  background-color: rgb(255, 255, 255);
  color: rgb(33, 43, 54);
  border-radius: 8px;
  background-image: none;
  box-shadow: rgb(145 158 171 / 24%) 0px 0px 4px 0px, rgb(145 158 171 / 24%) 0px 24px 48px 0px;
  transition: right 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  &__button {
    position: absolute;
    top: 50%;
    left: -48px;
    margin-top: -24px;
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    cursor: pointer;
    color: rgb(33, 43, 54);
    background-color: rgb(255, 255, 255);
    border-radius: 24px 0px 16px 24px;
    box-shadow: rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 12px 24px 0px;
    transition: transform 0.3s;
  }
  &__inner {
    display: block;
    width: 100%;
    height: 100%;
  }
  &.is-opened {
    right: 12px;
  }
}

.layout-mask {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: #000000;
}

.layout--aside-collapse {
  .layout-header {
    left: 64px;
  }
  .layout-main {
    padding-left: 64px + $mainPadding;
  }
  .layout-aside {
    width: 64px;
  }
}

@media screen and (max-width: 767px) {
  .layout-header {
    left: 0 !important;
  }
  .layout-main {
    padding-left: $mainPadding !important;
  }
  .layout-aside {
    z-index: 50;
    left: (0 - $asideWidth) !important;
    width: $asideWidth !important;
  }

  .layout--aside-opened {
    .layout-header {
      left: 0 !important;
    }
    .layout-main {
      padding-left: $mainPadding !important;
    }
    .layout-aside {
      left: 0 !important;
    }
    .layout-mask {
      z-index: 40 !important;
    }
  }
}
@media screen and (min-width: 768px) {
  .layout--aside-opened {
    .right-drawer:not(.is-opened) + .layout-mask {
      display: none;
    }
  }
}
</style>
