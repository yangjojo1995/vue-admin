<template>
  <div class="ym-uploadImage">
    <!-- element 上传图片按钮 -->
    <el-upload
      ref="upload"
      class="ym-upload-img"
      action=""
      drag
      :auto-upload="false"
      :show-file-list="false"
      :on-change="changeUpload"
      :disabled="disabled"
      accept="image/jpeg,image/jpg,image/png"
    >
      <img v-if="imageUrl" :src="$assets(imageUrl)" class="avatar" />
      <i
        v-else
        class="el-icon-plus avatar-uploaderIcon_add"
        :style="{
          'font-size': (this.uploadWidth / 4).toString() + 'px'
        }"
      ></i>
      <!-- hover -->
      <div class="avatarHover" v-if="imageUrl && imageUrl !== defaultImageUrl">
        <i
          class="el-icon-delete avatar-uploaderIcon_delete"
          :style="{
            'font-size': (this.uploadWidth / 4).toString() + 'px'
          }"
          @click="deleteImage"
        ></i>
      </div>
    </el-upload>
    <canvas id="canvas" style="display: none;"></canvas>
    <!-- 图片编辑 -->
    <el-dialog
      title="图片裁剪"
      :visible.sync="dialogVisible"
      :before-close="closeCropperModel"
      :custom-class="
        tCropWidth > 200 ? 'ym-upload-img-lcropper' : 'ym-upload-img-scropper'
      "
      append-to-body
      :close-on-click-modal="closeOnClickModal"
    >
      <div class="ym-upload-img-cropperContent">
        <div class="flexs">
          <div class="ym-uploadImage-imageArea">
            <!-- 图片裁剪 -->
            <vueCropper
              ref="cropper"
              :img="option.image"
              :autoCrop="option.autoCrop"
              :info="option.info"
              :full="option.full"
              outputType="png"
              :fixed="option.fixed"
              :fixedBox="option.fixedBox"
              :canMove="option.canMove"
              :canMoveBox="option.canMoveBox"
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
              :outputSize="option.outputSize"
              :centerBox="option.centerBox"
              :canScale="option.canScale"
              :original="option.original"
              :maxImgSize="option.maxImgSize"
              @realTime="realTime"
            >
            </vueCropper>
          </div>
          <div class="hidden-sm-and-down">
            <!-- 裁剪预览 -->
            <div>
              <div class="ym-uploadImag-prewArea">
                <div
                  class="ym-uploadImag-preview"
                  :style="{
                    width: tCropWidth + 'px',
                    height: tCropHeight + 'px'
                  }"
                  v-if="previews.url || option.image"
                >
                  <img :src="previews.url" :style="previews.img" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ym-uploadImage-uploadBtn">
          <!-- 放大 -->
          <div
            class="self-btn el-button ym-uploadImage_btn el-button--default"
            @mousedown="changeScale(1)"
            @mouseup="clearChange()"
          >
            放大
          </div>
          <!-- 缩小 -->
          <div
            class="self-btn el-button ym-uploadImage_btn el-button--default"
            @mousedown="changeScale(-1)"
            @mouseup="clearChange()"
          >
            缩小
          </div>
          <el-button
            @click="cancelUpload"
            :disabled="uploading"
            class="ym-uploadImage_btn"
            >取消</el-button
          >
          <!-- 完成 -->
          <el-button
            @click="uploadImg"
            :disabled="uploading"
            class="ym-uploadImage_btn"
            >完成</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  components: {
    VueCropper
  },
  name: 'cropper',
  model: {
    prop: 'modelValue',
    event: 'returnModel'
  },
  props: {
    modelValue: {},
    // 上传框默认图片地址
    defaultImageUrl: {
      type: String,
      default: ''
    },
    // 上传框宽度
    uploadWidth: {
      type: Number,
      default: 150
    },
    // 上传框高度
    uploadHeight: {
      type: Number,
      default: 150
    },
    // 图片上传链接
    address: {
      type: String
    },
    // 图片上传头部参数
    headers: {
      type: Object
    },
    // 上传图片文件请求体名称
    name: {
      type: String
    },
    // 上传图片所传附带参数
    fileData: {
      type: Object
    },
    // 裁剪生成图片的质量
    outputSize: {
      type: Number,
      default: 1
    },
    // 图片是否允许滚轮缩放
    canScale: {
      type: Boolean,
      default: true
    },
    // 是否输出原图比例的截图
    full: {
      type: Boolean,
      default: false
    },
    // 是否开启截图框宽高固定比例
    fixed: {
      type: Boolean,
      default: true
    },
    // 是否固定截图框大小
    fixedBox: {
      type: Boolean,
      default: true
    },
    // 上传图片是否可以移动
    canMove: {
      type: Boolean,
      default: true
    },
    // 截图框能否拖动
    canMoveBox: {
      type: Boolean,
      default: false
    },
    // 默认生成截图框宽度
    tCropWidth: {
      type: Number,
      default: 300
    },
    // 默认生成截图框高度
    tCropHeight: {
      type: Number,
      default: 300
    },
    // 是否默认生成截图框
    autoCrop: {
      type: Boolean,
      default: true
    },
    // 截图框大小信息
    info: {
      type: Boolean,
      default: true
    },
    // 是否可以通过点击modal关闭Dialog
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    // 限制上传图片大小
    dataSize: {
      type: Number,
      default: 6
    },
    // 截图框是否被限制在图片里面
    centerBox: {
      type: Boolean,
      default: false
    },
    // 上传图片按照原始比例渲染
    original: {
      type: Boolean,
      default: false
    },
    // 限制图片最大宽度和高度
    maxImgSize: {
      type: Number,
      default: 2000
    },
    // 截图是否为圆形
    circularImage: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 绑定的值
      value: {
        type: [String, Object, Array],
        default: ''
      },
      disabled: false, // 上传是否禁用
      fileList: [], // 用来存放图片（用来装饰）
      previews: {}, // 预览图片
      cropperImg: '',
      fileName: '',
      option: {
        image: '',
        outputSize: this.outputSize,
        autoCrop: this.autoCrop,
        autoCropWidth: this.tCropWidth, // 默认生成截图框宽度
        autoCropHeight: this.tCropHeight, // 默认生成截图框高度
        canMove: this.canMove,
        canMoveBox: this.canMoveBox,
        full: this.full,
        fixed: this.fixed,
        fixedBox: this.fixedBox,
        info: this.info,
        centerBox: this.centerBox,
        original: this.original,
        maxImgSize: this.maxImgSize,
        canScale: this.canScale
      },
      dialogVisible: false, // 是否弹出对话框
      uploading: false, // 上传中按钮禁用
      timer: null // 持续触发放大缩小按钮事件定时器
    }
  },
  mounted () {
    const ymNode = document.getElementsByClassName('ym-uploadImage')
    for (let i = 0; i < ymNode.length; i++) {
      ymNode[i].getElementsByClassName('el-upload-dragger')[0].style.height =
        this.uploadHeight.toString() + 'px'
      ymNode[i].getElementsByClassName('el-upload-dragger')[0].style.width =
        this.uploadWidth.toString() + 'px'
      // 若设置为圆形，加载时设置upload为圆形
      if (this.circularImage) {
        ymNode[i].getElementsByClassName(
          'el-upload--text'
        )[0].style.borderRadius = '50%'
        ymNode[i].getElementsByClassName(
          'el-upload-dragger'
        )[0].style.borderRadius = '50%'
      }
    }
  },
  computed: {
    imageUrl: {
      get: function () {
        return this.modelValue
      },
      set: function (newValue) {
        // 修改时同时修改v-model
        this.$emit('returnModel', newValue)
        return newValue
      }
    }
  },
  watch: {
    // 监听预览，同步预览截图框大小
    previews (val) {
      if (val) {
        const previewWidth = document.getElementsByClassName(
          'cropper-crop-box'
        )[0].style.width
        const previewHeight = document.getElementsByClassName(
          'cropper-crop-box'
        )[0].style.height
        if (
          parseInt(previewWidth.slice(0, previewWidth.length - 2)) > 300 ||
          parseInt(previewHeight.slice(0, previewHeight.length - 2)) > 300
        ) {
          document.getElementsByClassName(
            'ym-uploadImag-preview'
          )[0].style.width = previewWidth
          document.getElementsByClassName(
            'ym-uploadImag-preview'
          )[0].style.height = previewHeight
        }
      }
    },
    defaultImageUrl (val) {
      this.imageUrl = val
    }
  },
  methods: {
    // 上传至图片裁剪按钮   限制图片大小
    changeUpload (file, fileList) {
      this.fileName = file.name
      const isLt5M = file.size / 1024 / 1024 < this.dataSize
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过' + this.dataSize + 'MB')
        return false
      }
      this.option.image = URL.createObjectURL(file.raw)
      this.dialogVisible = true
      this.$nextTick(function () {
        this.browserRedirect()
      })
    },
    // 回显图片hover事件，删除图片
    deleteImage () {
      this.imageUrl = this.defaultImageUrl
      this.disabled = true
      this.handleValueChange()
      const that = this
      setTimeout(function () {
        that.$nextTick(function () {
          this.disabled = false
        })
      }, 50)
    },
    // 触发校验，需与el-form使用
    async handleValueChange () {
      this.$emit('input', this.imageUrl)
      this.dispatch('ElFormItem', 'el.form.change', [this.imageUrl])
    },
    dispatch (componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.componentName
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent
        if (parent) {
          name = parent.$options.componentName
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    // 放大缩小
    changeScale (num) {
      const that = this
      this.timer = setInterval(function () {
        num = num || 1
        that.$refs.cropper.changeScale(num)
      }, 50)
    },
    // 鼠标停止点击放大缩小图标，清除定时器
    clearChange () {
      clearInterval(this.timer)
    },
    // 左旋转
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },

    // 右旋转
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },

    // 上传至服务器
    uploadImg () {
      this.uploading = true
      this.$refs.cropper.getCropData(async data => {
        this.option.img = data
        let file = ''
        const formData = new FormData()
        // 圆形
        if (this.circularImage) {
          const canvas = document.querySelector('#canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = 400
          canvas.height = 400
          const image = new Image()
          image.setAttribute('crossOrigin', 'Anonymous')
          image.src = this.option.img
          image.onload = async () => {
            ctx.arc(200, 200, 200, 0, 180 * 2)
            ctx.clip()
            ctx.drawImage(image, 0, 0, 400, 400)
            ctx.fillStyle = 'transparent'
            ctx.fill()
            ctx.save()
            file = this.convertBase64UrlToBlob(canvas.toDataURL('image/png'))

            if (this.fileData) {
              for (let i = 0; i < Object.keys(this.fileData).length; i++) {
                formData.append(
                  Object.keys(this.fileData)[i],
                  Object.values(this.fileData)[i]
                )
              }
            }
            formData.append(this.name, file)
            try {
              const result = await this.$service.app.uploadFile(formData)
              if (result) {
                this.imageUrl = result.url
                this.$message({
                  message: '上传成功',
                  type: 'success'
                })
                this.dialogVisible = false
                this.uploading = false
                // 触发校验，需与el-form使用
                this.handleValueChange()
                if (
                  this.imageUrl &&
                  !this.dialogVisible &&
                  this.circularImage
                ) {
                  document.getElementsByClassName(
                    'avatar'
                  )[0].style.borderRadius = '50%'
                  document
                    .getElementsByClassName('ym-uploadImage')[0]
                    .getElementsByClassName(
                      'avatarHover'
                    )[0].style.borderRadius = '50%'
                  debugger
                }
              }
            } catch (error) {
              console.log(error)
              this.$message({
                message: '上传失败',
                type: 'error'
              })
              this.uploading = false
            }
          }
        } else {
          file = this.convertBase64UrlToBlob(data)
          formData.append(this.name, file)
          if (this.fileData) {
            for (let i = 0; i < Object.keys(this.fileData).length; i++) {
              formData.append(
                Object.keys(this.fileData)[i],
                Object.values(this.fileData)[i]
              )
            }
          }
          try {
            const result = await this.$service.app.uploadFile(formData)
            if (result) {
              this.imageUrl = result.url
              this.$message({
                message: '上传成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.uploading = false
              // 触发校验，需与el-form使用
              this.handleValueChange()
            }
          } catch (error) {
            console.log(error)
            this.$message({
              message: '上传失败',
              type: 'error'
            })
            this.uploading = false
          }
        }
      })
    },

    // 取消上传
    cancelUpload () {
      this.option = {
        image: '',
        outputSize: this.outputSize,
        autoCrop: this.autoCrop,
        autoCropWidth: this.tCropWidth,
        autoCropHeight: this.tCropHeight,
        canMove: this.canMove,
        canMoveBox: this.canMoveBox,
        full: this.full,
        fixed: this.fixed,
        fixedBox: this.fixedBox,
        info: this.info,
        centerBox: this.centerBox,
        original: this.original,
        maxImgSize: this.maxImgSize,
        canScale: this.canScale
      }
      this.previews = {}
      this.dialogVisible = false
    },

    // 预览
    realTime (data) {
      this.previews = {
        ...data
      }
      if (this.circularImage) {
        const ymNode1 = document.getElementsByClassName(
          'cropper-view-box'
        )
        const ymNode2 = document.getElementsByClassName(
          'cropper-face cropper-move'
        )
        const ymNode3 = document.getElementsByClassName(
          'ym-uploadImag-preview'
        )
        for (let i = 0; i < ymNode1.length; i++) {
          ymNode1[i].style.borderRadius = '50%'
          ymNode2[i].style.borderRadius = '50%'
          ymNode3[i].style.borderRadius = '50%'
        }
      }
    },

    // 将base64的图片转换为file文件
    convertBase64UrlToBlob (dataurl) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let len = bstr.length
      const u8arr = new Uint8Array(len)
      while (len--) {
        u8arr[len] = bstr.charCodeAt(len)
      }
      return new File([u8arr], `${this.fileName}`, { type: mime })
    },

    // 关闭弹窗之前
    closeCropperModel (done) {
      this.option = {
        image: '',
        outputSize: this.outputSize,
        autoCrop: this.autoCrop,
        autoCropWidth: this.tCropWidth,
        autoCropHeight: this.tCropHeight,
        canMove: this.canMove,
        canMoveBox: this.canMoveBox,
        full: this.full,
        fixed: this.fixed,
        fixedBox: this.fixedBox,
        info: this.info,
        centerBox: this.centerBox,
        original: this.original,
        maxImgSize: this.maxImgSize,
        canScale: this.canScale
      }
      this.previews = {}
      done()
    },
    // 判断当前设备类型
    browserRedirect () {
      const sUserAgent = navigator.userAgent.toLowerCase()
      const bIsIpad = sUserAgent.match(/ipad/i)
      const bIsIphoneOs = sUserAgent.match(/iphone os/i)
      const bIsMidp = sUserAgent.match(/midp/i)
      const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i)
      const bIsUc = sUserAgent.match(/ucweb/i)
      const bIsAndroid = sUserAgent.match(/android/i)
      const bIsCE = sUserAgent.match(/windows ce/i)
      const bIsWM = sUserAgent.match(/windows mobile/i)
      const device =
        bIsIpad ||
        bIsIphoneOs ||
        bIsMidp ||
        bIsUc7 ||
        bIsUc ||
        bIsAndroid ||
        bIsCE ||
        bIsWM
      const deviceArray = [
        'ipad',
        'iphone os',
        'midp',
        'rv:1.2.3.4',
        'ucweb',
        'android',
        'windows ce',
        'windows mobile'
      ]
      if (device !== null) {
        if (deviceArray.indexOf(device[0]) !== -1) {
          document.getElementsByClassName(
            'ym-upload-img-scale'
          )[0].style.display = 'none'
        }
      }
    }
  }
}
</script>

<style lang="scss">
.ym-uploadImage {
  .ym-upload-img {
    display: flex;
    position: relative;
    .el-upload--text {
      cursor: auto;
    }
    .el-upload-dragger {
      &:hover .avatarHover {
        // transition: $--all-transition;
        opacity: 0.8;
        .avatar-uploaderIcon_delete {
          opacity: 0.6;
          cursor: pointer;
          &:hover {
            opacity: 1;
          }
        }
      }
    }
    .avatarHover {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      z-index: 1;
      opacity: 0;
      border-radius: 6px;
      color: white;
      background-color: #161c24;
      transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      line-height: 32px;
    }
    .avatar {
      width: 100%;
      height: 100%;
      margin-top: 0;
    }
    .avatar-uploaderIcon_add {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 auto;
      transform: translate(-50%, -50%);
      font-size: 30px;
      // color: $--icon-color;
    }
    .avatar-uploaderIcon_delete {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0 auto;
      font-size: 24px;
      opacity: 0;
      // color:$--color-white;
    }
  }
}
.ym-uploadImage-imageArea {
  margin-right: 15px;
  .ym-upload-img_edit {
    display: flex;
    position: relative;
    justify-content: flex-end;
    margin-right: 26px;
    bottom: 36px;
    .ym-upload-img_editBtn {
      font-size: 26px;
      margin-left: 3px;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
.ym-uploadImage-uploadBtn {
  margin-top: 15px;
  display: flex;
  position: relative;
  justify-content: flex-end;
  .ym-uploadImage_btn {
    // font-size:$--font-size-base;
    width: 96px;
    height: 32px;
    padding: 0;
  }
  .self-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.ym-upload-img-lcropper {
  &.el-dialog {
    width: fit-content;
    .el-dialog__body {
      padding-top: 0;
    }
    .ym-upload-img-cropperContent {
      .flexs {
        display: flex;
      }
      .vue-cropper {
        width: 400px;
        height: 400px;
        .cropper-crop-box {
          width: 400px;
          height: 400px;
        }
      }
      .ym-uploadImag-prewArea {
        flex: 1;
        -webkit-flex: 1;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        -webkit-justify-content: center;
        align-items: center;
        overflow: hidden;
        .ym-uploadImag-preview {
          overflow: hidden;
          border: 1px solid #f2f2f2;
        }
      }
    }
  }
}
.ym-upload-img-scropper {
  &.el-dialog {
    width: fit-content;
    .el-dialog__body {
      padding-top: 0;
    }
    .ym-upload-img-cropperContent {
      .flexs {
        display: flex;
      }
      .vue-cropper {
        width: 350px;
        height: 350px;
        .cropper-crop-box {
          width: 200px;
          height: 200px;
        }
      }
      .ym-uploadImag-prewArea {
        flex: 1;
        -webkit-flex: 1;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        -webkit-justify-content: center;
        .ym-uploadImag-preview {
          border: 1px solid #f2f2f2;
          overflow: hidden;
        }
      }
    }
  }
}
// @media screen and (max-width: 360px) {
//   .ym-uploadImage-imageArea {
//     width: 100%;
//     overflow: hidden;
//     .ym-upload-img_edit {
//       margin-right: 20px;
//     }
//     .ym-uploadImage-uploadBtn {
//       margin-right: 0px;
//     }
//   }
//   .ym-upload-img-lcropper {
//     &.el-dialog {
//       width: 100%;
//     }
//   }
// }
// @media screen and (min-width: 361px) and (max-width: 991px) {
//   .ym-uploadImage-imageArea {
//     width: 100%;
//     .ym-upload-img_edit {
//       margin-right: 15px;
//     }
//     .ym-uploadImage-uploadBtn {
//       margin-right: 0px;
//     }
//   }
//   .ym-upload-img-lcropper {
//     &.el-dialog {
//       width: 360px;
//     }
//   }
// }
// @media screen and (min-width: 992px) {
//   .ym-upload-img-lcropper {
//     &.el-dialog {
//       width: 545px;
//     }
//   }
// }
</style>
