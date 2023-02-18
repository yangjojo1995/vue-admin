<template>
  <div class="upload-image-list">
    <div class="upload-image" :class="{ [`is-${node && node.status}`]: node && node.status }"  v-for="node in nodes" :key="node.key">
      <img :style="{ 'object-fit': fit }" :data-source-src="node.src" :src="node.src ? $assets(node.src, bucket) : node.base64" :alt="node.name">
      <div class="upload-image__hover">
        <i class="ym-icon-camera-solid" aria-hidden="true"></i>
        <div v-if="node && ['ready','uploading'].includes(node.status)">{{ node.percentage }}%</div>
        <div v-else>
          <i class="upload-image__icon el-icon-zoom-in" @click="handlePreview(node)"></i>
          <i class="upload-image__icon el-icon-download" @click="handleDownload(node)"></i>
          <i class="upload-image__icon el-icon-delete" @click.stop="removeNode(node)"></i>
        </div>
      </div>
    </div>
    <div v-if="enableAdd" class="upload-image" @click.stop="select()">
      <i class="upload-image__icon el-icon-plus"></i>
    </div>
  </div>
</template>

<script>
import viewer from '@/utils/viewer'
import download from '@/utils/download'
import upload from './mixins/upload'

export default {
  extends: upload,
  props: {
    bucket: {
      type: String,
      default: 'app'
    },
    // 图片模式
    fit: {
      type: String
    },
    // 是否每一次选择会清除当前的队列
    uniqueSelected: {
      type: Boolean,
      default: false
    },
    // 上传错误移除节点
    errorRemove: {
      type: Boolean,
      default: true
    },
    // 限制上传文件的后缀
    limitExt: {
      type: String,
      default: '.png,.jpg,.jpeg'
    },
    // 文件选择器的 accept 字段
    accept: {
      type: String,
      default: '.png,.jpg,.jpeg'
    },
    // 最大文件大小
    maxSize: {
      type: Number,
      default: 20 * 1048576
    }
  },
  computed: {
    enableAdd () {
      if (!this.nodes.length) return true
      if (!Array.isArray(this.value)) return false
      if (!this.limit) return true
      return this.nodes.length < (this.limit || 1)
    }
  },
  methods: {
    getBase64ByImgFile (file, callback) {
      return new Promise((resolve, reject) => {
        if (typeof FileReader !== 'function') {
          return reject(new Error('FileReader is not a function'))
        }
        const reader = new FileReader()
        reader.onload = function () {
          return resolve(this.result)
        }
        return reader.readAsDataURL(file)
      })
    },
    async addNode (node) {
      if (node.file) {
        node.base64 = await this.getBase64ByImgFile(node.file)
      }
      return upload.methods.addNode.apply(this, [node])
    },
    async handlePreview (node) {
      if (node.src) {
        const nodes = this.nodes.filter(node => node.status === 'success')
        return viewer(this.$assets(node.src, this.bucket), nodes.map(node => this.$assets(node.src, this.bucket)))
      }
    },
    async handleDownload (node) {
      return download(this.$assets(node.src, this.bucket), node.name)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-image-list {
  vertical-align: top;
  margin: 0;
  display: inline-block;
  text-align: left;
  cursor: pointer;
  outline: none;
  margin-bottom: -12px;
}

.upload-image {
  position: relative;
  display: inline-block;
  margin-right: 12px;
  margin-bottom: 12px;
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  line-height: 148px;
  cursor: pointer;
  vertical-align: top;
  text-align: center;
  overflow: hidden;
  &__icon {
    display: inline-block;
    width: 28px;
    height: 28px;
    font-size: 28px;
    color: #8c939d;
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 6px;
  }
  &__hover {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
    opacity: 0;
    border-radius: 6px;
    color: rgb(255, 255, 255);
    background-color: #161c24;
    transition: $--ym-fade-transition;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    line-height: 32px;
    .upload-image__icon {
      color: #ffffff;
    }
    i {
      font-size: 24px;
    }
  }
  &.is-ready &__hover,
  &.is-uploading &__hover,
  &__hover:hover {
    opacity: 0.72;
  }
}
</style>
