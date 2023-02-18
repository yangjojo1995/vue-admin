<template>
  <el-cascader
    ref="cascader"
    v-model="inValue"
    v-bind="$props"
    v-on="$listeners"
    :props="currentProps"
    :options="options"
  >
  </el-cascader>
</template>

<script>
export default {
  model: {
    prop: 'modelValue',
    event: 'returnModel'
  },
  props: {
    modelValue: {},
    // 1省 2市 3区县
    level: {
      type: Number,
      default: 2
    },
    // 1省禁用 2市禁用 3区县禁用
    levelDisabled: {
      type: Number,
      default: 0
    },
    // 多选
    multiple: {
      type: Boolean,
      default: true
    },
    options: {}
  },
  data () {
    return {
      defaultProps: {
        label: 'label',
        value: 'value',
        multiple: this.multiple,
        checkStrictly: true,
        children: 'children',
        lazy: true,
        lazyLoad: this.lazyLoad.bind(this)
      }
    }
  },
  computed: {
    currentProps () {
      return this.props || this.defaultProps
    },
    inValue: {
      get: function () {
        // 获取传入的v-model
        return this.modelValue
      },
      set: function (newValue) {
        // 解决：el-cascader当设置了checkStrictly:true属性时，可以选择任意一级的菜单。但是同时设置动态加载的时候。点击前面的radio按钮会出现一个暂无数据的面板
        const panelRefs = this.$refs.cascader.$refs.panel
        if (panelRefs.activePath.length !== 0) {
          panelRefs.activePath.forEach(item => {
            if (item.children.length === 0) {
              panelRefs.lazyLoad(panelRefs.getCheckedNodes()[0])
            }
          })
        }
        // 修改时同时修改v-model
        this.$emit('returnModel', newValue)
        return newValue
      }
    }
  },
  methods: {
    async lazyLoad (node, resolve) {
      const { value, level } = node
      let disable = false
      // 省
      if (level === 0) {
        if (this.levelDisabled === 1) {
          disable = true
        }

        const list = await this.$service.app.cityLevel({
          level: '1'
        })
        const result = list.map(item => {
          return {
            value: item.id,
            label: item.name,
            disabled: disable,
            leaf: level >= (this.level - 1)
          }
        })
        return resolve(result)
      } else if (level < this.level) {
        if (this.levelDisabled === this.level) {
          disable = true
        }
        const list = await this.$service.app.cityId({
          parentId: value
        })
        const result = list.map(item => {
          return {
            value: item.id,
            label: item.name,
            disabled: disable,
            leaf: level >= (this.level - 1)
          }
        })
        return resolve(result)
      } else {
        return resolve()
      }
    },
    // 解决：el-cascader当设置了checkStrictly:true属性时，可以选择任意一级的菜单。但是同时设置动态加载的时候。点击前面的radio按钮会出现一个暂无数据的面板
    handleChange (value) {
      const panelRefs = this.$refs.cascader.$refs.panel
      if (panelRefs.activePath.length !== 0) {
        panelRefs.activePath.forEach(item => {
          if (item.children.length === 0) {
            panelRefs.lazyLoad(panelRefs.getCheckedNodes()[0])
          }
        })
      }
    }
  }
}
</script>
