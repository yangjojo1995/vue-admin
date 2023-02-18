<template>
  <div class="page">
    <ym-row :gutter="24">
      <ym-col class="ym-d-none ym-d-md-block" :md="8">
        <DictionaryTreeCard
          ref="tree"
          :data="checkedData"
          @node-click="treeCheckChange"
          @load-success="treeLoadSuccess">
        </DictionaryTreeCard>
      </ym-col>
      <ym-col :sm="24" :md="16">
        <DictionaryListCard
          v-if="checkedData"
          :parent="checkedData"
          :data="cache[checkedData.dictionaryId] || []"
          @click-row="treeCheckChange"
          @save-success="handleSaveSuccess"
          @delete-success="handleDeleteSuccess"
          @back="handleBack">
        </DictionaryListCard>
      </ym-col>
    </ym-row>

  </div>
</template>

<script>
import DictionaryTreeCard from './_components/DictionaryTreeCard'
import DictionaryListCard from './_components/DictionaryListCard'
export default {
  components: { DictionaryTreeCard, DictionaryListCard },
  data () {
    return {
      checkedData: null,

      cache: {}
    }
  },
  async created () {
  },
  methods: {

    // 加载节点
    async treeLoadSuccess (data, list) {
      this.$set(this.cache, (data && data.dictionaryId) || '', list)
    },

    // 点击节点
    treeCheckChange (data) {
      this.checkedData = data
    },

    handleSaveSuccess () {
      this.$refs.tree.update()
    },

    handleDeleteSuccess () {
      this.$refs.tree.update()
    },

    // 后退
    handleBack () {
      const parent = this.$refs.tree.getCheckedDataParent(this.checkedData)
      if (parent) this.treeCheckChange(parent)
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
    color: #409EFF;
    font-weight: bold;
  }
}

</style>
