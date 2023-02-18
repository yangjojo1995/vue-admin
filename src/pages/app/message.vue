<template>
  <div>
    <ym-tabs class="tabs" v-model="tabValue">
      <template v-for="tab in tabs">
        <ym-tab-pane
          v-if="$auth(tab.to)"
          :key="tab.label"
          :label="tab.label"
          :name="tab.to">
        </ym-tab-pane>
      </template>
    </ym-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabs: [
        { label: '消息列表', to: '/app/message/list' },
        { label: '我的消息', to: '/app/message/my' }
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
