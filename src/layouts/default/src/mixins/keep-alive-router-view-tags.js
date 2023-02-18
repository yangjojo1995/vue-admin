
export default {
  data () {
    return {
      viewTags: []
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler () {
        if (this.$route.matched && this.$route.matched.length && this.$route.fullPath) {
          const has = this.viewTags.some(tag => tag.fullPath === this.$route.fullPath)
          if (!has) {
            const rootRouteOptions = this.$route.matched[0]
            const routeOptions = this.$route.matched[this.$route.matched.length - 1]
            this.$nextTick(() => {
              this.viewTags.push({
                name: this.$route.meta.title,
                fullPath: this.$route.fullPath,
                rootInstance: rootRouteOptions.instances.default,
                instance: routeOptions.instances.default
              })
            })
          }
        }
      }
    }
  },
  created () {
    // 如果是 this.$router.replace 不创建视图标签
    if (!this.$router.replace._inject) {
      const _replace = this.$router.replace
      const replace = function (location, onComplete, onAbort) {
        const vm = replace._injectVm
        return vm.removeViewTag(vm.getCurrentViewTag(), (next) => {
          return _replace.call(this, location, function () {
            next && next()
            return onComplete && onComplete.apply(this, arguments)
          }, onAbort)
        })
      }
      replace._inject = true
      replace._injectVm = this
      this.$router.replace = replace
    }
    this.$router.replace._injectVm = this

    // 如果是 this.$router.back 关闭标签
    if (!this.$router.back._inject) {
      const _back = this.$router.back
      const back = function () {
        const vm = back._injectVm
        return vm.removeViewTag(vm.getCurrentViewTag(), (next) => {
          _back.apply(this)
          return next && next()
        })
      }
      back._inject = true
      back._injectVm = this
      this.$router.back = back
    }
    this.$router.back._injectVm = this
  },
  methods: {
    // 切换视图标签
    toViewTag (tag) {
      if (this.getViewTagActive(tag)) return
      return this.$router.push(tag.fullPath)
    },
    // 删除视图标签
    removeViewTag (tag, middleware) {
      // 获取下标
      const index = this.viewTags.indexOf(tag)
      if (index < 0) return

      // 中间件
      if (!middleware) {
        if (this.viewTags.length === 1) {
          middleware = this.$router.push.bind(this.$router, '/')
        } else if (this.getViewTagActive(tag)) {
          if (index === 0) {
            middleware = this.$router.push.bind(this.$router, this.viewTags[1].fullPath)
          } else {
            middleware = this.$router.push.bind(this.$router, this.viewTags[index - 1].fullPath)
          }
        } else {
          middleware = (next) => next()
        }
      }

      return middleware(() => {
        this.viewTags.splice(index, 1)
        this.$nextTick(() => this.removeViewTagCache(tag))
      })
    },
    removeRightViewTag () {
      const tag = this.getCurrentViewTag()
      const index = this.viewTags.indexOf(tag)
      if (index < 0) return

      const viewTags = this.viewTags.filter((_, i) => i > index)
      for (const tag2 of viewTags) {
        this.removeViewTag(tag2)
      }
    },
    removeOtherViewTag () {
      const viewTags = [...this.viewTags]
      for (const tag of viewTags) {
        if (!this.getViewTagActive(tag)) {
          this.removeViewTag(tag)
        }
      }
    },
    removeAllViewTag () {
      this.removeOtherViewTag()
      this.removeViewTag(this.getCurrentViewTag())
    },
    // 获取视图标签
    getCurrentViewTag () {
      return this.viewTags.find(tag => this.$route.fullPath === tag.fullPath)
    },
    // 获取视图标签是否激活状态
    getViewTagActive (tag) {
      return this.getCurrentViewTag() === tag
    },
    // 删除视图标签缓存
    removeViewTagCache (tag) {
      let instance = tag.rootInstance
      let flag = 0
      while (!flag && instance.$vnode.parent) {
        const keys = instance.$vnode.parent.componentInstance.keys
        const cache = instance.$vnode.parent.componentInstance.cache
        const key = instance.$vnode.key
        if (key && cache && cache[key]) {
          delete cache[key]
          const index = keys.indexOf(key)
          if (index > -1) keys.splice(index, 1)
          flag = 1
        }
        instance = instance.$vnode.parent.componentInstance
      }
    }
  }
}
