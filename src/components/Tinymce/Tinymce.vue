<template>
  <Editor
    class="editor"
    v-model.trim="content"
    :init="settings"
    :disabled="disabled"
    :placeholder="placeholder"
    @onInit="onInit"
  ></Editor>
</template>

<script>
import Emitter from 'element-ui/src/mixins/emitter'
import 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
import Editor from '@tinymce/tinymce-vue'

import 'tinymce/icons/default'

// advlist 高级列表插件
import 'tinymce/plugins/lists'
import 'tinymce/plugins/advlist'

// anchor 锚点插件
import 'tinymce/plugins/anchor'

// autolink 自动链接插件
import 'tinymce/plugins/autolink'

// charmap 特殊字符插件
import 'tinymce/plugins/charmap'

// fullscreen 全屏
import 'tinymce/plugins/fullscreen'

// code 源码
import 'tinymce/plugins/code'

// codesample 代码示例插件
import 'tinymce/plugins/codesample'

// help 帮助
import 'tinymce/plugins/help'

// hr 水平分割线
import 'tinymce/plugins/hr'

// image 插入编辑图片
import 'tinymce/plugins/image'

// importcss 引入css
import 'tinymce/plugins/importcss'

// nsertdatetime 插入当前日期时间
import 'tinymce/plugins/insertdatetime'

// link 链接
import 'tinymce/plugins/link'

// media 媒体
import 'tinymce/plugins/media'

// preview 预览
import 'tinymce/plugins/preview'

// searchreplace 查找替换
import 'tinymce/plugins/searchreplace'

// table 查找替换
import 'tinymce/plugins/table'

// visualblocks 显示块元素范围
import 'tinymce/plugins/visualblocks'

// visualchars 显示不可见字符
import 'tinymce/plugins/visualchars'

// wordcount 字数统计
// import 'tinymce/plugins/wordcount'

const fileUpload = async function (file, onUploadProgress) {}

function urljoin (base, ...args) {
  base = base.replace(/\/$/, '')
  return base + args.map(arg => '/' + arg.replace(/^\/|\/$/, '')).join('')
}

// const pathParse = function (path) {
//   const data = {}
//   data.path = path // 路径
//   data.path.replace(/^(((?:[a-zA-Z]):)?[\\/]?(?:[\s\S]+?[\\/])*)([\s\S]+?(\.[^.]+?)?)$/, function (all, dir, drive, name, ext) {
//     data.drive = drive || undefined // 盘符
//     data.dir = dir || undefined // 目录名
//     data.name = name || undefined // 文件名
//     data.ext = ext || undefined // 后缀
//   })
//   return data
// }

let assetsUrl = urljoin(process.env.BASE_URL, 'libs/tinymce')
if (!process.env.BASE_URL || process.env.BASE_URL === './') { assetsUrl = 'libs/tinymce' }

export const settings = {
  language_url: urljoin(assetsUrl, '/langs/zh_CN.js'),
  language: 'zh_CN',
  skin_url: urljoin(assetsUrl, '/skins/ui/oxide'),
  width: '100%',
  height: 500,
  branding: false, // 隐藏右下角技术支持
  contextmenu_never_use_native: false, // 在编辑器中屏蔽浏览器本身的右键菜单
  contextmenu:
    'bold italic strikethrough forecolor backcolor | link | removeformat', // 右键菜单
  draggable_modal: true, // 模态窗口允许拖动
  elementpath: true, // 底栏的元素路径

  plugins:
    'lists advlist anchor autolink charmap fullscreen code codesample help hr image importcss insertdatetime link media preview searchreplace table visualblocks visualchars wordcount',
  toolbar: [
    'fontsizeselect formats | bold italic strikethrough forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | bullist numlist | image media anchor link table | code preview fullscreen'
  ],
  body_class: 'markdown-body',

  menubar: 'edit insert view format table tools help',

  image_caption: true,
  image_advtab: true,
  file_picker_types: 'image',

  convert_urls: false,
  relative_urls: false,
  remove_script_host: true,

  content_css: urljoin(assetsUrl, '/css/markdown-body.css')

  // insertdatetime_formats: ["%H点%M分", "%Y年%m月%d日"],
}

export default {
  mixins: [Emitter],
  components: {
    Editor
  },

  props: {
    /** 编辑器的内容 */
    value: {
      type: String
    },
    /** 编辑器的选项 */
    init: {
      type: Object
    },
    /** 禁用 */
    disabled: {
      type: Boolean
    },
    /** 编辑器的选项 */
    placeholder: {
      type: String
    },

    // 上传方法
    upload: {
      type: Function,
      default: fileUpload
    }
  },

  data () {
    return {
      settings: {
        ...settings
      },
      editor: {

      },
      uploadOptions: {
        maxSize: 10 * 1048576
      }
    }
  },
  computed: {
    content: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
        this.dispatch('ElFormItem', 'el.form.change', [value])
      }
    }
  },
  watch: {
    init: {
      deep: true,
      immediate: true,
      handler (value) {
        Object.assign(this.settings, value || {})
      }
    }
  },
  mounted () {},
  destroyed () {},
  methods: {
    onInit (e) {
      //  获取tinymce对象 可以使用此对象调用 各种api。具体看tinymce官网
      this.editor = e.target
    },
    // 通过文件选择器选择文件
    async selectFileByFileInput (option) {
      return new Promise(resolve => {
        let $input = document.createElement('input')
        $input.type = 'file'
        $input.style.display = 'none'
        if (option.accept) $input.accept = option.accept
        document.body.appendChild($input)
        let handleSelect = files => {
          document.removeEventListener('mousemove', handleMousemove)
          $input.removeEventListener('change', handleChange)
          document.body.removeChild($input)
          $input = null
          handleChange = null
          handleMousemove = null
          handleSelect = null
          return resolve([...files])
        }
        let handleChange = () =>
          $input && handleSelect && handleSelect($input.files)
        let handleMousemove = () => handleSelect && handleSelect([])
        $input.addEventListener('change', handleChange)
        $input.click()
        document.addEventListener('mousemove', handleMousemove)
      })
    },
    async filePickerCallback (callback, value, meta) {
      // if (meta.filetype === 'image') {
      //   const files = await this.selectFileByFileInput({ accept: '.pdf,.jpg,.jpeg,.png' })
      //   const file = files[0]
      //   if (!file) return
      //   if (this.uploadOptions.maxSize && file.size > this.uploadOptions.maxSize) {
      //     return this.throwError('maxSize', '文件超出最大限制')
      //   }
      //   if (!(['.pdf', '.jpg', '.jpeg', '.png']).includes(pathParse(file.name).ext)) {
      //     return this.throwError('limitExt', '文件格式错误')
      //   }
      //   const result = await Promise.resolve(this.upload(file))
      //   return callback(result, { alt: meta })
      // }
      // return this.$alert('暂时不支持此功能！')
    },
    async imagesUploadHandler (blobInfo, success, failure) {
      const file = blobInfo.blob()
      return Promise.resolve(this.upload(file)).then(success, failure)
    },
    // 抛出错误
    async throwError (type, message) {
      if (type === 'limitExt') {
        const exts = this.limitExt
          .split(',')
          .map(item => {
            return item.substring(1)
          })
          .join('，')
        this.$message.warning(`仅支持上传 ${exts} 格式的文件！`)
      } else if (type === 'maxSize') {
        this.$message.warning(
          `文件大小必须在 ${this.formatFileSize(this.maxSize)} 以内！`
        )
      } else if (type === 'limit') {
        this.$message.warning(`最多上传 ${this.limit} 个文件！`)
      } else {
        this.$message.error(message || '选择文件出错！')
      }
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
</script>

<style>
.tox-tinymce {
  border-radius: 4px !important;
}
.edui-default {
  line-height: 1em;
}
</style>
