
import { addResizeListener, removeResizeListener } from './utils/resize-event'
import scrollbarWidth from './utils/scrollbar-width'
import './style.scss'
// import { toObject } from 'element-ui/src/utils/util'
import Bar from './bar'

function extend (to, _from) {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

function toObject (arr) {
  var res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

export default {
  name: 'LayoutScrollbar',

  components: { Bar },

  props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div'
    }
  },

  data () {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0,
      clientHeight: 0
    }
  },

  computed: {
    wrap () {
      return this.$refs.wrap
    }
  },

  render (h) {
    const gutter = scrollbarWidth()
    let style = this.wrapStyle

    if (gutter) {
      const gutterWith = `-${gutter}px`
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith}; height: ${this.clientHeight + gutter}px`

      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle)
        style.marginRight = style.marginBottom = gutterWith
        style.height = `${this.clientHeight + gutter}px`
      } else if (typeof this.wrapStyle === 'string') {
        style += gutterStyle
      } else {
        style = gutterStyle
      }
    }
    const view = h(this.tag, {
      class: ['zf-scrollbar__view', this.viewClass],
      style: this.viewStyle,
      ref: 'resize'
    }, this.$slots.default)
    const wrap = (
      <div
        ref="wrap"
        style={ style }
        onScroll={ this.handleScroll }
        class={ [this.wrapClass, 'zf-scrollbar__wrap', gutter ? '' : 'zf-scrollbar__wrap--hidden-default'] }>
        { [view] }
      </div>
    )
    let nodes

    if (!this.native) {
      nodes = ([
        wrap,
        <Bar
          move={ this.moveX }
          size={ this.sizeWidth }></Bar>,
        <Bar
          vertical
          move={ this.moveY }
          size={ this.sizeHeight }></Bar>
      ])
    } else {
      nodes = ([
        <div
          ref="wrap"
          class={ [this.wrapClass, 'zf-scrollbar__wrap'] }
          style={ style }>
          { [view] }
        </div>
      ])
    }
    return h('div', { class: 'zf-scrollbar' }, nodes)
  },

  methods: {
    handleScroll () {
      const wrap = this.wrap

      this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight)
      this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth)
    },

    update () {
      const clientHeight = this.$el ? this.$el.clientHeight : 0
      if (this.clientHeight !== clientHeight) {
        this.clientHeight = clientHeight
        return this.$nextTick(this.update)
      }

      // let heightPercentage, widthPercentage
      const wrap = this.wrap
      if (!wrap) return

      const heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight)
      const widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth)

      this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : ''
      this.sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : ''
    }
  },

  mounted () {
    if (this.native) return
    this.clientHeight = this.$el ? this.$el.clientHeight : 0
    this.$nextTick(this.update)
    !this.noresize && addResizeListener(this.$el, this.update)
    !this.noresize && addResizeListener(this.$refs.resize, this.update)
  },

  beforeDestroy () {
    if (this.native) return
    !this.noresize && removeResizeListener(this.$el, this.update)
    !this.noresize && removeResizeListener(this.$refs.resize, this.update)
  }
}
