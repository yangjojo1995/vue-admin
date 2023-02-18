<template>
  <div>
    <div id="app">
  </div>
  </div>
</template>

<script>

const TMap = window.TMap

export default {
  layout: 'empty',
  data () {
    return {
      map: {}, // 地图实例

      // 标记点
      mariList: [
        {
          id: '1',
          position: new TMap.LatLng(23.127459, 113.258534), // 点标记坐标位置
          properties: { title: '广州基金' }
        },
        {
          id: '2',
          position: new TMap.LatLng(20.304679, 110.135322),
          properties: { title: '西南基金' }
        },
        {
          id: '3',
          position: new TMap.LatLng(25.498104, 113.229780),
          properties: { title: '北部基金' }
        },
        {
          id: '4',
          position: new TMap.LatLng(23.625066, 117.176917),
          properties: { title: '东部基金' }
        },
        {
          id: '5',
          position: new TMap.LatLng(23.164128, 113.201780),
          properties: { title: '浔峰岗基金' }
        },
        {
          id: '6',
          position: new TMap.LatLng(23.150446, 113.324310),
          properties: { title: '广州东站' }
        },
        {
          id: '7',
          position: new TMap.LatLng(23.722391, 114.697170),
          properties: { title: '河源广播电视大学' }
        },
        {
          id: '8',
          position: new TMap.LatLng(23.721317, 114.664872),
          properties: { title: '天后宫' }
        },
        {
          id: '8',
          position: new TMap.LatLng(23.049262, 112.461050),
          properties: { title: '肇庆基金' }
        }
      ]
    }
  },
  mounted () {
    // 设定地图范围
    // 设置行政区划边界
    // 根据经纬度设置标记，且标记有回调事件
    this.initMap()
    this.createDistrict()
    this.createMarkerCluster()
  },
  methods: {
    // 初始化地图
    initMap () {
      // 定义map变量，调用 TMap.Map() 构造函数创建地图
      this.map = new TMap.Map(document.getElementById('app'), {
        center: new TMap.LatLng(23.130574, 113.257980),
        zoom: 9,
        pitch: 0 // 设置俯仰角
      })

      var clickHandler = function (evt) {
        var lat = evt.latLng.getLat().toFixed(6)
        var lng = evt.latLng.getLng().toFixed(6)
        console.log('坐标：' + lat + ',' + lng)
      }
      // Map实例创建后，通过on方法绑定点击事件
      this.map.on('click', clickHandler)
    },

    // 设定行政区划，以及地图边界
    createDistrict () {
      var district = new TMap.service.District({
        polygon: 1 // 返回行政区划边界的类型
      })
      var polygons = new TMap.MultiPolygon({
        map: this.map,
        geometries: []
      })
      polygons.remove(polygons.getGeometries().map((item) => item.id))
      district
        .search({ keyword: '440000' })
        .then((result) => {
          // 搜索行政区划信息
          const bounds = []
          result.result.forEach((level) => {
            level.forEach((place) => {
              var newGeometries = place.polygon.map((polygon, index) => {
                const arr = this.fitBounds(polygon)
                bounds.push(this.getLatLngBounds(arr[0], arr[1])) // 计算能完整呈现行政区边界的最小矩形范围
                return {
                  id: `${place.id}_${index}`,
                  paths: polygon // 将得到的行政区划边界用多边形标注在地图上
                }
              })
              polygons.updateGeometries(newGeometries)
            })
          })
          // 遍历出最小边界
          let mapBound = bounds.reduce((a, b) => {
            const arr = this.fitBounds([
              a.getNorthEast(),
              a.getSouthWest(),
              b.getNorthEast(),
              b.getSouthWest()
            ])
            return this.getLatLngBounds(arr[0], arr[1])
          })
          // 最小边界扩展0.2左右的显示范围
          const arr = this.fitBounds([mapBound.getNorthEast(), mapBound.getSouthWest()], 0.2)
          mapBound = this.getLatLngBounds(arr[0], arr[1])
          this.map.fitBounds(mapBound)
          this.map.setBoundary(mapBound)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    // 计算能完整呈现该多边形的最小矩形范围
    // extend，若不为0，则对最终边界进行扩展/缩减，值为正则进行边界扩展
    fitBounds (latLngList, extend = 0) {
      if (latLngList.length === 0) {
        return null
      }
      let boundsN = latLngList[0].getLat()
      let boundsS = boundsN
      let boundsW = latLngList[0].getLng()
      let boundsE = boundsW
      latLngList.forEach((point) => {
        point.getLat() > boundsN && (boundsN = point.getLat())
        point.getLat() < boundsS && (boundsS = point.getLat())
        point.getLng() > boundsE && (boundsE = point.getLng())
        point.getLng() < boundsW && (boundsW = point.getLng())
      })
      if (extend) {
        boundsN = boundsN + extend
        boundsS = boundsS - extend
        boundsW = boundsW - extend
        boundsE = boundsE + extend
      }
      return [new TMap.LatLng(boundsS, boundsW),
        new TMap.LatLng(boundsN, boundsE)]
    },

    getLatLngBounds (SW, NE) {
      return new TMap.LatLngBounds(SW, NE)
    },

    // 创建标记点
    createMark () {
      // 创建并初始化MultiMarker
      var markerLayer = new TMap.MultiMarker({
        map: this.map, // 指定地图容器
        // 样式定义
        styles: {
          // 创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
          myStyle: new TMap.MarkerStyle({
            width: 20, // 点标记样式宽度（像素）
            height: 20, // 点标记样式高度（像素）
            src: require('../../../assets/images/map/mark.png'), // 图片路径
            // 焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
            anchor: { x: 10, y: 20 }
          })
        },
        // 点标记数据数组
        geometries: this.mariList
      })

      // 监听marker点击事件
      markerLayer.on('click', (evt) => {
        const { properties, position } = evt.geometry
        this.$message(`${properties.title}：${position.lat},${position.lng}`)
      })
    },

    // 创建聚合簇，聚合簇和点标记二选一
    createMarkerCluster () {
      var markerCluster = new TMap.MarkerCluster({
        id: 'cluster', // 图层id
        map: this.map, // 设置点聚合显示在哪个map对象中（创建map的段落省略）
        enableDefaultStyle: true, // 使用默认样式
        minimumClusterSize: 2, // 最小聚合点数：2个
        geometries: this.mariList,
        zoomOnClick: false, // 点击聚合数字放大展开
        gridSize: 60, // 聚合算法的可聚合距离，即距离小于该值的点会聚合至一起，默认为60，以像素为单位
        averageCenter: false, // 每个聚和簇的中心是否应该是聚类中所有标记的平均值
        maxZoom: 16 // 采用聚合策略的最大缩放级别，若地图缩放级别大于该值，则不进行聚合，标点将全部被展开
      })
      console.log(markerCluster)
      // 绑定点击回调事件
      markerCluster.on('click', (evt) => {
        const { geometries } = evt.cluster
        if (geometries.length === 1) {
          const { properties, position } = geometries[0]
          this.$message(`${properties.title}：${position.lat},${position.lng}`)
        }
      })
    }
  }
}
</script>

<style lang="css" scoped>
#app{
        /*地图(容器)显示大小*/
        width:100%;
        height:100vh;
    }
</style>
