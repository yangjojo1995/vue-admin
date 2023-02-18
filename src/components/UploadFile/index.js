
import UploadFile from './src/UploadFile'
import UploadImage from './src/UploadImage'

UploadFile.install = function (Vue) {
  Vue.component(UploadFile.name, UploadFile)
  Vue.component(UploadImage.name, UploadImage)
}

UploadFile.UploadImage = UploadImage
export { UploadFile, UploadImage }
export default UploadFile
