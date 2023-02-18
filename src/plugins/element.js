// Element 样式不需要引入，已经通过全局引入了
// import '@/assets/scss/element-variables.scss'
import Element from 'element-ui'

// 弹窗默认不可以 通过点击遮罩关闭 Dialog
// Element.Dialog.props.closeOnClickModal.default = false

// 链接默认没有下划线
Element.Link.props.underline.default = false

// 添加失去焦点去掉空格
Element.Input.props.blurTrim = { type: Boolean, default: false }
const inputCreated = Element.Input.created
Element.Input.created = function () {
  const vm = this
  vm._$emit = vm.$emit
  vm.$emit = function (name, value, ...args) {
    if (name === 'blur' && this.blurTrim) {
      vm._$emit('input', this.value.replace(/^\s+|\s+$/g, ''))
    }
    return vm._$emit(name, value, ...args)
  }
  return inputCreated.apply(vm, arguments)
}

// 全屏
Element.Dialog.props.fullscreen = { type: Element.Dialog.props.fullscreen, default () { return document.documentElement.clientWidth < 768 } }

// 树
Element.Tree.props.iconClass = { type: Element.Tree.props.iconClass, default: 'el-icon-arrow-right' }

// 表格默认排序
Element.TableColumn.props.sortOrders.default = () => ['ascending', 'descending']

// 分页默认存在背景
Element.Pagination.props.background = { type: Boolean, default: true }

// 输入框智能提示 解决报错
Element.Autocomplete.methods.handleChange = function (event) {
  if (event && event.target) return this.$emit('change', event.target.value)
  return this.$emit('change', event)
}

// 级联选择器 解决存在子级列表但是为空判断为不是子叶
const injectCascader = function () {
  const injectNode = function (Node) {
    if (Node.__isinject) return Node
    Node.__isinject = true
    Node.prototype.__initChildren = Node.prototype.initChildren
    Node.prototype.initChildren = function () {
      this.__initChildren.apply(this)
      const { config } = this
      const childrenKey = config.children
      const childrenData = this.data[childrenKey]
      if (!childrenData || !childrenData.length) this.hasChildren = false
    }
    return Node
  }

  const initStore = Element.Cascader.components.ElCascaderPanel.methods.initStore
  Element.Cascader.components.ElCascaderPanel.methods.initStore = function () {
    const result = initStore.apply(this)
    if (this.store && this.store.nodes && this.store.nodes[0]) {
      const Node = Object.getPrototypeOf(this.store.nodes[0]).constructor
      if (!Node.__isinject) {
        injectNode(Node)
        return initStore.apply(this)
      }
    }
    return result
  }
}

const injectDatePicker = function () {
  var isDate = function (date) {
    if (date === null || date === undefined) return false
    if (isNaN(new Date(date).getTime())) return false
    if (Array.isArray(date)) return false // deal with `new Date([ new Date() ]) -> new Date()`
    return true
  }

  var toDate = function toDate (date) {
    if (!isDate(date)) return null
    if (typeof date === 'string') {
      const dateArr = date.split(/[- :/]/)
      return new Date(dateArr[0], dateArr[1] - 1, dateArr[2], dateArr[3] || 0, dateArr[4] || 0, dateArr[5] || 0)
    }
    return new Date(date)
  }

  const mountPicker = Element.DatePicker.mixins[0].methods.mountPicker
  Element.DatePicker.mixins.push({
    props: {
      startDate: {
        type: [String, Number, Date]
      },
      endDate: {
        type: [String, Number, Date]
      }
    },
    watch: {
      defaultValue (val) {
        if (this.picker) {
          this.picker.defaultValue = val || this.startDate
        }
      },
      startDate (val) {
        if (this.picker) {
          this.picker.defaultValue = val || this.startDate
        }
      }
    },
    methods: {
      mountPicker (params, next) {
        mountPicker.apply(this, arguments)

        if (!this.picker) return
        if (!this.picker.defaultValue && isDate(this.startDate)) {
          this.picker.defaultValue = this.startDate
        }
        if (!this.pickerOptions || !this.pickerOptions.disabledDate) {
          this.picker.disabledDate = (date) => {
            if (isDate(this.startDate) && date < toDate(this.startDate)) return true
            if (isDate(this.endDate) && date > toDate(this.endDate)) return true
            return false
          }
        }
      }
    }
  })
}

injectCascader()
injectDatePicker()

export default Element
