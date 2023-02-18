<template>
  <span
    class="fit-image"
    :class="{
      ['not-supports-fit']: !isSupportsFit,
      [`fit-image--${fit}`]: fit,
    }"
    :style="{
      'background-color': bg
    }">
    <img
      v-bind="$attrs"
      v-if="!!src && !isError"
      class="fit-image-inner"
      :style="{
        'max-width': innerMaxSize,
        'max-height': innerMaxSize,
      }"
      :src="src"
      :alt="alt"
      @load="handleLoad"
      @error="handleError" />
    <span v-else-if="src" class="fit-image-error">
      <slot name="error">加载失败</slot>
    </span>
    <span v-else class="fit-image-error">
      <slot name="empty">暂无图片</slot>
    </span>
  </span>
</template>

<script>
// 图片容器 支持fit
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    fit: {
      type: String,
      default: 'contain'
    },
    bg: {
      type: String,
      default: 'rgba(145, 158, 171, 0.12)'
    }
  },
  data () {
    return {
      loading: !!this.src,
      isSupportsFit: !!(CSS && CSS.supports('object-fit', 'cover')),
      isError: false,
      clientWidth: undefined,
      clientHeight: undefined
    }
  },
  computed: {
    innerMaxSize () {
      if (this.fit !== 'cover') return
      if (!this.clientWidth) return
      if (!this.clientHeight) return
      return this.clientWidth > this.clientHeight ? `${this.clientWidth}px` : `${this.clientHeight}px`
    }
  },
  watch: {
    fit: 'handleWatchFit',
    src () {
      this.loading = !!this.src
      this.isError = false
    }
  },
  created () {
    this.updateClientSize = this.updateClientSize.bind(this)
  },
  mounted () {
    if (this.isSupportsFit) return
    this.handleWatchFit()
  },
  beforeDestroy () {
    if (this.isSupportsFit) return
    window.removeEventListener('resize', this.updateClientSize)
  },
  methods: {
    updateClientSize () {
      if (!this.$el) return
      if (this.isSupportsFit) {
        this.clientHeight = undefined
        this.clientWidth = undefined
      } else {
        this.clientHeight = this.$el.clientHeight
        this.clientWidth = this.$el.clientWidth
      }
    },
    handleWatchFit () {
      if (this.isSupportsFit) return
      if (this.fit === 'cover') {
        this.updateClientSize()
        window.addEventListener('resize', this.updateClientSize)
      } else {
        window.removeEventListener('resize', this.updateClientSize)
      }
    },
    handleLoad () {
      this.isError = false
      this.loading = false
    },
    handleError () {
      this.isError = true
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.fit-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
  width: 100%;
  height: 100%;
  font-size: 14px;

  .fit-image-inner {
    display: block;
    width: 100%;
    height: 100%;
  }

  &.fit-image--contain {
    .fit-image-inner {
      object-fit: contain;
    }
  }
  &.fit-image--cover {
    .fit-image-inner {
      object-fit: cover;
    }
  }
  &.fit-image--fill {
    .fit-image-inner {
      object-fit: fill;
    }
  }
  &.fit-image--none {
    .fit-image-inner {
      object-fit: none;
    }
  }

  .fit-image-error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #c0c4cc;
  }

  &.not-supports-fit {
    .fit-image-inner {
      width: auto;
      height: auto;
    }
    &.fit-image--contain {
      .fit-image-inner {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        max-width: 100%;
        max-height: 100%;
        transform: translate(-50%, -50%)
      }
    }
    &.fit-image--cover {
      .fit-image-inner {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        min-width: 100%;
        min-height: 100%;
        transform: translate(-50%, -50%);
        object-fit: cover;
      }
    }
    &.fit-image--fill {
      .fit-image-inner {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    &.fit-image--none {
      .fit-image-inner {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%)
      }
    }
  }

}
</style>
