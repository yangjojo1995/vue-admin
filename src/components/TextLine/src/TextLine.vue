<template>
  <div class="zk-text-line-box">
    <div
      :class="['zk-text-line', {
        'zk-text-line--ellipsis': clamp === 1,
        'zk-text-line--clamp': clamp > 1,
      }]"
      :style="{
        width: styleWidth,
        'max-height': styleHeight,
        '-webkit-line-clamp': clamp
      }"
      :title="text">
      <slot>{{ text }}</slot>
    </div>
  </div>
</template>

<script>
// 文本容器，支持省略号结尾
export default {
  props: {
    width: {
      type: [Number, String]
    },
    clamp: {
      type: Number,
      default: 1
    },
    text: {
      type: String
    }
  },
  data () {
    return {
      styleHeight: ''
    }
  },
  computed: {
    styleWidth () {
      if (typeof this.width === 'number' || /^\d+$/.test(String(this.width))) {
        return `${this.width}px`
      }
      return this.width || ''
    }
  },
  mounted () {
    this.updateStyleHeight()
  },
  updated () {
    this.updateStyleHeight()
  },
  methods: {
    updateStyleHeight () {
      if (this.__isupdate) return
      this.__isupdate = true
      this.$nextTick(function () {
        const style = this.$el ? (this.$el.currentStyle || document.defaultView.getComputedStyle(this.$el, '')) : {}
        let styleHeight = ''
        if (style && style.lineHeight && /^(\d+)px$/.test(style.lineHeight)) {
          const height = Number(style.lineHeight.replace(/^(\d+)px$/, '$1'))
          styleHeight = `${height * this.clamp}px`
        }
        this.styleHeight = styleHeight
        this.__isupdate = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.zk-text-line {
  display: block;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}
.zk-text-line--ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
}
.zk-text-line--clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  // word-break: break-all;
}

.zk-text-line-box {
  max-width: 100%;
}
</style>
