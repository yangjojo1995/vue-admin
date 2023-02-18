<template>
  <div class="page">
    <div class="none">
      <img src="@/assets/images/global/none.png" alt="暂未开放" />
      <div>暂未开放</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 一年前
      aYearAgo: new Date().getTime() - 1000 * 60 * 60 * 24 * 365,

      // 私募管理人
      pieChartOption1: {
        title: {
          text: '{a|1000}{b|\n(家)}',
          top: '35%',
          left: '24%',
          right: '10%',
          textAlign: 'center',
          textStyle: {
            rich: {
              a: {
                fontSize: 20,
                color: '#333333',
                fontWeight: 500,
                lineHeight: 30,
                align: 'center'
              },
              b: {
                fontSize: 14,
                color: '#666666',
                align: 'center'
              }
            }
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: '50%',
          bottom: 'center',
          top: 'center',
          icon: 'circle',
          itemGap: 14,
          textStyle: {
            rich: {
              a: {
                color: '#666666',
                fontSize: 14
              },
              b: {
                color: '#999999',
                fontSize: 14
              }
            }
          },
          tooltip: {
            show: true,
            formatter: params => {
              const item = this.pieChartOption2.series[0].data.find(
                item => item.name === params.name
              )
              if (!item) return params.name
              return item.description || params.name
            }
          },
          formatter: name => {
            const item = this.pieChartOption1.series[0].data.find(
              item => item.name === name
            )
            if (!item) return name
            return `{a|${name} - }{b|${item.value ||
              0}}  {b|${item.percentage || 0}%}`
          }
        },
        color: [
          '#709ef9',
          '#70dcb2',
          '#7283a1',
          '#e9666b',
          '#80ceee',
          '#bbbbbb'
        ],
        series: [
          {
            z: 2,
            type: 'pie',
            radius: ['60%', '80%'],
            center: ['25%', '50%'],
            label: { show: false },
            labelLine: { show: false },
            data: [
              { name: '正在运作', value: 200, percentage: 20 },
              { name: '迁出', value: 100, percentage: 10 },
              { name: '工商注销', value: 100, percentage: 10 },
              { name: '清退（拉入工商异常）', value: 150, percentage: 15 },
              { name: '清退（以公告简易注销）', value: 150, percentage: 15 },
              { name: '其他', value: 300, percentage: 30 }
            ]
          },
          {
            z: 1,
            type: 'pie',
            radius: ['54%', '86%'],
            center: ['25%', '50%'],
            hoverAnimation: false,
            avoidLabelOverlap: false,
            label: { show: false },
            labelLine: { show: false },
            tooltip: { show: false },
            itemStyle: {
              normal: { color: '#eeeeee' },
              emphasis: { color: '#eeeeee' }
            },
            color: ['#eeeeee'],
            data: [{ value: 100 }]
          }
        ]
      },
      // 私募产品
      pieChartOption2: {
        title: {
          text: '{a|1000}{b|\n(个)}',
          top: '35%',
          left: '24%',
          right: '10%',
          textAlign: 'center',
          textStyle: {
            rich: {
              a: {
                fontSize: 20,
                color: '#333333',
                fontWeight: 500,
                lineHeight: 30,
                align: 'center'
              },
              b: {
                fontSize: 14,
                color: '#666666',
                align: 'center'
              }
            }
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: '50%',
          bottom: 'center',
          top: 'center',
          icon: 'circle',
          itemGap: 14,
          textStyle: {
            rich: {
              a: {
                color: '#666666',
                fontSize: 14
              },
              b: {
                color: '#999999',
                fontSize: 14
              }
            }
          },
          tooltip: {
            show: true,
            formatter: params => {
              const item = this.pieChartOption2.series[0].data.find(
                item => item.name === params.name
              )
              if (!item) return params.name
              return item.description || params.name
            }
          },
          formatter: name => {
            const item = this.pieChartOption2.series[0].data.find(
              item => item.name === name
            )
            if (!item) return name
            return `{a|${name} - }{b|${item.value ||
              0}}  {b|${item.percentage || 0}%}`
          }
        },
        color: [
          '#709ef9',
          '#70dcb2',
          '#7283a1',
          '#e9666b',
          '#80ceee',
          '#bbbbbb'
        ],
        series: [
          {
            z: 2,
            type: 'pie',
            radius: ['60%', '80%'],
            center: ['25%', '50%'],
            label: { show: false },
            labelLine: { show: false },
            data: [
              { name: '正在运作', value: 200, percentage: 20 },
              { name: '迁出', value: 100, percentage: 10 },
              { name: '工商注销', value: 100, percentage: 10 },
              { name: '清退（拉入工商异常）', value: 150, percentage: 15 },
              { name: '清退（以公告简易注销）', value: 150, percentage: 15 },
              { name: '其他', value: 300, percentage: 30 }
            ]
          },
          {
            z: 1,
            type: 'pie',
            radius: ['54%', '86%'],
            center: ['25%', '50%'],
            hoverAnimation: false,
            avoidLabelOverlap: false,
            label: { show: false },
            labelLine: { show: false },
            tooltip: { show: false },
            itemStyle: {
              normal: { color: '#eeeeee' },
              emphasis: { color: '#eeeeee' }
            },
            color: ['#eeeeee'],
            data: [{ value: 100 }]
          }
        ]
      },
      // 管理人-分类型登记通过情况
      barChartOption1: {
        grid: {
          top: 88,
          left: 40,
          right: 10,
          bottom: 50
        },
        legend: {
          show: true,
          itemGap: 10,
          itemStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        color: ['#e9666b', '#73a0fa', '#fca966', '#7283a1', '#73deb3'],
        xAxis: [
          {
            type: 'category',
            axisLabel: { interval: 0, rotate: 40 },
            data: [
              '2022-01',
              '2022-02',
              '2022-03',
              '2022-04',
              '2022-05',
              '2022-06',
              '2022-07',
              '2022-08',
              '2022-09',
              '2022-10',
              '2022-11',
              '2022-12'
            ]
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '私募证券投资基金管理人',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
          },
          {
            name: '创业投资基金',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
          },
          {
            name: '私募证券投资基金',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
          },
          {
            name: '其他私募投资基金',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
          },
          {
            name: '未填报管理人类型',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
          }
        ]
      },
      // 基金产品-分类型备案通过情况
      barChartOption2: {
        grid: {
          top: 88,
          left: 40,
          right: 10,
          bottom: 50
        },
        legend: {
          show: true,
          itemGap: 10,
          itemStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        color: ['#e9666b', '#73a0fa', '#fca966', '#7283a1', '#73deb3'],
        xAxis: [
          {
            type: 'category',
            axisLabel: { interval: 0, rotate: 40 },
            rotate: 40,
            data: [
              '2022-01',
              '2022-02',
              '2022-03',
              '2022-04',
              '2022-05',
              '2022-06',
              '2022-07',
              '2022-08',
              '2022-09',
              '2022-10',
              '2022-11',
              '2022-12'
            ]
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '私募股权投资基金',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
          },
          {
            name: '创业投资基金',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
          },
          {
            name: '私募证券投资基金',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
          },
          {
            name: '其他私募投资基金',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
          },
          {
            name: '资产配置投资基金',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
          }
        ]
      },
      // 管理人-风险等级
      pieChartOption3: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: '50%',
          bottom: 'center',
          top: 'center',
          icon: 'circle',
          itemGap: 20,
          textStyle: {
            fontSize: 14
          }
        },
        color: ['#73a0fa', '#73deb3', '#7585a2', '#fca966', '#e9666b'],
        series: [
          {
            type: 'pie',
            radius: ['80%'],
            center: ['25%', '50%'],
            label: { show: false },
            labelLine: { show: false },
            data: [
              { value: 10, name: '一般类' },
              { value: 10, name: '关注类' },
              { value: 10, name: '重点关注类' }
            ]
          }
        ]
      },
      // 基金产品-风险等级
      pieChartOption4: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: '50%',
          bottom: 'center',
          top: 'center',
          icon: 'circle',
          itemGap: 20,
          textStyle: {
            fontSize: 14
          }
        },
        color: ['#73a0fa', '#73deb3', '#7585a2', '#fca966', '#e9666b'],
        series: [
          {
            type: 'pie',
            radius: ['80%'],
            center: ['25%', '50%'],
            label: { show: false },
            labelLine: { show: false },
            data: [
              { value: 10, name: '一般类' },
              { value: 10, name: '关注类' },
              { value: 10, name: '重点关注类' }
            ]
          }
        ]
      }
    }
  },
  async mounted () {},
  methods: {
    pieChartOption1Click (param) {},
    pieChartOption2Click (param) {}
  }
}
</script>

<style lang="scss" scoped>
.none {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 15vh;
  img {
    width: 300px;
    height: auto;
  }
  div {
    font-weight: bold;
    font-size: 15px;
  }
}
// 卡片标题描述
.card-header-tip {
  color: #666666;
  font-weight: normal;
}

// 数据平台
.data-plate {
  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  background: #f6f5fa;
  border-radius: 8px;
  min-height: 46px + (24px * 2);
  padding: 24px;
  margin-bottom: 24px;
  &:last-child {
    margin-bottom: 0;
  }
  &__icon {
    position: absolute;
    right: 24px;
    top: 24px;
    z-index: 1;
    display: block;
    width: 46px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    font-size: 22px;
    border-radius: 50%;
    background: #742fdc;
    color: #ffffff;
    ~ .data-plate__item {
      margin-top: 24px;
    }
  }
  &__item {
    flex: 1;
    &__label {
      font-size: 16px;
      color: #333333;
      line-height: 1.5;
      margin-bottom: 28px;
      white-space: nowrap;
      overflow: hidden;
    }
    &__value {
      font-size: 38px;
      font-weight: bold;
      color: #333333;
      line-height: 1.5;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .data-minplate {
    padding: 0;
    margin-top: 72px;
  }
}

// 数据平台
.data-minplate {
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  background: #f6f5fa;
  border-radius: 8px;
  padding: 24px;
  box-sizing: border-box;
  &__item {
    flex: 1;
    flex-grow: 1;
    flex-shrink: 1;
    &:last-child {
      margin-right: 0;
    }
    &__label {
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      line-height: 14px;
      white-space: nowrap;
      overflow: hidden;
      margin-bottom: 12px;
    }
    &__value {
      font-size: 32px;
      font-weight: bold;
      color: #333333;
      line-height: 36px;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}

// 链接
.is-link {
  cursor: pointer;
  color: $--ym-color-primary;
  &:hover {
    text-decoration: underline;
  }
}

// 代办统计
.agency-statistics {
  display: flex;
  height: 156px;
  flex-direction: column;
  justify-content: space-evenly;
  &-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 34px;
    &:last-child {
      margin-bottom: 0;
    }
    &__icon {
      flex-grow: 0;
      flex-shrink: 0;
      width: 50px;
      height: 50px;
      background: #f5f5f9;
      border-radius: 4px;
      margin-right: 20px;
      line-height: 50px;
      text-align: center;
      font-size: 22px;
      color: #ffffff;
    }
    &__info {
      flex: 1;
    }
    &__button {
      flex-grow: 0;
      flex-shrink: 0;
    }
    &__name {
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      line-height: 14px;
      margin-bottom: 8px;
      white-space: nowrap;
    }
    &__value {
      font-size: 28px;
      font-weight: bold;
      color: #333333;
      line-height: 30px;
    }
  }
}

// 快速导航
.quick-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 24px;
  grid-column-gap: 24px;
  &-item {
    overflow: hidden;
    cursor: pointer;
    max-width: 120px;
    margin: auto;
    user-select: none;
    transition: all 0.3s;
    &:hover {
      transform: scale(1.1);
    }
    &:active {
      transform: scale(0.9);
    }
    &__icon {
      display: block;
      margin: auto;
      width: 40px;
      height: 40px;
      line-height: 40px;
      background: linear-gradient(180deg, #9ddcbb 0%, #51b581 100%);
      border-radius: 4px;
      text-align: center;
      color: #ffffff;
    }
    &__name {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 14px;
      text-align: center;
      margin-top: 12px;
      white-space: nowrap;
    }
    &:nth-child(1) &__icon {
      background: linear-gradient(180deg, #9ddcbb 0%, #51b581 100%);
    }
    &:nth-child(2) &__icon {
      background: linear-gradient(180deg, #e99da0 0%, #c7171e 100%);
    }
    &:nth-child(3) &__icon {
      background: linear-gradient(180deg, #bc90ff 0%, #742fdd 100%);
    }
    &:nth-child(4) &__icon {
      background: linear-gradient(180deg, #74acfd 0%, #3382f5 100%);
    }
    &:nth-child(5) &__icon {
      background: linear-gradient(180deg, #ff8fa1 0%, #fd3c5b 100%);
    }
    &:nth-child(6) &__icon {
      background: linear-gradient(180deg, #fdc99f 0%, #fb892c 100%);
    }
  }
}

// 监控数据
.monitor {
  height: 108px;
  background: #f6f5fa;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__label {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
    margin-bottom: 10px;
    white-space: nowrap;
  }
  &__value {
    font-size: 32px;
    font-weight: bold;
    color: #333333;
    line-height: 36px;
    white-space: nowrap;
  }
}

// 风险提醒
.risk {
  height: 108px;
  background: #f6f5fa;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__label {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
    margin-bottom: 10px;
    white-space: nowrap;
  }
  &__value {
    font-size: 32px;
    font-weight: bold;
    line-height: 36px;
    white-space: nowrap;
    color: #1971f1;
  }
}

.echarts-box1 {
  height: 172px;
}
.echarts-box2 {
  height: 340px;
}
.echarts-box3 {
  height: 240px;
}

@media screen and (max-width: 1199px) {
  .data-plate {
    margin-bottom: 24px !important;
  }
}
</style>
