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
        { label: '已审核', to: '/project/libraries/view' },
        { label: '变更待审核', to: '/project/libraries/audit' }
      ]
    }
  },
  async created () {
    this.getTotal()
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
    async getTotal () {
      const result = await this.$service.project.getAuditList({
        size: 1,
        page: 1,
        statusList: ['c_check']
      })
      this.tabs[1].label = `变更待审核（${result.total}）`
    },
    isCurrentRoutePath (to) {
      return this.$route.path.indexOf(this.$router.resolve(to).route.path) === 0
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
