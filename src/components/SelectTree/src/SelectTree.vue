<template>
  <ym-select :value="value" :multiple="multiple" :disabled="disabled" :placeholder="placeholder" :clearable="clearable" @remove-tag="handleRemoveTag" @input="handleSelectInput">
    <ym-option v-show="false" label="_占位_" value="_占位_">
    </ym-option>
    <ym-option
      v-show="false"
      v-for="item in selectOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </ym-option>
    <component :is="'li'">
      <ym-tree
        class="ym-tree"
        :class="{ 'is-multiple': multiple }"
        ref="tree"
        :data="data"
        :node-key="props.value"
        :props="props"
        :expand-on-click-node="false"
        default-expand-all
        show-checkbox
        check-strictly
        check-on-click-node
        @check="handleTreeCheck">
      </ym-tree>
    </component>
  </ym-select>
</template>

<script>
export default {
  props: {
    value: { type: [Array, String, Number] },
    data: { type: Array },
    multiple: { type: Boolean, default: false },
    props: { type: Object, default: () => ({ label: 'label', value: 'value', children: 'children' }) },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    showAllLevels: { type: Boolean, default: false },
    placeholder: { type: String, default: '' }
  },
  data () {
    return {
      nodes: [],
      selectValue: [],
      selectOptions: []
    }
  },
  computed: {
    // 当前值
    currentValue: {
      get () { return Array.isArray(this.value) ? this.value : (this.value ? [this.value] : []) },
      set (value) { return this.$emit('input', this.multiple ? value : value[0]) }
    }
  },
  watch: {
    currentValue: {
      deep: true,
      handler (value, olbValue) {
        if (value.join('/') === olbValue.join('/')) return
        this.updateTreeCheckedKeys()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.updateTreeCheckedKeys()
    })
  },
  methods: {
    handleRemoveTag (key) {
      this.$refs.tree.setChecked(key, false, true)
      this.handleTreeCheck()
    },
    handleSelectInput (value) {
      if (!value) {
        this.currentValue = []
      }
    },
    updateTreeCheckedKeys () {
      if (!this.$refs.tree) return

      const checkedKeys = [...this.currentValue]
      const olbCheckedKeys = this.$refs.tree.getCheckedKeys()
      if (checkedKeys.join('/') === olbCheckedKeys.join('/')) return

      this.$refs.tree.setCheckedKeys(olbCheckedKeys)
      this.$refs.tree.setCheckedKeys(checkedKeys)

      this.handleTreeCheck()
    },
    // 处理单击节点
    handleTreeCheck (data) {
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      let checkedDatas = this.$refs.tree.getCheckedNodes()
      if (!data) data = checkedDatas[0]

      if (!this.multiple && data) {
        for (const key of checkedKeys) {
          this.$refs.tree.setChecked(key, false, false)
        }
        this.$refs.tree.setChecked(data, true, false)
        checkedDatas = this.$refs.tree.getCheckedNodes()
        checkedKeys = this.$refs.tree.getCheckedKeys()
      }

      this.selectOptions = ([...checkedDatas]).map(item => {
        const node = this.$refs.tree.getNode(item)
        return { label: node.label, value: node.key }
      })

      this.currentValue = [...checkedKeys]
    }
  }
}
</script>

<style lang="scss" scoped>
.ym-tree::v-deep {
  .el-tree-node__content {
    padding-right: 20px;
  }
  .el-tree-node__expand-icon {
    margin-left: 20px;
  }
  .el-checkbox {
    display: none;
  }
  &.is-multiple .el-checkbox {
    display: inline-block;
  }
  .el-tree-node.is-checked > .el-tree-node__content {
    background: none;
    .el-tree-node__label {
      color: $--ym-color-primary;
      font-weight: bold;
      &::after {
        position: absolute;
        right: 20px;
        font-family: "element-icons", sans-serif;
        content: "";
        font-size: 12px;
        font-weight: bold;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    }
  }
}
</style>
