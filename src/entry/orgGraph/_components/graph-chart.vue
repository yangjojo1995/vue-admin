<template>
  <div class="echart-comp">
    <!--关系图-->
    <div v-if="!this.datas || this.datas === {}" class="nodata">暂无数据</div>
    <ym-echarts width="100%" height="100%" :option="options" @clickNode="clickNode" @finished="doneFinished"></ym-echarts>
  </div>
</template>

<script>
export default {
  name: 'graph-chart',
  props: {
    datas: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      options: {}
    }
  },
  computed: {},
  watch: {
    datas: {
      handler () {
        this.init()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    clickNode (data) {
      this.$emit('clickHandleNode', data)
    },
    doneFinished () {
      // this.$emit('finished')
    },
    init () {
      const animationFlag = !(this.datas.nodes.length > 20)
      this.options = {
        tooltip: { show: false },
        series: [
          {
            type: 'graph',
            layout: 'force',
            force: {
              edgeLength: [100, 200, 300, 500],
              repulsion: 600,
              layoutAnimation: animationFlag // 性能瓶颈
            },
            // zoom: 0.5,
            draggable: true,
            roam: true,
            label: {
              show: true,
              position: 'bottom',
              width: 100,
              overflow: 'break',
              fontSize: 10,
              lineHeight: 12
            },
            edgeSymbol: ['', 'arrow'],
            edgeSymbolSize: 12,
            cursor: 'pointer',
            edgeLabel: {
              show: true,
              fontSize: 10,
              position: 'middle'
            },
            emphasis: {
              scale: true,
              focus: 'none'
            },
            animation: animationFlag,
            data: this.datas.nodes,
            links: this.datas.links
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.echart-comp {
  height: 100%;
  position: relative;
  & > .nodata {
    position: absolute;
    top: 50%;
    left: 40%;
    z-index: 2;
    color: #999;
  }
}
</style>
