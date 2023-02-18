import assets from '@/utils/assets'

// 构造连接点
class NodeItem {
  constructor (id, { roleType, shortName, icon }, position) {
    // 类型为合集节点
    this.name = id
    this.id_index = id
    this.roleType = roleType
    this.label = {
      formatter: shortName,
      fontSize: 12
    }
    this.symbolSize = 30
    const imgPath = icon ? assets(icon) : window.location.origin + '/orgGraph/default.png'
    this.symbol = `image://${imgPath}`
    if (position) {
      this.x = position.x
      this.y = position.y
      this.fixed = true
      this.symbolSize = 60
    }
  }
}

export default NodeItem
