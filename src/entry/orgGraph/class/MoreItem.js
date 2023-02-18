
// 构造查看更多接点
class MoreItem {
  constructor ({ shortName }, { type }) {
    const colorMap = {
      qq: '#15B64D',
      gl: '#E49E40',
      gk: '#576A94',
      yq: '#FF586D'
    }
    const color = colorMap[type] // 标签颜色
    this.name = type
    this.symbolSize = 60
    this.label = {
      position: 'inside',
      fontSize: 10,
      formatter: shortName + '\n' + '查看更多',
      color: color,
      fontWeight: 'lighter',
      textShadowColor: color,
      textShadowBlur: 1
    }
    this.itemStyle = {
      color: '#fff',
      borderColor: color,
      borderWidth: 1,
      borderType: 'dotted',
      shadowColor: color
    }
  }
}

export default MoreItem
