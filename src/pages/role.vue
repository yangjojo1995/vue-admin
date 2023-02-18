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
        { label: '员工管理', to: '/role/employee' },
        { label: '角色管理', to: '/role' }
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
.tabs {
  margin-bottom: 16px;
}
</style>
