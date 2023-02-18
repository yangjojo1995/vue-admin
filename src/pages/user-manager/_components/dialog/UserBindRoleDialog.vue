<template>
  <ym-dialog v-if="data" :visible.sync="currentVisible" title="绑定角色" :width="width">
    <div class="panel">
      <ym-tree
        v-if="currentVisible"
        ref="tree"
        node-key="roleId"
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
import Dialog from '@/mixins/Dialog'

export default {
  name: 'UserBindRoleDialog',
  mixins: [Dialog],
  props: {
    data: {}
  },
  data () {
    return {
      loading: false,

      tree: [],
      treeProps: {
        label: 'roleName',
        children: 'children'
      },

      props: {
        multiple: true,
        expandTrigger: 'hover',
        value: 'roleId',
        label: 'roleName',
        emitPath: false
      }
    }
  },
  async created () {
    const list = await this.$service.app.getRoleList({ })
    this.tree = list
  },
  methods: {
    async handleShow () {
      if (!this.data) return
      this.loading = true
      const result = await this.$service.app.getRoleBindList({ entity: this.data.accountId })
      const roleIds = result.map(item => item.roleId)
      this.$refs.tree.setCheckedKeys(roleIds)
      this.$nextTick(() => {
        this.loading = false
      })
    },

    async handleCheckChange (data, checked, indeterminate) {
      if (this.loading) return
      if (data.children && data.children.length) return
      if (checked) {
        await this.$service.app.createRoleBind({
          bindId: this.data.accountId,
          roleId: data.roleId
        })
      } else {
        await this.$service.app.deleteRoleBind({
          bindId: this.data.accountId,
          roleId: data.roleId
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
