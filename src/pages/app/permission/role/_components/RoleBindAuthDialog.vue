<template>
  <ym-dialog v-if="data" :visible.sync="currentVisible" title="绑定权限" :width="width">
    <div class="panel">
      <ym-tree
        v-if="currentVisible"
        ref="tree"
        node-key="controlId"
        :data="tree"
        :props="treeProps"
        default-expand-all
        show-checkbox
        @check="handleCheckChange">
      </ym-tree>
    </div>
  </ym-dialog>
</template>

<script>
import tree from '@/utils/tree'
import Dialog from '@/mixins/Dialog'

export default {
  mixins: [Dialog],
  props: {
    data: {}
  },
  data () {
    return {
      loading: false,

      tree: [],
      treeProps: {
        label: 'controlName',
        children: 'children'
      },

      controlIds: [],

      props: {
        multiple: true,
        expandTrigger: 'hover',
        value: 'controlId',
        label: 'controlName',
        emitPath: false
      }
    }
  },
  async created () {
    const list = await this.$service.app.getAuthList({ })
    this.tree = tree(list, 'fatherId', 'controlId', 'children')
  },
  methods: {
    async handleShow () {
      if (!this.data) return
      this.loading = true
      const result = await this.$service.app.getRoleBindAuthList({ entity: this.data.roleId })
      this.controlIds = result.map(item => item.controlId)
      const checkedKeys = this.controlIds.filter(id => {
        const node = this.$refs.tree.getNode(id)
        return !node.childNodes || !node.childNodes.length
      })
      this.$refs.tree.setCheckedKeys(checkedKeys)
      this.$nextTick(() => {
        this.loading = false
      })
    },

    // 选择
    async handleCheckChange (data, event) {
      if (this.loading) return

      const { checkedKeys, halfCheckedKeys } = event
      const controlIds = [...checkedKeys, ...halfCheckedKeys]
      const createIds = controlIds.filter(id => !this.controlIds.includes(id))
      const deleteIds = this.controlIds.filter(id => !controlIds.includes(id))
      this.controlIds = controlIds

      for (const id of createIds) {
        await this.$service.app.createRoleBindAuth({
          roleId: this.data.roleId,
          controlId: id
        })
      }

      for (const id of deleteIds) {
        await this.$service.app.deleteRoleBindAuth({
          roleId: this.data.roleId,
          controlId: id
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
