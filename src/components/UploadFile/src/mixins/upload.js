
import Emitter from 'element-ui/src/mixins/emitter'

const fileUpload = async function (file, onUploadProgress) {}

const getId = function () {
  var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  var result = ''
  for (var i = 0; i < 8; i++) result += str[Math.floor(Math.random() * str.length)]
  return result
}

const pathParse = function (path) {
  const data = {
    path: path, // 路径
    drive: undefined, // 盘符
    dir: undefined, // 目录名
    name: undefined, // 文件名
    ext: undefined // 后缀
  }
  data.path.replace(/^(((?:[a-zA-Z]):)?[\\/]?(?:[\s\S]+?[\\/])*)([\s\S]+?(\.[^.]+?)?)$/, function (all, dir, drive, name, ext) {
    data.drive = drive || undefined
    data.dir = dir || undefined
    data.name = name || undefined
    data.ext = ext || undefined
  })
  return data
}

export default {
  mixins: [Emitter],

  props: {
    // 绑定的值
    value: {
      type: [String, Object, Array],
      default: ''
    },
    // 完整的值
    completeValue: {
      type: Boolean,
      default: false
    },
    // 是否每一次选择会清除当前的队列
    uniqueSelected: {
      type: Boolean,
      default: false
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 移除文件提示
    removePrompt: {
      type: [Boolean, String],
      default: false
    },
    // 上传错误移除节点
    errorRemove: {
      type: Boolean,
      default: false
    },
    // 上传方法
    upload: {
      type: Function,
      default: fileUpload
    },
    // 如果 value 是对象， src值绑定的key
    urlKey: {
      type: String,
      default: 'src'
    },
    // 如果 value 是对象， name值绑定的key
    nameKey: {
      type: String,
      default: 'name'
    },
    // 限制最多上传多少个文件
    limit: {
      type: Number,
      default: 6
    },
    // 限制上传文件的后缀
    limitExt: {
      type: String
    },
    // 文件选择器的 accept 字段
    accept: {
      type: String
    },
    // 最大限制上传文件大小
    maxSize: {
      type: Number,
      default: 200 * 1048576
    }
  },
  data () {
    return {
      // 节点
      nodes: []
    }
  },
  computed: {
    multiple () {
      return Array.isArray(this.value)
    },
    // 导入数据
    importNodes () {
      return this.createNodesByValue(this.value)
    },
    // 导出值
    exportValue () {
      const nodes = this.nodes.filter(node => node.status === 'success')
      if (this.multiple) {
        return nodes.map(node => node.value)
      } else {
        return nodes[0] ? nodes[0].value : (this.completeValue ? null : '')
      }
    }
  },
  watch: {
    value () {
      this.watchValue()
    }
  },
  mounted () {
    this.watchValue()
  },
  beforeDestroy () {
  },
  methods: {
    // 检查Value
    async watchValue () {
      for (const node of this.nodes) {
        if (node.status !== 'success') continue
        const importNodeIndex = this.importNodes.findIndex(_node => _node.src && _node.src === node.src)
        if (importNodeIndex < 0) {
          this.nodes.splice(importNodeIndex, 1)
        }
      }
      for (const importNode of this.importNodes) {
        if (!importNode.src) continue
        const nodeIndex = this.nodes.findIndex(_node => _node.src && _node.src === importNode.src)
        if (nodeIndex < 0) {
          this.addNode(importNode)
        }
      }
    },
    // 通过文件选择器选择文件
    async selectFileByFileInput (options) {
      return new Promise((resolve) => {
        const stateKey = 'aa196ecc474e11ec81d30242ac130003'
        if (!window[stateKey]) {
          window[stateKey] = {
            $el: null,
            resolve: null,
            handleMount (options) {
              this.$el = document.createElement('input')
              this.$el.type = 'file'
              this.$el.style.display = 'none'
              if (options.multiple) this.$el.multiple = 'multiple'
              if (options.accept) this.$el.accept = options.accept

              this.$el.addEventListener('change', this.handleChange)
              document.body.appendChild(this.$el)
              this.$el.click()
              document.addEventListener('click', this.handleChange)
            },
            handleDestroy () {
              this.$el.removeEventListener('change', this.handleChange)
              document.removeEventListener('click', this.handleChange)
              document.body.removeChild(this.$el)

              this.$el = null
              this.resolve = null
            },
            handleChange () {
              return this.$el && this.handleSelect && this.handleSelect(this.$el.files || [])
            },
            handleSelect (files) {
              this.resolve && this.resolve([...files])
              this.handleDestroy()
            }
          }
          window[stateKey].handleChange = window[stateKey].handleChange.bind(window[stateKey])
        }

        if (window[stateKey].resolve) {
          window[stateKey].resolve([])
          window[stateKey].handleDestroy()
        }

        window[stateKey].resolve = resolve
        window[stateKey].handleMount({
          multiple: false,
          accept: undefined,
          ...options
        })
      })
    },
    // 选择文件
    async select (files) {
      if (this.disabled) return

      // 是否需要清除当前列表
      const uniqueSelected = !this.multiple || this.limit === 1 || this.uniqueSelected

      // 校验是否超出文件
      if (!uniqueSelected && this.limit && this.nodes.length >= this.limit) {
        return this.throwError('limit', '超出文件数量')
      }

      // 打开文件选择器选择文件
      if (!files) {
        files = await this.selectFileByFileInput({
          accept: this.accept,
          multiple: this.multiple
        })
      }

      // 如果取消选择，则不需要处理
      if (!files.length) return

      // 是否需要清除文件
      if (uniqueSelected) await this.removeAllNode()

      // 校验是否超出文件
      if (this.limit && (this.nodes.length + files.length) > this.limit) {
        return this.throwError('limit', '超出文件数量')
      }

      // 校验文件大小
      if (this.maxSize && files.some(file => file.size > this.maxSize)) {
        return this.throwError('maxSize', '文件超出最大限制')
      }

      // 校验文件后缀
      if (this.limitExt && !files.some(file => this.limitExt.toLowerCase().split(',').includes(pathParse(file.name).ext.toLowerCase()))) {
        return this.throwError('limitExt', '文件格式错误')
      }

      for (const file of files) {
        this.uploadFile(file)
      }
    },
    // 上传文件
    async uploadFile (file) {
      const node = this.createNodeByFile(file)
      await this.addNode(node)
    },
    // 基于文件创建节点
    createNodeByFile (file, data) {
      const urlData = pathParse(file.name)
      if (!data) data = {}
      Object.assign(data, {
        [this.urlKey]: '',
        [this.nameKey]: urlData.name
      })
      return {
        key: getId(), // 唯一ID
        added: true, // 是否添加的
        name: urlData.name, // 文件名
        ext: urlData.ext, // 后缀
        src: '', // 路径
        loaded: 0, // 进度
        percentage: 100, // 进度
        status: 'ready', // 状态 ready uploading success warning error
        file: file, // 文件对象
        data: data, // 数据
        value: this.completeValue ? data : ''
      }
    },
    // 基于链接创建节点
    createNodeByUrl (url, data) {
      const urlData = pathParse(url)
      if (!data) data = {}
      Object.assign(data, {
        [this.urlKey]: url,
        [this.nameKey]: urlData.name
      })
      return {
        key: getId(), // 唯一ID
        added: false, // 是否添加的
        name: urlData.name, // 文件名
        ext: urlData.ext, // 后缀
        src: url, // 路径
        loaded: 0, // 进度
        percentage: 100, // 进度
        status: 'success', // 状态 ready uploading success warning error
        file: null, // 文件对象
        data: data, // 数据,
        value: this.completeValue ? data : url
      }
    },
    // 基于值创建节点列表
    createNodesByValue (value) {
      if (Array.isArray(value)) {
        return value.map(val => {
          const nodes = this.createNodesByValue(val)
          return nodes && nodes[0]
        })
      } else if (value && typeof value === 'object') {
        const node = this.createNodeByUrl(value[this.urlKey], value)
        return [node]
      } else if (typeof value === 'string') {
        const node = this.createNodeByUrl(value, {})
        return [node]
      }
      return []
    },
    // 添加节点
    async addNode (node) {
      if (!node) return
      const findNode = this.nodes.find(_node => node.src && node.src === _node.src)
      if (findNode) return false

      this.nodes.push(node)

      if (node.status === 'ready' && node.file) {
        try {
          node.status = 'uploading'
          node.data = await this.upload(node.file, this.handleUploadProgress.bind(this, node))
          node.status = 'success'
          if (!node.loaded) node.loaded = node.file.size
          if (!node.percentage) node.percentage = 100
          if (typeof node.data === 'string') {
            this.$set(node, 'src', node.data)
          } else if (typeof node.data === 'object') {
            this.$set(node, 'name', node.data[this.nameKey])
            this.$set(node, 'src', node.data[this.urlKey])
          }
          this.$set(node, 'value', this.completeValue ? node.data : node.src)
        } catch (error) {
          node.status = 'error'
          this.throwError('upload', error.message)
          if (this.errorRemove) {
            this.removeNode(node, true)
          }
        }
      }
      await this.handleValueChange()
    },
    // 移除节点
    async removeNode (node, forcibly) {
      try {
        if (!forcibly && this.removePrompt) {
          const msg = typeof this.removePrompt === 'string' ? this.removePrompt : '是否删除该文件?'
          await this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        }
        const index = this.nodes.indexOf(node)
        if (index >= 0) this.nodes.splice(index, 1)
      } catch (error) {}
      await this.handleValueChange()
    },
    // 移除全部节点
    async removeAllNode () {
      const nodes = [...this.nodes]
      for (const node of nodes) {
        await this.removeNode(node)
      }
    },
    // 抛出错误
    async throwError (type, message) {
      if (type === 'limitExt') {
        const exts = this.limitExt.split(',').map(item => {
          return item.substring(1)
        }).join('，')
        this.$message.warning(`仅支持上传 ${exts} 格式的文件！`)
      } else if (type === 'maxSize') {
        this.$message.warning(`文件大小必须在 ${this.formatFileSize(this.maxSize)} 以内！`)
      } else if (type === 'limit') {
        this.$message.warning(`最多上传 ${this.limit} 个文件！`)
      } else {
        this.$message.error(message || '选择文件出错！')
      }
      this.$emit('error', type, message)
    },
    // 处理进度
    async handleUploadProgress (node, event) {
      node.loaded = ((event.loaded / event.total) || 0)
      node.percentage = node.loaded ? Number((node.loaded * 100).toFixed(2)) : 0
      this.$set(node, 'loaded', node.loaded)
      this.$set(node, 'percentage', node.percentage)
    },
    // 更改
    async handleValueChange () {
      this.$emit('input', this.exportValue)
      this.dispatch('ElFormItem', 'el.form.change', [this.exportValue])
    },
    // 格式化文件大小
    formatFileSize (value) {
      value = value || 0
      const kb = value / 1024
      if (Math.floor(kb) <= 0) return `${value}B`
      const mb = kb / 1024
      if (Math.floor(mb) <= 0) return `${kb}KB`
      const gb = mb / 1024
      if (Math.floor(gb) <= 0) return `${mb}MB`
      return `${gb}GB`
    }
  }
}
