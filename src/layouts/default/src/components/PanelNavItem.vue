<template>
  <el-submenu
    v-if="data[childrenKey] && data[childrenKey].length"
    :index="data[idKey] || data[hrefKey] || `${index}`"
    :popper-append-to-body="false">
    <template slot="title">
      <ym-icon v-if="data[iconKey]" :icon="data[iconKey]"></ym-icon>
      <span>{{ data[labelKey] }}</span>
      <span ref="ripples" class="panel-nav-item__touch-ripples"></span>
    </template>
    <PanelNavItem
      v-for="item in data[childrenKey]"
      :key="item[idKey]"
      :data="item"
      :id-key="idKey"
      :icon-key="iconKey"
      :label-key="labelKey"
      :href-key="hrefKey"
      :children-key="childrenKey">
    </PanelNavItem>
  </el-submenu>
  <el-menu-item
    v-else
    :index="data[idKey] || data[hrefKey] || `${index}`"
    :route="data[hrefKey]">
    <ym-icon v-if="data[iconKey]" :icon="data[iconKey]"></ym-icon>
    <span>{{ data[labelKey] }}</span>
    <span ref="ripples" class="panel-nav-item__touch-ripples"></span>
  </el-menu-item>
</template>

<script>
export default {
  name: 'PanelNavItem',
  props: {
    data: {
      type: Object,
      redirect: true
    },
    index: {
      type: Number
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
  mounted () {
    this.handleRipples = this.handleRipples.bind(this)
    this.$_handleRipplesEl = this.$el.querySelector('.el-submenu > .el-submenu__title') || this.$el
    this.$_handleRipplesEl.addEventListener('click', this.handleRipples, true)
  },
  beforeDestroy () {
    if (this.$_handleRipplesEl) {
      this.$_handleRipplesEl.removeEventListener('click', this.handleRipples, true)
    }
  },
  methods: {
    // 水涟特效
    handleRipples (event) {
      const ripples = this.$refs.ripples
      if (!ripples || !this.$_handleRipplesEl) return

      const x = event.layerX || event.offsetX
      const y = event.layerY || event.offsetY

      if (typeof x === 'undefined') return
      if (typeof y === 'undefined') return

      const ripple = document.createElement('span')
      ripple.style.left = x + 'px'
      ripple.style.top = y + 'px'

      // 自动取背景颜色
      if (window.getComputedStyle) {
        const style = window.getComputedStyle(this.$_handleRipplesEl)
        const reg = /^\s*rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*0.08\)\s*$/
        ripple.timerFn = function () {
          if (reg.test(style.backgroundColor)) {
            const backgroundColor = style.backgroundColor.replace(reg, 'rgb($1, $2, $3)')
            ripple.style.background = backgroundColor
          }
        }
        ripple.timerFn()
        ripple.timer = setInterval(ripple.timerFn, 200)
      }

      ripples.appendChild(ripple)
      setTimeout(() => {
        clearInterval(ripple.timer)
        ripple.timerFn = null
        ripple.remove()
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>

.panel-nav-item__touch-ripples {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
  &::v-deep > span {
    display: block;
    position: absolute;
    transform: translate(-50%, -50%);
    pointer-events: none;
    border-radius: 50%;
    animation: ripple-animate 1s linear infinite;
    background-color: $--ym-text-color-secondary;
    translate: background 0.2s;
  }
}

@keyframes ripple-animate {
  0% {
    width: 0px;
    height: 0px;
    opacity: .5;
  }

  100% {
    width: 500px;
    height: 500px;
    opacity: 0;
  }
}
</style>
