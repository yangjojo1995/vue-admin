<template>
  <div>
    <div ref="charts" id="main">
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import data from './data.js'
export default {
  data () {
    return {
      markList: [
        [110.135322, 20.304679, '基金一'],
        [113.229780, 25.498104, '基金二'],
        [113.324310, 23.150446, '广州东站']
      ]
    }
  },
  layout: 'empty',
  created () {
    this.$nextTick(() => {
      this.initCharts()
    })
  },
  methods: {
    initCharts () {
      const charts = echarts.init(this.$refs.charts)
      const option = {
        // 背景颜色
        backgroundColor: '#404a59',
        // 提示浮窗样式
        tooltip: {
          show: true,
          trigger: 'item',
          alwaysShowContent: false,
          backgroundColor: '#0C121C',
          borderColor: 'rgba(0, 0, 0, 0.16);',
          hideDelay: 100,
          triggerOn: 'mousemove',
          enterable: true,
          textStyle: {
            color: '#DADADA',
            fontSize: '12',
            width: 20,
            height: 30,
            overflow: 'break'
          },
          showDelay: 100
        },
        // 地图配置
        geo: {
          map: 'gd',
          label: {
            // 通常状态下的样式
            normal: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            },
            // 鼠标放上去的样式
            emphasis: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          // 地图区域的样式设置
          itemStyle: {
            normal: {
              borderColor: 'rgba(147, 235, 248, 1)',
              borderWidth: 1,
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(147, 235, 248, 0)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(147, 235, 248, .2)' // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              },
              shadowColor: 'rgba(128, 217, 248, 1)',
              shadowOffsetX: -2,
              shadowOffsetY: 2,
              shadowBlur: 10
            },
            // 鼠标放上去高亮的样式
            emphasis: {
              areaColor: '#389BB7',
              borderWidth: 0
            }
          }
        },
        series: {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          geoIndex: 0,
          symbolSize: 10,
          itemStyle: {
            color: '#fab64b'
          },
          encode: {
            tooltip: 2
          },
          data: this.markList
        }
      }
      // 地图注册，第一个参数的名字必须和option.geo.map一致
      echarts.registerMap('gd', data)

      charts.setOption(option)
    }
  }
}
</script>

<style lang="css" scoped>
#main{
        /*地图(容器)显示大小*/
        width:100%;
        height:100vh;
    }
</style>
