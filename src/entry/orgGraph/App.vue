<template>
  <div class="org">
    <!-- 关系图 -->
    <!-- 去掉finished回调说明：finished是彻底完成图谱加载后才会执行的回调，但是其实加载到三分之一的时间左右图谱已经被渲染出来，这时候就可以对用户显示了 -->
    <org-graph :datas="graphData"  @clickHandleNode="changeRole"></org-graph>

    <!-- 加载框 -->
    <modal v-if="showModal"></modal>

    <!-- 证书 -->
    <cerModal :certificate="certificate" v-if="!showModal && certificate.roleType!==0"></cerModal>

  </div>
</template>

<script>
import orgGraph from './_components/graph-chart.vue'
import modal from './_components/modal.vue'
import cerModal from './_components/cer-modal.vue'
import NodeItem from './class/NodeItem'
import MoreItem from './class/MoreItem'
import LinkItem from './class/LinkItem'
import qs from 'qs'
const wx = window.wx

export default {
  layout: 'empty',
  components: {
    orgGraph,
    modal,
    cerModal
  },
  data () {
    return {
      id: '', // 关系人id
      position: {}, // 关系图定位
      graphData: { nodes: [], links: [] }, // 关系图数据
      showModal: true, // 遮罩
      certificate: {} // 身份认证信息
    }
  },
  created () {
    this.showModal = true
    this.initData()
    this.getGraphData()
  },
  methods: {
    // 初始化参数
    initData () {
      const query = qs.parse((window.location.search), {
        ignoreQueryPrefix: true // 忽略前方的？号
      })
      this.id = query.id
      const x = (query.width || 375) / 2
      const y = (query.height || 800) / 2
      this.position = { x, y }
    },
    // 初始化关系图数据
    async getGraphData () {
      const { data } = await this.$axios.get('/public/relationship?representativeId=' + this.id)
      this.certificate = data.sourceVo
      const nodes = []
      const links = []
      nodes.push(new NodeItem(this.id, data.sourceVo, this.position))

      data.targetVos.forEach((item) => {
        if (item.more) {
          const link = item.line[0]
          nodes.push(new MoreItem(item, link))
          links.push(new LinkItem(this.id, link.type, 0, link, 1))
        } else {
          nodes.push(new NodeItem(item.representativeId, item))
          item.line.forEach((ele, i) => {
            links.push(new LinkItem(this.id, item.representativeId, i, ele, item.line.length))
          })
        }
      })
      this.$nextTick(() => {
        this.graphData.nodes = nodes
        this.graphData.links = links
        setTimeout(() => { this.showModal = false }, 100)
      })
    },

    // 点击其他角色
    changeRole (data) {
      console.log(data)
      if (data.id_index === this.id) return

      // 角色类型0普通用户1投资经理2投资机构3企业4指导单位
      let url = ''
      switch (data.roleType || data.name) {
        case 0: break
        case 1: url = '/pages/manager/detail?id=' + encodeURIComponent(data.id_index); break
        case 2: url = '/pages/organization/detail?id=' + encodeURIComponent(data.id_index); break
        case 3: url = '/pages/company/detail?id=' + encodeURIComponent(data.id_index); break
        case 4: url = '/pages/observer/detail?id=' + encodeURIComponent(data.id_index); break
        case 'yq': url = '/pages/mine/relation-list?type=yq&id=' + this.id; break
        case 'qq': url = '/pages/mine/relation-list?type=qq&id=' + this.id; break
        case 'gk': url = '/pages/mine/relation-list?type=gk&id=' + this.id; break
        case 'gl': url = '/pages/mine/relation-list?type=gl&id=' + this.id; break
      }
      console.log(url)
      if (url) {
        wx.miniProgram.navigateTo({
          url: url
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.org {
  height: 100vh;
  width: 100%;
  background-image: url('./icon/graph-bg.png');
  background-size: 100% 100%;
}

</style>
