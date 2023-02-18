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
        { label: '我的项目', to: '/project/my' },
        { label: '草稿箱（0）', to: '/project/my/drafts' }
      ]
    }
  },
  async created () {
    const result = await this.$service.project.draftSearch({
      size: 1,
      page: 1
    })
    this.tabs[1].label = `草稿箱（${result.total}）`
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
