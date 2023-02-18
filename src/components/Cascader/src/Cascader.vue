<template>
  <el-cascader
    ref="cascader"
    v-model="modelValue"
    :separator="separator"
    :filterable="filterable"
    :props="currentProps"
    :disabled="disabled"
    :options="options"
    :clearable="clearable"
    :placeholder="currentPlaceholder">
    <span slot="hide"></span>
  </el-cascader>
</template>

<script>
const syncLevel = 10
const syncProps = {}
const syncWatch = {}
for (let index = 0; index < syncLevel; index++) {
  syncProps[`value${index}`] = { type: [String, Number] }
  syncProps[`label${index}`] = { type: [String, Number] }
  syncWatch[`value${index}`] = 'watchPropValue'
}

export default {
  props: {
    value: {
      type: Array
    },
    separator: {
      type: String,
      default: ' / '
    },
    placeholder: {
      type: String
    },
    filterable: {
      type: Boolean
    },
    clearable: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    props: {
      type: Object
    },
    options: {
      type: Array
    },
    ...syncProps
  },
  data () {
    return {
      modelValue: this.getPropValue(),
      modelLabel: this.getPropLabel()
    }
  },
  computed: {
    currentProps () {
      return this.props
    },
    currentPlaceholder () {
      if (!this.modelValue || !this.modelValue.length) return this.placeholder
      if (this.modelLabel.length !== this.modelValue.length) return this.placeholder
      return this.modelLabel.join(this.separator)
    }
  },
  watch: {
    value: 'watchPropValue',
    modelValue: 'watchModelValue',
    modelLabel: 'watchModelLabel'
  },
  methods: {
    // 获取 props value
    getPropValue () {
      const value = []
      for (let index = 0; index < syncLevel; index++) {
        if (this[`value${index}`] == null || this[`value${index}`] === '') break
        value.push(this[`value${index}`])
      }
      if (value.length) return value
      return this.value || []
    },
    // 获取 props label
    getPropLabel () {
      const labelPaths = []
      for (let index = 0; index < syncLevel; index++) {
        if (typeof this[`label${index}`] !== 'string' || !this[`label${index}`]) break
        labelPaths.push(this[`label${index}`])
      }
      return labelPaths
    },
    // 获取 cascader label
    getCascaderLabel () {
      if (!this.$refs.cascader) return []
      const [selectNode] = this.$refs.cascader.getCheckedNodes()
      if (!selectNode) return []
      return selectNode.pathLabels || []
    },
    // 监听 props value 改变
    watchPropValue () {
      const value = this.getPropValue()
      if (value.toString() === this.modelValue.toString()) return

      this.modelValue = value
    },
    // 监听 model value 改变
    watchModelValue () {
      const value = this.getPropValue()
      if (value.toString() === this.modelValue.toString()) return

      // 通知更新 props value
      this.$emit('input', this.modelValue)
      for (let index = 0; index < syncLevel; index++) {
        if (this[`value${index}`] !== this.modelValue[index]) {
          this.$emit(`update:value${index}`, this.modelValue[index])
        }
      }

      // 更新 label
      const modelLabel = this.getCascaderLabel()
      if (modelLabel.toString() !== this.modelLabel.toString()) {
        this.modelLabel = modelLabel
      }

      // 兼容 表单校验
      this.$nextTick(() => {
        if (!this.$refs.cascader) return
        this.$refs.cascader.dispatch('ElFormItem', 'el.form.change', [this.modelValue])
      })

      // 这 element Bug 什么时候才能修复，麻了
      if (this.currentProps && this.currentProps.lazy) {
        this.$nextTick(() => {
          this.$refs.cascader.panel.lazyLoad()
        })
      }
    },
    // 监听 model label 改变
    watchModelLabel () {
      for (let index = 0; index < syncLevel; index++) {
        if (this[`label${index}`] !== this.modelLabel[index]) {
          this.$emit(`update:label${index}`, this.modelLabel[index])
        }
      }
    }
  }
}
</script>
