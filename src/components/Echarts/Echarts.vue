<template>
  <div class="ym-echarts"></div>
</template>

<script>
import { mapState } from 'vuex'
import ResizeObserver from 'resize-observer-polyfill'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GridComponent, TooltipComponent, ToolboxComponent, TitleComponent, LegendComponent } from 'echarts/components'
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts'
import { debounce } from './utils'

echarts.use([CanvasRenderer])
echarts.use([GridComponent, TooltipComponent, ToolboxComponent, TitleComponent, LegendComponent])
echarts.use([BarChart, LineChart, PieChart, RadarChart])

export { echarts }
export default {
  props: {
    // 初始化配置
    initOption: {
      type: Object,
      default: () => ({})
    },
    // 选项
    option: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('app', ['themeColor'])
  },
  watch: {
    option: {
      deep: true,
      handler () {
        return this.setOption()
      }
    },
    themeColor: {
      handler () {
        return this.setOption()
      }
    }
  },
  created () {
    this.$echarts = echarts
    this.setOption = debounce(this.setOption.bind(this))
  },
  mounted () {
    this.init()
    this.robserver = new ResizeObserver(this.handleResizeObserver.bind(this))
    this.robserver.observe(this.$el)
  },
  beforeDestroy () {
    if (this.robserver) {
      this.robserver.disconnect()
      this.robserver = null
    }
    this.dispose()
  },
  methods: {
    // 初始化
    async init () {
      this.dispose()
      this.$emit('before-init', echarts)
      this.$chart = echarts.init(this.$el, null, {
        devicePixelRatio: window.devicePixelRatio, // 设备像素比
        renderer: 'svg', // 渲染器
        useDirtyRect: false, // 脏矩形渲染
        width: 'auto',
        height: 'auto',
        locale: 'ZH',
        ...this.initOption
      })
      for (const eventName of Object.keys(this.$listeners)) {
        this.$chart.on(eventName, this.$listeners[eventName])
      }
      this.setOption()
    },

    // 销毁
    dispose () {
      if (this.$chart) {
        this.$chart.dispose()
        this.$chart = null
      }
    },

    // 设置
    setOption (option) {
      if (!this.$chart) return
      return this.$chart.setOption({
        color: [this.themeColor || '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        ...this.option,
        ...(option || {})
      })
    },

    // 重置容器大小
    resize () {
      if (this.$chart) {
        this.$chart.resize()
      }
    },

    // 监听改变容器大小
    handleResizeObserver (entries) {
      this.resize()
    }
  }
}
</script>

<style lang="scss" scoped>
.ym-echarts {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
