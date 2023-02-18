<template>
  <ym-dialog v-if="data" :visible.sync="currentVisible" title="绑定权限" :width="width">
    <div class="panel">
      <ym-tree
        v-if="currentVisible"
        ref="tree"
        node-key="departmentId"
        :data="tree"
        :props="treeProps"
        default-expand-all
        show-checkbox
        @check-change="handleCheckChange">
      </ym-tree>
    </div>
  </ym-dialog>
</template>

<script>
import tree from '@/utils/tree'
import Dialog from '@/mixins/Dialog'

export default {
  name: 'UserBindBranchDialog',
  mixins: [Dialog],
  props: {
    data: {}
  },
  data () {
    return {
      loading: false,

      tree: [],
      treeProps: {
        label: 'departmentName',
        children: 'children'
      },

      props: {
        multiple: true,
        expandTrigger: 'hover',
        value: 'departmentId',
        label: 'departmentName',
        emitPath: false
      }
    }
  },
  async created () {
    const list = await this.$service.app.getBranchList({ })
    this.tree = tree(list, 'fatherId', 'departmentId', 'children')
  },
  methods: {
    async handleShow () {
      if (!this.data) return
      this.loading = true
      const result = await this.$service.app.getUserBindBranchList({ entity: this.data.accountId })
      const departmentIds = result.map(item => item.departmentId)
      this.$refs.tree.setCheckedKeys(departmentIds)
      this.$nextTick(() => {
        this.loading = false
      })
    },

    async handleCheckChange (data, checked, indeterminate) {
      if (this.loading) return
      if (data.children && data.children.length) return
      if (checked) {
        await this.$service.app.createUserBindBranch({
          accountId: this.data.accountId,
          departmentId: data.departmentId
        })
      } else {
        await this.$service.app.deleteUserBindBranch({
          accountId: this.data.accountId,
          departmentId: data.departmentId
        })
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.panel {
  overflow: auto;
  border: 1px solid rgba(145, 158, 171, 0.4);
}
</style>
