<template>
  <!-- 筛选栏 -->
  <div class="org-drawer">
    <div class="org-drawer-bar">
      <div class="flex-center org-drawer-bar-item" v-for="(item, key) in drawerData" :key="key" :class="{'active': activeDrawer==key}" @click="toggleDrawer(key)">
        <span v-if="key==='city'">{{barNameCity(item)}}</span>
        <span v-else>{{checkedData[key].label || item.label}}</span>
        <div class="triangle-down"></div>
      </div>
    </div>

    <div class="org-drawer-board" :class="{'active': !!activeDrawerClass}">
      <div v-if="!activeDrawerData">暂无数据</div>

      <!-- 城市筛选 -->
      <div v-else-if="activeDrawerData==='city'" class="city-board">
        <div class="city-board-province">
          <div class="flex-center city-board-province-label" :class="{'active': ifProvinceChecked(item)}" v-for="item in drawerData.city.group" :key="item.id" @click="checkProvince(item)">
            {{item.name}}
          </div>
        </div>
        <div class="city-board-group">
          <div :class="{'active': ifCityChecked(item)}" class="flex-center city-board-group-item" v-for="item in checkedData.city.children" :key="item.id" @click="checkCity(item)">
            {{item.name}}
          </div>
        </div>
      </div>

      <div v-else v-for="item in drawerData[activeDrawerData].group" :key="item.value" class="org-drawer-board-group" :class="{'active': ifItemChecked(item) }" @click="checkGroup(item)">
        {{item.label}}
      </div>
    </div>
  </div>

</template>

<script>
export default {
  props: {
    drawerData: {
      type: Object,
      default: () => {
        return { field: {}, city: {}, round: {} }
      }
    }
  },

  data () {
    return {
      activeDrawer: '',
      activeDrawerData: '', // 数据渲染
      activeDrawerClass: '', // 效果渲染

      checkedData: {} // 选中数据
    }
  },
  computed: {

    // 顶部栏，选中城市名
    barNameCity () {
      return function (item) {
        // 省名
        if (this.checkedData.city && this.checkedData.city.name) {
          // 市名
          if (this.checkedData.city.checkCity && this.checkedData.city.checkCity.name) {
            return this.checkedData.city.checkCity.name
          }
          return this.checkedData.city.name
        }
        return item.label
      }
    },

    // 省 是否被选中
    ifProvinceChecked () {
      return function (item) {
        return this.checkedData.city.id === item.id
      }
    },

    // 城市 是否被选中
    ifCityChecked () {
      return function (item) {
        return this.checkedData.city.checkCity && this.checkedData.city.checkCity.id === item.id
      }
    },

    // 下拉选项是否被选中
    ifItemChecked () {
      return function (item) {
        return item.value === this.checkedData[this.activeDrawerData].value
      }
    }

  },
  watch: {
    // 展开时数据渲染比过渡效果先一步执行，收起时过渡效果比数据渲染先一步执行
    activeDrawer (val) {
      if (val) {
        this.activeDrawerData = val
        setTimeout(() => {
          this.activeDrawerClass = val
        }, 100)
      } else {
        this.activeDrawerClass = val
        setTimeout(() => {
          this.activeDrawerData = val
        }, 300)
      }
    },

    // 根据传入的渲染map构造出选中数据的初始结构
    // 意味着每次传入新的渲染数据，之前选中数据将清空
    checkedData: {
      handler () {
        Object.keys(this.drawerData).forEach((i) => {
          Array.isArray(this.drawerData[i].group) && (this.checkedData[i] = this.drawerData[i].group[i === 'city' ? 1 : 0])
        })
      },
      immediate: true
    }

  },
  methods: {
    // 展开/关闭筛选框
    toggleDrawer (type) {
      this.activeDrawer === type && (type = '')
      this.$set(this, 'activeDrawer', type)
    },

    // 点击筛选条件
    checkGroup (item) {
      this.checkedData[this.activeDrawer] = item
      this.toggleDrawer(this.activeDrawer)
      this.changeSelect()
    },

    // 选中省
    checkProvince (item) {
      item.checkCity = {}
      this.$set(this.checkedData, 'city', item)
      this.$forceUpdate()

      const { field, city: cities, round } = this.checkedData
      this.$emit('getList', {
        investField: field.value,
        investRound: round.value,
        province: cities.id
      })

      this.$emit('checkSearchCity', this.changeIdToCode(this.checkedData.city.id))
      // 选中全国
      if (item.id === '0') {
        this.toggleDrawer()
      }
    },

    // 选中城市
    checkCity (item) {
      // 取消选中城市，回到省
      if (this.checkedData.city.checkCity === item) {
        this.checkedData.city.checkCity = {}
        this.$emit('checkSearchCity', this.changeIdToCode(this.checkedData.city.id))
      } else {
        // 选中城市
        this.checkedData.city.checkCity = item
        this.$emit('checkSearchCity', this.changeIdToCode(item.id))
      }
      this.toggleDrawer()
      this.changeSelect()
    },

    // 将行政地区id转为行政编码code
    changeIdToCode (id) {
      let code = (id + '000000').substring(0, 6)
      // 4个特殊直辖市做一下转换
      switch (code) {
        case '110100': code = '110000'; break
        case '120100': code = '120000'; break
        case '500100': code = '500000'; break
        case '310100': code = '310000'; break
        default:
      }
      return code
    },

    // 构造搜索条件，发起接口请求
    changeSelect () {
      const { field, city: cities, round } = this.checkedData
      this.$emit('getList', {
        investField: field.value,
        investRound: round.value,
        province: cities.id,
        city: cities.checkCity && cities.checkCity.id
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.org-drawer {
  color: #606266;
  z-index: 100000;

  .org-drawer-bar {
    background: #fff;
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    font-size: 13px;
    position: relative;
    z-index: 100000;

    .org-drawer-bar-item {
      height: 100%;
      width: 33%;
      .triangle-down {
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #333;
        margin-top: 2px;
        margin-left: 5px;
      }
      &.active {
        span {
          color: #1FBE49;
        }
        .triangle-down {
          transform: rotateX(180deg);
          border-top: 5px solid #1FBE49;
        }
        .ym-icon-down {
          color: #1FBE49;
          transform: rotate(-180deg);
        }
      }

      span {
        transition: all 0.3s linear;
      }

      .ym-icon-down {
        transition: all 0.3s linear;
        font-size: 12px;
        margin: 0 4px;
        transform: scale(0.8);
      }
    }
  }

  .org-drawer-board {
    z-index: 100000;
    position: absolute;
    width: 100%;
    background: #fff;
    height: auto;
    max-height: 0;
    overflow-y: auto;
    transition: all 0.4s ease;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

    &.active {
      max-height: 400px;
    }

    .org-drawer-board-group {
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      padding: 0 16px;

      &.active {
        color: #1FBE49;
      }

      &::before {
        width: calc(100% - 32px);
        content: "";
        height: 1px;
        background: #f2f2f2;
        position: absolute;
      }
    }
  }
}

.city-board {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;

  .city-board-province {
    font-size: 12px;
    border-right: 1px solid #ece7e3;
    flex: 0 0 90px;
    height: 400px;
    overflow-y: auto;
    position: relative;

    .city-board-province-label {
      width: 100%;
      height: 48px;
      padding: 0 6px;
      box-sizing: border-box;
      color: #666666;
      transition: color 0.3s;
      text-align: center;
      position: relative;

      &.active {
        color: #00c682;
      }

      &.active::before {
        content: "";
        position: absolute;
        width: 4px;
        border-radius: 4px;
        height: 16px;
        background: #00c682;
        left: 2px;
        top: 16px;
      }
    }
  }

  .city-board-group {
    padding: 4px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: space-around;

    .city-board-group-item {
      position: relative;
      width: 78px;
      height: 40px;
      background: #f7f7f7;
      border-radius: 6px;
      font-size: 12px;
      margin: 6px 0;
      color: #333333;

      &.active {
        background: #e7f8f2;
        color: #333333;

        &::after {
          content: "✓";
          display: inline-block;
          position: absolute;
          right: 0;
          top: 0;
          color: #ffffff;
          width: 16px;
          height: 16px;
          background-color: #12c287;
          text-align: center;
          border-radius: 0px 8px 0px 6px;
          font-size: 12px;
          transform: scale(0.8);
        }
      }
    }
  }
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
