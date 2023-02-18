<template>
  <div class="map">
    <div class="org-map" id="app"></div>
  </div>
</template>

<script>
// import assets from '@/utils/assets'

const TMap = window.TMap

export default {
  layout: 'empty',
  props: {
    markerData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    // 标记物数据格式正确，在地图进行渲染
    markerData: {
      handler (arr) {
        // Array.isArray(arr) && this.initMarkerStyle() 使用合成logo
        // Array.isArray(arr) && this.createMarkerCluster() 使用点聚合
        Array.isArray(arr) && this.createMarkerLayer() // 使用点标记
      },
      immediate: true
    },
    // 当前选中区划
    currentDistrict: {
      handler (newVal, oldVal) {
        if (newVal !== '000000' && oldVal === '000000') {
          // 由全国转向省市，重新创建行政区划
          this.createDistrict()
        } else if (newVal !== '000000' && oldVal !== '000000') {
          // 省市之间互相切换，只需更新行政区划
          this.updateDistrict()
        } else if (newVal === '000000') {
          // 直接选中全国，一律重新初始化地图
          this.checkChina()
        }
      }
    }
  },
  data () {
    return {
      map: {}, // 地图实例
      polygons: null, // 边界对象
      district: null, // 行政区划对象
      markerLayer: null, // 点标记对象
      markStyleList: [], // 点标记样式集合
      mariList: [], // 点标记数据，从 markerData 转为 markerLayer 支持的数组
      currentDistrict: '440000'
    }
  },
  mounted () {
    // 设定地图范围
    this.initMap()

    // 设置行政区划边界
    this.createDistrict()
  },
  methods: {
    // 初始化地图
    initMap () {
      // 定义map变量，调用 TMap.Map() 构造函数创建地图
      this.map = new TMap.Map(document.getElementById('app'), {
        center: new TMap.LatLng(30.633099, 111.076136),
        zoom: 5,
        pitch: 0, // 设置俯仰角
        baseMap: {
          type: 'vector', // 类型：失量底图
          features: ['base', 'building3d', 'building2d', 'point']
        }
      })

      var clickHandler = function (evt) {
        var lat = evt.latLng.getLat().toFixed(6)
        var lng = evt.latLng.getLng().toFixed(6)
        console.log('坐标：' + lat + ',' + lng)
      }
      // Map实例创建后，通过on方法绑定点击事件
      this.map.on('click', clickHandler)
      window.map = this.map
    },

    // 显示全国
    checkChina () {
      this.map.destroy()
      this.initMap()
      this.map.setBoundary(new TMap.LatLngBounds(new TMap.LatLng(2.7, 72), new TMap.LatLng(54, 136)))
    },

    // 设定行政区划，以及地图边界
    createDistrict () {
      this.district = new TMap.service.District({
        polygon: 1 // 返回行政区划边界的类型
      })
      this.polygons = new TMap.MultiPolygon({
        map: this.map,
        geometries: []
      })
      this.updateDistrict()
    },

    // 更新行政区划和边界
    updateDistrict () {
      this.polygons.remove(this.polygons.getGeometries().map((item) => item.id))
      this.district
        .search({ keyword: this.currentDistrict })
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
              this.polygons.updateGeometries(newGeometries)
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
        boundsS = boundsS - extend - 0.1
        boundsW = boundsW - extend
        boundsE = boundsE + extend
      }
      return [new TMap.LatLng(boundsS, boundsW),
        new TMap.LatLng(boundsN, boundsE)]
    },

    getLatLngBounds (SW, NE) {
      return new TMap.LatLngBounds(SW, NE)
    },

    // 创建聚合簇，聚合簇和点标记二选一
    /*  createMarkerCluster () {
      if (this.markerCluster) {
        this.markerCluster.setMap(null)
      }
      if (Array.isArray(this.markerData) && this.markerData.length === 0) {
        return
      }
      const mariList = this.markerData.map((item) => {
        return {
          id: item.id,
          position: new TMap.LatLng(item.location.latitude, item.location.longitude),
          properties: item
        }
      })
      this.markerCluster = new TMap.MarkerCluster({
        id: 'cluster', // 图层id
        map: this.map, // 设置点聚合显示在哪个map对象中（创建map的段落省略）
        enableDefaultStyle: true, // 使用默认样式
        minimumClusterSize: 2, // 最小聚合点数：2个
        geometries: mariList,
        zoomOnClick: false, // 点击聚合数字放大展开
        gridSize: 10, // 聚合算法的可聚合距离，即距离小于该值的点会聚合至一起，默认为60，以像素为单位
        averageCenter: false, // 每个聚和簇的中心是否应该是聚类中所有标记的平均值
        maxZoom: 8 // 采用聚合策略的最大缩放级别，若地图缩放级别大于该值，则不进行聚合，标点将全部被展开
      })
      // 绑定点击回调事件
      this.markerCluster.on('click', (evt) => {
        const { geometries } = evt.cluster
        if (geometries.length === 1) {
          const { properties } = geometries[0]
          this.$emit('checkOrg', properties)
        }
      })
    },
 */
    createMarkerLayer () {
      if (this.markerLayer) {
        this.markerLayer.setMap(null)
      }
      if (Array.isArray(this.markerData) && this.markerData.length === 0) {
        return
      }

      this.mariList = this.markerData.map((item) => {
        return {
          id: item.id,
          styleId: 'marks',
          position: new TMap.LatLng(item.location.latitude, item.location.longitude),
          properties: item
        }
      })
      this.markerLayer = new TMap.MultiMarker({
        id: 'markerLayer',
        map: this.map, // 指定地图容器
        // 样式定义
        styles: {
          marks: new TMap.MarkerStyle({
            width: 32, // 点标记样式宽度（像素）
            height: 34, // 点标记样式高度（像素）
            src: window.location.origin + '/orgMap/markicon.png' // 图片路径
            // 焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
            // anchor: { x: 15, y: 17 }
          })
        },
        // 点标记数据数组
        geometries: this.mariList
      })

      // 监听marker点击事件
      this.markerLayer.on('click', (evt) => {
        this.$emit('checkOrg', evt.geometry.properties)
      })
    },

    /*  initMarkerStyle () {
      console.log(new Date().getTime())
      if (this.markerLayer) {
        this.markerLayer.setMap(null)
      }
      if (Array.isArray(this.markerData) && this.markerData.length === 0) {
        return
      }

      this.mariList = this.markerData.map((item) => {
        this.MergedImages(item.id, item.logo)
        // this.markStyleList.push({ id: item.id, img: assets(item.logo) })
        return {
          id: item.id,
          styleId: item.id,
          position: new TMap.LatLng(item.location.latitude, item.location.longitude),
          properties: item
        }
      })

      this.setMarkerLayer()
    },

    MergedImages (itemId, logo) {
      var data = [window.location.origin + '/orgMap/mark.png', assets(logo)]
      draw((img) => {
        this.markStyleList.push({ id: itemId, img: img })
        if (this.markStyleList.length === this.mariList.length) {
          console.log('logo全部合成完毕')
          this.setMarkerLayer()
        }
      })
      function draw (fn) {
        const c = document.createElement('canvas')
        var ctx = c.getContext('2d')
        var len = data.length
        // 设置画布宽高
        c.width = 74
        c.height = 88
        ctx.rect(0, 0, c.width, c.height)
        ctx.fillStyle = 'transparent'
        ctx.fill()
        function drawing (n) {
          if (n < len) {
            var img = new Image()
            img.crossOrigin = 'Anonymous' // 解决跨域
            img.src = data[n]
            img.onload = function () {
              var imgWidth = 74
              var imgHeight = 88
              if (n === 0) {
                ctx.drawImage(img, 0, 0, imgWidth, imgHeight)// 10为距画布左上角的x/y坐标
              } else {
                ctx.beginPath()
                ctx.arc(37, 36, 32, 0, Math.PI * 2) // 用来绘制圆弧，也可以用来绘制正圆
                ctx.fill() // 路径填充
                ctx.clip() // 路径裁剪，先绘制路径，再执行此方法，最后绘制的内容就在这个裁剪路径中呈现
                ctx.drawImage(img, 0, 0, imgWidth, imgHeight) // 绘制图像，对图像提供处理和操作
              }
              drawing(n + 1) // 递归
            }
          } else {
            fn(c.toDataURL())
          }
        }
        drawing(0)
      }
    },

    setMarkerLayer () {
      console.log(new Date().getTime())
      const styles = {}
      this.markStyleList.forEach(item => {
        styles[item.id] = new TMap.MarkerStyle({
          width: 37, // 点标记样式宽度（像素）
          height: 44, // 点标记样式高度（像素）
          src: item.img // 图片路径
          // 焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
          // anchor: { x: 16, y: 32 }
        })
      })
      this.markerLayer = new TMap.MultiMarker({
        id: 'markerLayer',
        map: this.map, // 指定地图容器
        // 样式定义
        styles: styles,
        // 点标记数据数组
        geometries: this.mariList
      })

      // 监听marker点击事件
      this.markerLayer.on('click', (evt) => {
        console.log(evt)
        this.$emit('checkOrg', evt.geometry.properties)
      })
    }, */

    // 更换选中地区
    checkSearchCity (code) {
      this.currentDistrict = code
    }
  }
}
</script>

<style lang="scss" scoped>
.map{
  position: relative;
  height:calc(100vh - 64px);

  #app{
    width:100%;
    height: 100%;
  }

  .org-total{
    width: 60px;
    height: 60px;
    background: #FFFFFF;
    box-shadow: 0px 2px 6px 0px rgba(62,62,62,0.26);
    border-radius: 10px;
    position: absolute;
    top: 16px;
    left: 16px;
    font-size: 13px;
    font-weight: 500;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

</style>
