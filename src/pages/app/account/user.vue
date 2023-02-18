<template>
  <div class="user-page">
    <ym-tabs v-if="tabValue" class="tabs" v-model="tabValue">
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
        { label: '成员', to: '/app/account/user' },
        { label: '机构', to: '/app/account/user/group' }
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
