export default {
  data () {
    return {
      loading: true,
      submitLoading: false,
      form: {}
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    isEdit () {
      return !!this.id
    }
  },
  async created () {
    this.loading = true
    try {
      Object.assign(this.form, await this.getDefaultFormService(this.$route.query.id))
    } catch (error) {
      console.error(error)
    }
    const refs = this.getFormRefs()
    for (const ref of refs) {
      ref && ref.clearValidate()
    }
    this.loading = false
  },
  methods: {
    // 请求服务
    async getDefaultFormService (id) {},

    // 提交服务
    async submitFormService (form) {},

    getFormRefs () {
      const refs = []
      for (const key of Object.keys(this.$refs)) {
        if (key === 'form' || key.startsWith('form-')) {
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
    validateForm () {
      const refs = this.getFormRefs()
      return Promise.all(
        refs.map(ref => {
          return new Promise((resolve, reject) => {
            if (!ref) return resolve(true)
            return ref.validate(async valid => {
              if (!valid) return reject(new Error('表单校验失败'))
              return resolve(true)
            })
          })
        })
      )
    },
    // 关闭
    handleFormClose () {
      this.$router.back()
    },
    // 提交
    async handleFormSubmit () {
      if (this.loading) return
      if (this.submitLoading) return
      this.submitLoading = true
      try {
        await this.validateForm()
        await this.submitFormService(this.form)
        this.$message.success(`${this.isEdit ? '保存' : '添加'}成功`)
        this.handleFormClose()
      } finally {
        this.submitLoading = false
      }
    }
  }
}
