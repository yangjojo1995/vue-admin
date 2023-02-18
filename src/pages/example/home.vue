<template>
  <div class="page">
    <ym-card header="数据平台" class="ym-mb-3">
      <ym-row :gutter="24">
        <ym-col :lg="6">
          <div class="data-plate">
            <span class="data-plate__icon" style="background: #742fdc;">
              <ym-icon icon="zhuti"></ym-icon>
            </span>
            <div class="data-plate__label">私募管理人(家)</div>
            <div class="data-plate__value">{{ dataPlate.plate1.value }}</div>
            <div class="data-plate__group">
              <div class="data-plate__item">
                <div class="data-plate__item__value">{{ dataPlate.plate1.treated }}</div>
                <div class="data-plate__item__label">已登记(家)</div>
              </div>
              <div class="data-plate__item">
                <div class="data-plate__item__value">{{ dataPlate.plate1.untreated }}</div>
                <div class="data-plate__item__label">未登记(家)</div>
              </div>
            </div>
          </div>
        </ym-col>
        <ym-col :lg="6">
          <div class="data-plate">
            <span class="data-plate__icon" style="background: #45cc7f;">
              <ym-icon icon="zhuti"></ym-icon>
            </span>
            <div class="data-plate__label">私募产品(个)</div>
            <div class="data-plate__value">{{ dataPlate.plate2.value }}</div>
            <div class="data-plate__group">
              <div class="data-plate__item">
                <div class="data-plate__item__value">{{ dataPlate.plate2.treated }}</div>
                <div class="data-plate__item__label">已备案(家)</div>
              </div>
              <div class="data-plate__item">
                <div class="data-plate__item__value">{{ dataPlate.plate2.untreated }}</div>
                <div class="data-plate__item__label">未备案(家)</div>
              </div>
            </div>
          </div>
        </ym-col>
        <ym-col :lg="12">
          <div class="data-plate-group ym-mb-3">
            <span class="data-plate-group__icon" style="background: #c7171e;">
              <ym-icon icon="zhuti"></ym-icon>
            </span>
            <div class="data-plate">
              <div class="data-plate__label">私募管理人(家)</div>
              <div class="data-plate__value">{{ dataPlate.plate3.value1 }}</div>
            </div>
            <div class="data-plate">
              <div class="data-plate__label">私募管理人(家)</div>
              <div class="data-plate__value">{{ dataPlate.plate3.value2 }}</div>
            </div>
          </div>
          <div class="data-plate">
            <div class="data-plate__group">
              <div class="data-plate__item">
                <div class="data-plate__item__value">{{ dataPlate.plate4.value1 }}</div>
                <div class="data-plate__item__label">私募管理人登记率</div>
              </div>
              <div class="data-plate__item">
                <div class="data-plate__item__value">{{ dataPlate.plate4.value2 }}</div>
                <div class="data-plate__item__label">私募产品备案率</div>
              </div>
              <div class="data-plate__item">
                <div class="data-plate__item__value">{{ dataPlate.plate4.value3 }}</div>
                <div class="data-plate__item__label">综合备案率</div>
              </div>
            </div>
          </div>
        </ym-col>
      </ym-row>
    </ym-card>

    <ym-row :gutter="24">
      <ym-col :lg="12">
        <ym-card header="代办事项" class="ym-mb-3">
          <div class="agency-statistics-item">
            <div class="agency-statistics-item__icon" style="color: #C7171E;">
              <ym-icon icon="zhuti"></ym-icon>
            </div>
            <div class="agency-statistics-item__info">
              <div class="agency-statistics-item__name">待审核基金管理人</div>
              <div class="agency-statistics-item__value">26</div>
            </div>
            <ym-button class="agency-statistics-item__button" type="primary">查看</ym-button>
          </div>
          <div class="agency-statistics-item">
            <div class="agency-statistics-item__icon" style="color: #47cb7f;">
              <ym-icon icon="zhuti"></ym-icon>
            </div>
            <div class="agency-statistics-item__info">
              <div class="agency-statistics-item__name">待审核基金管理人</div>
              <div class="agency-statistics-item__value">26</div>
            </div>
            <ym-button class="agency-statistics-item__button" type="primary">查看</ym-button>
          </div>
          <div class="agency-statistics-item">
            <div class="agency-statistics-item__icon" style="color: #4e94ff;">
              <ym-icon icon="zhuti"></ym-icon>
            </div>
            <div class="agency-statistics-item__info">
              <div class="agency-statistics-item__name">待审核基金管理人</div>
              <div class="agency-statistics-item__value">26</div>
            </div>
            <ym-button class="agency-statistics-item__button" type="primary">查看</ym-button>
          </div>
        </ym-card>
      </ym-col>
      <ym-col :lg="12">
        <ym-card header="快速导航" class="ym-mb-3">
          <div class="quick-nav">
            <div class="quick-nav-item">
              <div class="quick-nav-item__icon">
                <ym-icon icon="zhuti"></ym-icon>
              </div>
              <div class="quick-nav-item__name">基金管理人维护</div>
            </div>
            <div class="quick-nav-item">
              <div class="quick-nav-item__icon">
                <ym-icon icon="zhuti"></ym-icon>
              </div>
              <div class="quick-nav-item__name">事后-机构风险</div>
            </div>
            <div class="quick-nav-item">
              <div class="quick-nav-item__icon">
                <ym-icon icon="zhuti"></ym-icon>
              </div>
              <div class="quick-nav-item__name">基金管理人审核</div>
            </div>
            <div class="quick-nav-item">
              <div class="quick-nav-item__icon">
                <ym-icon icon="zhuti"></ym-icon>
              </div>
              <div class="quick-nav-item__name">基金产品维护</div>
            </div>
            <div class="quick-nav-item">
              <div class="quick-nav-item__icon">
                <ym-icon icon="zhuti"></ym-icon>
              </div>
              <div class="quick-nav-item__name">事后-产品风险</div>
            </div>
            <div class="quick-nav-item">
              <div class="quick-nav-item__icon">
                <ym-icon icon="zhuti"></ym-icon>
              </div>
              <div class="quick-nav-item__name">基金产品审核</div>
            </div>
          </div>
        </ym-card>
      </ym-col>
    </ym-row>

    <ym-row :gutter="24">
      <ym-col :lg="12">
        <ym-card header="私募管理人" class="ym-mb-3">
          <div class="echarts-box1">
            <ym-echarts :option="pieChartOption1"></ym-echarts>
          </div>
        </ym-card>
      </ym-col>
      <ym-col :lg="12">
        <ym-card header="私募产品" class="ym-mb-3">
          <div class="echarts-box1">
            <ym-echarts :option="pieChartOption2"></ym-echarts>
          </div>
        </ym-card>
      </ym-col>
    </ym-row>

    <ym-row :gutter="24">
      <ym-col :lg="12">
        <ym-card header="监控数据" class="ym-mb-3">
          <div slot="header">
            <span>监控数据</span>
            <span class="card-header-tip">（海峰数据）</span>
          </div>
          <ym-row :gutter="24">
            <ym-col :span="8">
              <div class="monitor">
                <div class="monitor__label">备案监测</div>
                <div class="monitor__value">{{ monitor.value1 }}</div>
              </div>
            </ym-col>
            <ym-col :span="8">
              <div class="monitor">
                <div class="monitor__label">确权监测</div>
                <div class="monitor__value">{{ monitor.value2 }}</div>
              </div>
            </ym-col>
            <ym-col :span="8">
              <div class="monitor">
                <div class="monitor__label">异常监控</div>
                <div class="monitor__value">{{ monitor.value3 }}</div>
              </div>
            </ym-col>
          </ym-row>
        </ym-card>
      </ym-col>
      <ym-col :lg="12">
        <ym-card header="风险提醒" class="ym-mb-3">
          <ym-row :gutter="24">
            <ym-col :lg="12">
              <div class="risk">
                <div class="risk__label">超过1年未完成登记管理人(家)</div>
                <div class="risk__value">{{ risk.value1 }}</div>
              </div>
            </ym-col>
            <ym-col :lg="12">
              <div class="risk">
                <div class="risk__label">超过1年未完成备案产品(家)</div>
                <div class="risk__value">{{ risk.value2 }}</div>
              </div>
            </ym-col>
          </ym-row>
        </ym-card>
      </ym-col>
    </ym-row>

    <ym-row :gutter="24">
      <ym-col :lg="12">
        <ym-card header="管理人-分类型登记通过情况" class="ym-mb-3">
          <div class="echarts-box2">
            <ym-echarts :option="barChartOption1"></ym-echarts>
          </div>
        </ym-card>
      </ym-col>
      <ym-col :lg="12">
        <ym-card header="基金产品-分类型备案通过情况" class="ym-mb-3">
          <div slot="header">
            <span>基金产品-分类型备案通过情况</span>
            <span class="card-header-tip">（海峰数据）</span>
          </div>
          <div class="echarts-box2">
            <ym-echarts :option="barChartOption2"></ym-echarts>
          </div>
        </ym-card>
      </ym-col>
    </ym-row>

    <ym-row :gutter="24">
      <ym-col :lg="12">
        <ym-card header="管理人-风险等级" class="ym-mb-3">
          <div slot="header">
            <span>管理人-风险等级</span>
            <span class="card-header-tip">（海峰的风险等级）</span>
          </div>
          <div class="echarts-box3">
            <ym-echarts :option="pieChartOption3"></ym-echarts>
          </div>
        </ym-card>
      </ym-col>
      <ym-col :lg="12">
        <ym-card header="基金产品-风险等级" class="ym-mb-3">
          <div slot="header">
            <span>基金产品-风险等级</span>
            <span class="card-header-tip">（海峰的风险等级）</span>
          </div>
          <div class="echarts-box3">
            <ym-echarts :option="pieChartOption4"></ym-echarts>
          </div>
        </ym-card>
      </ym-col>
    </ym-row>

    <!-- <img class="ym-mt-3" src="./index.png" alt="" style="width: 100%; height: 100%;"> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 数据平台
      dataPlate: {
        plate1: {
          value: 3540,
          treated: 26,
          untreated: 68
        },
        plate2: {
          value: 28630,
          treated: 34,
          untreated: 30
        },
        plate3: {
          value1: 698,
          value2: 802
        },
        plate4: {
          value1: '52%',
          value2: '65%',
          value3: '59%'
        }
      },
      // 代办事项统计
      agencyStatistics: {
        type1: 34,
        type2: 34,
        today: 30
      },
      // 监控数据
      monitor: {
        value1: 112,
        value2: 68,
        value3: 22
      },
      // 风险提醒
      risk: {
        value1: 89,
        value2: 90
      },
      // 私募管理人
      pieChartOption1: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          right: 0,
          height: 140,
          bottom: 'center',
          top: 'center',
          icon: 'circle',
          itemGap: 20,
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
          formatter: (name) => {
            const item = this.pieChartOption1.series[0].data.find(item => item.name === name)
            if (!item) return name
            const max = this.pieChartOption1.series[0].data.reduce((a, b) => a + b.value, 0)
            const percent = (item.value / max * 100).toFixed(2)
            return `{a|${name} - }{b|${item.value}}  {b|${percent}%}`
          }
        },
        color: ['#709ef9', '#70dcb2', '#7283a1', '#e9666b', '#80ceee', '#9f83d1', '#fca966', '#43a7a7'],
        series: [
          {
            z: 2,
            type: 'pie',
            radius: ['60%', '80%'],
            center: ['20%', '50%'],
            label: { show: false },
            labelLine: { show: false },
            data: [
              { value: 708, name: '存续' },
              { value: 2265, name: '在业' },
              { value: 107, name: '吊销' },
              { value: 117, name: '注销' },
              { value: 70, name: '迁出' },
              { value: 36, name: '停业' },
              { value: 71, name: '清算' },
              { value: 106, name: '迁入' }
            ]
          }, {
            z: 1,
            type: 'pie',
            radius: ['54%', '86%'],
            center: ['20%', '50%'],
            hoverAnimation: false,
            avoidLabelOverlap: false,
            label: { show: false },
            labelLine: { show: false },
            itemStyle: {
              normal: { color: '#eeeeee' },
              emphasis: { color: '#eeeeee' }
            },
            color: ['#eeeeee'],
            data: [
              { value: 100 }
            ]
          }
        ]
      },
      // 私募产品
      pieChartOption2: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          right: 0,
          height: 140,
          bottom: 'center',
          top: 'center',
          icon: 'circle',
          itemGap: 20,
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
          formatter: (name) => {
            const item = this.pieChartOption2.series[0].data.find(item => item.name === name)
            if (!item) return name
            const max = this.pieChartOption2.series[0].data.reduce((a, b) => a + b.value, 0)
            const percent = (item.value / max * 100).toFixed(2)
            return `{a|${name} - }{b|${item.value}}  {b|${percent}%}`
          }
        },
        color: ['#709ef9', '#70dcb2', '#7283a1', '#e9666b', '#80ceee', '#9f83d1', '#fca966', '#43a7a7'],
        series: [
          {
            z: 2,
            type: 'pie',
            radius: ['60%', '80%'],
            center: ['20%', '50%'],
            label: { show: false },
            labelLine: { show: false },
            data: [
              { value: 708, name: '存续' },
              { value: 2265, name: '在业' },
              { value: 107, name: '吊销' },
              { value: 117, name: '注销' },
              { value: 70, name: '迁出' },
              { value: 36, name: '停业' },
              { value: 71, name: '清算' },
              { value: 106, name: '迁入' }
            ]
          }, {
            z: 1,
            type: 'pie',
            radius: ['54%', '86%'],
            center: ['20%', '50%'],
            hoverAnimation: false,
            avoidLabelOverlap: false,
            label: { show: false },
            labelLine: { show: false },
            itemStyle: {
              normal: { color: '#eeeeee' },
              emphasis: { color: '#eeeeee' }
            },
            color: ['#eeeeee'],
            data: [
              { value: 100 }
            ]
          }
        ]
      },
      // 管理人-分类型登记通过情况
      barChartOption1: {
        grid: {
          top: 100,
          left: 40,
          right: 10,
          bottom: 40
        },
        legend: {
          show: true,
          itemGap: 20,
          itemStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item'
        },
        color: ['#e9666b', '#73a0fa', '#fca966', '#7283a1'],
        xAxis: [{
          type: 'category',
          axisLabel: { interval: 0 },
          data: ['2021M3', '2021M4', '2021M5', '2021M6', '2021M7', '2021M8', '2021M9', '2021M10', '2021M11']
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [
          {
            name: '私募证券投资基金管理人',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [320, 332, 301, 334, 390, 330, 320, 320, 320]
          },
          {
            name: '私募股权、创业投资基金管理人',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [320, 332, 301, 334, 390, 330, 320, 320, 320]
          },
          {
            name: '私募资产配置类管理人',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [320, 332, 301, 334, 390, 330, 320, 320, 320]
          },
          {
            name: '其他私募投资基金管理人',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [320, 332, 301, 334, 390, 330, 320, 320, 320]
          }
        ]
      },
      // 基金产品-分类型备案通过情况
      barChartOption2: {
        grid: {
          top: 100,
          left: 40,
          right: 10,
          bottom: 40
        },
        legend: {
          show: true,
          itemGap: 20,
          itemStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item'
        },
        color: ['#e9666b', '#73a0fa', '#fca966', '#7283a1'],
        xAxis: [{
          type: 'category',
          axisLabel: { interval: 0 },
          data: ['2021M3', '2021M4', '2021M5', '2021M6', '2021M7', '2021M8', '2021M9', '2021M10', '2021M11']
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [
          {
            name: '私募股权投资基金',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [320, 332, 301, 334, 390, 330, 320, 320, 320]
          },
          {
            name: '私募证券投资基金',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [320, 332, 301, 334, 390, 330, 320, 320, 320]
          },
          {
            name: '资产配置投资基金',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [320, 332, 301, 334, 390, 330, 320, 320, 320]
          },
          {
            name: '创业投资基金',
            type: 'bar',
            stack: 'stack',
            emphasis: { focus: 'series' },
            data: [320, 332, 301, 334, 390, 330, 320, 320, 320]
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
              { value: 708, name: '私募证券投资基金管理人' },
              { value: 2265, name: '私募股权、创业投资基金管理人' },
              { value: 107, name: '私募证券投资基金管理人2' },
              { value: 117, name: '私募股权、创业投资基金管理人2' },
              { value: 70, name: '私募股权、创业投资基金管理人3' }
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
              { value: 708, name: '私募证券投资基金管理人' },
              { value: 2265, name: '私募股权、创业投资基金管理人' },
              { value: 107, name: '私募证券投资基金管理人2' },
              { value: 117, name: '私募股权、创业投资基金管理人2' },
              { value: 70, name: '私募股权、创业投资基金管理人3' }
            ]
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  &::v-deep {
    .el-card {
      &__header {
        border-bottom: none;
        font-size: 20px;
        font-weight: 600;
        color: #212B36;
        line-height: 30px;
        padding-bottom: 0;
      }
    }
  }
}
.card-header-tip {
  color: #666666;
  font-weight: normal;
}

// 数据面板组
.data-plate-group {
  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  background: #F6F5FA;
  border-radius: 8px;
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
    background: #742FDC;
    color: #ffffff;
    ~ .data-plate {
      margin-top: 24px;
    }
  }
  .data-plate {
    flex: 1;
  }
}

// 数据面板
.data-plate {
  position: relative;
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  background: #F6F5FA;
  border-radius: 8px;
  overflow: hidden;
  &__icon {
    position: absolute;
    right: 24px;
    top: 24px;
    display: block;
    width: 46px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    font-size: 22px;
    border-radius: 50%;
    background: #742FDC;
    color: #ffffff;
    + .data-plate__label {
      margin-top: 24px;
    }
  }
  &__label {
    font-size: 16px;
    color: #333333;
    line-height: 1.5;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 28px;
    white-space: nowrap;
    overflow: hidden;
  }
  &__value {
    font-size: 38px;
    font-weight: bold;
    color: #333333;
    line-height: 1.5;
    margin-bottom: 72px;
    white-space: nowrap;
    overflow: hidden;
    &:last-child {
      margin-bottom: 0;
    }
  }
  &__group {
    display: flex;
    &:first-child {
      .data-plate__item {
        text-align: center;
        &__value {
          font-weight: bold;
          color: #333333;
        }
      }
    }
  }
  &__item {
    margin-right: 24px;
    flex: 1;
    flex-grow: 1;
    flex-shrink: 1;
    &:last-child {
      margin-right: 0;
    }
    &__value {
      font-size: 32px;
      font-weight: bold;
      color: #1971F1;
      line-height: 36px;
      margin-bottom: 12px;
      white-space: nowrap;
      overflow: hidden;
    }
    &__label {
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      line-height: 14px;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}

// 代办统计
.agency-statistics-item {
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
    background: #F5F5F9;
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

// 快速导航
.quick-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 44px;
  grid-column-gap: 24px;
  padding: 24px 0;
  &-item {
    overflow: hidden;
    cursor: pointer;
    max-width: 120px;
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
      background: linear-gradient(180deg, #9DDCBB 0%, #51B581 100%);
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
      background: linear-gradient(180deg, #9DDCBB 0%, #51B581 100%);
    }
    &:nth-child(2) &__icon {
      background: linear-gradient(180deg, #E99DA0 0%, #C7171E 100%);
    }
    &:nth-child(3) &__icon {
      background: linear-gradient(180deg, #BC90FF 0%, #742FDD 100%);
    }
    &:nth-child(4) &__icon {
      background: linear-gradient(180deg, #74ACFD 0%, #3382F5 100%);
    }
    &:nth-child(5) &__icon {
      background: linear-gradient(180deg, #FF8FA1 0%, #FD3C5B 100%);
    }
    &:nth-child(6) &__icon {
      background: linear-gradient(180deg, #FDC99F 0%, #FB892C 100%);
    }
  }
}

// 监控数据
.monitor {
  height: 108px;
  background: #F6F5FA;
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
  background: #F6F5FA;
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
    color: #1971F1;
  }
}

.echarts-box1 {
  height: 172px;
}
.echarts-box2 {
  height: 440px;
}
.echarts-box3 {
  height: 240px;
}

@media screen and (max-width: 1199px) {
  .data-plate {
    margin-bottom: 24px;
  }
}
</style>
