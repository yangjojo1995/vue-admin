import cloneDeep from '@/utils/cloneDeep'

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
    },
    // 默认数据
    data: {
      type: Object
    }
  },
  data () {
    return {
      loading: false,
      defaultForm: {},
      form: {}
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
    },
    isEdit () {
      return !!this.data
    },
    currentTitle () {
      return (this.isEdit ? '编辑' : '添加') + this.title
    }
  },
  watch: {
    async currentVisible () {
      if (this.currentVisible) this.handleForm()
    }
  },
  created () {
    this.handleForm()
  },
  methods: {
    // 请求服务
    async submitService (form) {},

    // 处理弹窗显示
    async handleForm () {
      // 初始默认值
      this.form = cloneDeep(Object.assign({}, this.defaultForm, this.data))
      // 清除校验
      const refs = this.getFormRefs()
      for (const ref of refs) {
        if (ref) this.$nextTick(ref.clearValidate)
      }
    },

    getFormRefs () {
      const refs = []
      for (const key of Object.keys(this.$refs)) {
        if (key.startsWith('form')) {
          if (Array.isArray(this.$refs[key])) {
            refs.push(...this.$refs[key])
          } else {
            refs.push(this.$refs[key])
          }
        }
      }
      return refs
    },

    // 校验
    validate () {
      const refs = this.getFormRefs()
      return Promise.all(
        refs.map(ref => {
          return new Promise((resolve, reject) => {
            if (!ref) return resolve(true)
            return ref.validate(async valid => {
              if (!valid) return reject(valid)
              return resolve(this.form)
            })
          })
        })
      )
    },
    // 关闭
    handleClose () {
      this.currentVisible = false
    },
    // 提交
    async handleSubmit () {
      this.loading = true
      try {
        await this.validate()
        await this.submitService(this.form)
        this.$message.success(`${this.isEdit ? '保存' : '添加'}成功`)
        this.$emit('submit-success', this.form)
        this.handleClose()
      } finally {
        this.loading = false
      }
    }
  }
}
