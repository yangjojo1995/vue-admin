<template>
  <div class="org">

    <!-- 搜索 -->
    <div class="map-search" @click="goSearch"><img src="./icon/search.png" /><span>请输入搜索内容</span></div>

    <!-- 筛选 -->
    <orgDrawer ref="orgDrawer" v-if="dataReady" :drawerData="drawerMap" @checkSearchCity="handleCheckSearchCity" @getList="getList"></orgDrawer>

    <!-- 地图 -->
    <org-map ref="orgMap" :markerData="markerData" @checkOrg="handleCheckOrg" ></org-map>

    <!-- 统计 -->
    <div class="org-total" @click="goOrgList">共{{markerData.length}}家</div>

    <!-- 抽屉 -->
    <orgPanel ref="orgPanel" :panelData="panelData"></orgPanel>

    <!-- 遮罩 -->
    <orgModel ref="orgModel" :showModel="showModel" :showShadow="showShadow" @handleSubmit="handleSubmit"></orgModel>
  </div>
</template>

<script>
import tree from '@/utils/tree'
import orgPanel from './components/org-panel.vue'
import orgDrawer from './components/org-drawer.vue'
import orgMap from './components/org-map.vue'
import orgModel from './components/org-model.vue'
const wx = window.wx

export default {
  layout: 'empty',
  components: {
    orgPanel, orgDrawer, orgMap, orgModel
  },
  data () {
    return {
      // 筛选条件
      drawerMap: {
        field: { },
        city: { },
        round: { }
      },
      listParam: { province: '44' }, // 查询列表的筛选条件
      showModel: false, // 显示弹窗
      showShadow: true, // 显示遮罩
      dataReady: false,
      markerData: [], // 地图标记物
      panelData: {} // 当前标记物
    }
  },
  created () {
    this.showShadow = true
    this.initData()
  },
  methods: {
    // 初始化数据
    async initData () {
      const getCityDict = this.$axios.get('/public/region/list/level', { params: { level: 1 } }).then(async ({ data }) => {
        const { data: children } = await this.$axios.get('/public/region/list/level', { params: { level: 2 } })
        const cities = tree(data.concat(children), 'parentId', 'id')
        this.drawerMap.city = { label: '全部地区', group: [{ id: '0', name: '全国' }, ...cities] }
      })

      const getFieldDict = this.$axios.get('/front/dict-item/list', { params: { dictCode: 'invest_field' } }).then(({ data }) => {
        this.drawerMap.field = {
          label: '全部领域',
          group: [{ label: '全部领域', value: '' }, ...data.map(item => ({ value: item.itemValue, label: item.itemName }))]
        }
      })

      const getRoundDict = this.$axios.get('/front/dict-item/list', { params: { dictCode: 'invest_round' } }).then(({ data }) => {
        this.drawerMap.round = {
          label: '全部轮次',
          group: [{ label: '全部轮次', value: '' }, ...data.map(item => ({ value: item.itemValue, label: item.itemName }))]
        }
      })

      // 获取机构列表，此处后端说暂时传入分页长度为200
      const getInstitutionList = this.$axios.post('/front/invest-institution/search', { page: 1, size: 200, statues: ['accept'], ...this.listParam }).then(({ data }) => {
        this.markerData = data.records
      })

      Promise.all([getCityDict, getFieldDict, getRoundDict, getInstitutionList]).then((res) => {
        this.dataReady = true
        setTimeout(() => {
          this.showShadow = false
        }, 300)
      }).catch((err) => console.log('rejected', err))
    },

    // 获取机构数据
    async getList (param) {
      if (param && param.province === '0') {
        param.province = ''
      }
      this.listParam = param
      console.log(this.listParam)
      const { data } = await this.$axios.post('/front/invest-institution/search', { page: 1, size: 200, statues: ['accept'], ...this.listParam })
      this.markerData = data.records
    },

    // 选中地图标记点
    async handleCheckOrg (panelData) {
      const match = window.location.href.match(/token=(\S*)/)
      let token = ''
      !!match && (token = match[1])
      const { code, data } = await this.$axios.get('/front/invest-institution/info/base', { params: { id: panelData.id }, headers: { 'Dreamkey-Token': token } })
      if (code === 200) {
        this.panelData = data
        this.$refs.orgPanel.panelExpand()
      } else {
        this.showShadow = true
        this.showModel = true
      }
    },

    // 选中筛选城市
    handleCheckSearchCity (code) {
      this.$refs.orgMap.checkSearchCity(code)
    },

    // 前往机构列表页
    goOrgList () {
      if (wx) {
        const { investField, investRound, province, city } = this.listParam
        wx.miniProgram.navigateTo({
          url: `/pages/organization/org-list?investField=${investField}&investRound=${investRound}&province=${province}&city=${city}`
        })
      }
    },

    // 前往登录页
    handleSubmit () {
      if (wx) {
        wx.miniProgram.navigateTo({
          url: '/pages/login/login'
        })
      }
    },

    // 前往搜索页
    goSearch () {
      if (wx) {
        wx.miniProgram.navigateTo({
          url: '/pages/features-page/search?title=搜索投资机构&type=institution&path=/pages/organization/list'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.org{
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.map-search{
  margin: 2px 8px;
  width: auto;
  height: 40px;
  background: #F9F9F9;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-weight: 400;
  color: #C8C8C8;
  font-size: 13px;

  img{
    width: 14px;
    height: 14px;
    margin: 0 8px 0 20px;
  }
}

.org-total{
  width: 60px;
  height: 60px;
  background: #FFFFFF;
  box-shadow: 0px 2px 6px 0px rgba(62,62,62,0.26);
  border-radius: 10px;
  position: absolute;
  top: 112px;
  left: 16px;
  font-size: 13px;
  font-weight: 500;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

</style>
