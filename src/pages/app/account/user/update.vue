<template>
  <div class="update-page">
    <ym-tabs class="tabs" v-model="tabValue">
      <template v-for="tab in tabs">
        <ym-tab-pane
          v-if="!tab.fn || tab.fn()"
          :key="tab.label"
          :label="tab.label"
          :name="tab.to">
        </ym-tab-pane>
      </template>
    </ym-tabs>
    <ym-card>
      <router-view></router-view>
    </ym-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      tabs: [
        { label: '基本信息', to: 'basic' },
        { label: '修改密码', to: 'password', fn: () => this.isEdit && this.isMy },
        { label: '重置密码', to: 'reset', fn: () => this.isEdit && !this.isMy }
      ]
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    tabValue: {
      get () {
        return this.tab && this.tab.to
      },
      set (value) {
        if (value === this.tabValue) return
        this.$router.replace({ path: value, query: this.$route.query })
      }
    },
    tab () {
      return this.tabs.find(tab => this.isCurrentRoutePath(tab.to))
    },
    isEdit () {
      return !!this.$route.query.id
    },
    isMy () {
      return !!(this.userInfo && this.userInfo.userId === this.$route.query.id)
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
.update-page {
  max-width: 942px !important;
  margin: auto;
}
.tabs {
  margin-bottom: 16px;
}
</style>
