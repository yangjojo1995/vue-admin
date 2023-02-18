// 构造连接线
class LinkItem {
  constructor (centerId, nodeId, i, { type, typeStr, direction }, total) {
    let curvenessDirection = 0
    if (direction !== 'source') {
      this.source = centerId
      this.target = nodeId
      curvenessDirection = 1
    } else {
      this.source = nodeId
      this.target = centerId
      curvenessDirection = -1
    }
    const colorMap = {
      qq: '#15B64D',
      gl: '#E49E40',
      gk: '#576A94',
      yq: '#FF586D'
    }
    this.label = {
      show: true,
      position: 'middle', // 标签的位置
      formatter: typeStr || '邀请', // 标签命名
      color: colorMap[type] || '#FF586D', // 标签颜色
      fontSize: 12 // 标签字的大小
    }
    const curvenessArr = [0, 0.2, -0.2, 0.4, -0.4]
    if (total === 1) {
      curvenessArr[0] = Math.random() * 0.15
    } else if (total % 2 === 0) {
      curvenessArr.shift()
    }
    this.lineStyle = {
      width: 2, // 连接线粗细
      curveness: curvenessArr[i] * curvenessDirection, // 连接线曲率
      color: colorMap[type] || '#FF586D'
    }
    this.symbolSize = [0, 10]
  }
}

export default LinkItem
