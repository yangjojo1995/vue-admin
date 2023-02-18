<template>
  <div>
    <ym-tabs class="tabs" v-model="tabValue">
      <ym-tab-pane
        v-for="tab in tabs"
        :key="tab.label"
        :label="tab.label"
        :name="tab.to">
      </ym-tab-pane>
    </ym-tabs>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tabs: [
        { label: '全部', to: '/user-manager/enterprise' },
        { label: '投资机构', to: '/user-manager/enterprise/investment-institutions' },
        { label: '企业', to: '/user-manager/enterprise/enterprise' },
        { label: '指导单位', to: '/user-manager/enterprise/observer' }
      ]
    }
  },
  computed: {
    tabValue: {
      get () {
        return this.tab && this.tab.to
      },
      set (value) {
        if (value === this.tabValue) return
        this.$router.replace(value)
      }
    },
    tab () {
      return this.tabs.find(tab => this.isCurrentRoutePath(tab.to))
    }
  },
  methods: {
    isCurrentRoutePath (to) {
      return this.$router.resolve(to).route.path === this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs::v-deep {
  .el-tabs__nav {
    margin-bottom: 15px;
  }

  .el-tabs__content {
    overflow: initial;
  }
  th.el-table__cell > .cell {
    display: flex;
    align-items: center;
  }
}
</style>
