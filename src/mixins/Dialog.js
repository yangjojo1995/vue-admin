export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '560px'
    },
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentVisible: {
      get () {
        return this.visible
      },
      set (value) {
        return this.$emit('update:visible', value)
      }
    }
  },
  watch: {
    async currentVisible () {
      if (this.currentVisible) this.handleShow()
    }
  },
  methods: {
    // 显示
    async handleShow () {},
    // 关闭
    handleClose () {
      this.currentVisible = false
    }
  }
}
