<template>
  <ym-card :body-style="{ padding: '12px 0px' }">
    <ym-tree
      ref="tree"
      node-key="dictionaryId"
      :props="treeProps"
      :load="treeLoadNode"
      :lazy="true"
      :default-expanded-keys="['']"
      :expand-on-click-node="false"
      :auto-expand-parent="true"
      @node-click="treeNodeClick">
      <span class="custom-tree-node" :class="{ 'is-checked': checkedData && checkedData.dictionaryId === data.dictionaryId }" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
      </span>
    </ym-tree>
  </ym-card>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      treeProps: {
        label: 'keyword',
        children: 'children',
        isLeaf: 'leaf'
      },
      checkedData: this.data || null
    }
  },
  watch: {
    data () {
      this.checkedData = this.data
    },
    checkedData () {
      this.$emit('update:data', this.checkedData)
      this.update()
    }
  },
  methods: {
    // 加载节点
    async treeLoadNode (node, resolve) {
      let list
      if (node.level === 0) {
        const data = { dictionaryId: '', dictionaryName: '', keyword: '字典', options: null }
        list = [data]
        this.$nextTick(() => this.treeNodeClick(data))
      } else {
        list = await this.$service.app.getDictionaryList({
          dictionaryName: node.data.dictionaryName,
          fatherId: node.data.dictionaryId ? node.data.keyword : ''
        })
      }
      this.$emit('load-success', node.data, list)
      return resolve(list || [])
    },
    // 点击节点
    treeNodeClick (data) {
      this.checkedData = data
      this.$refs.tree.setChecked(data.dictionaryId)
      this.$emit('node-click', data)
    },
    // 获取节点父数据
    getCheckedDataParent () {
      if (!this.checkedData) return null
      const node = this.$refs.tree.getNode(this.checkedData)
      if (node && node.parent && node.parent.data) {
        return node.parent.data
      }
      return null
    },
    // 更新
    update () {
      if (!this.$refs.tree && this.checkedData) return
      const node = this.$refs.tree.getNode(this.checkedData)
      if (!node) return
      this.treeLoadNode(node, (list) => {
        node.data.children = (list || []).filter(item => item.fatherId === this.checkedData.dictionaryId)
        this.$refs.tree.updateKeyChildren(this.checkedData.dictionaryId, node.data.children)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 16px;
  line-height: 24px;
  height: 24px;
  overflow: hidden;
  &.is-checked {
    color: #00BA75;
    font-weight: bold;
  }
}

</style>
