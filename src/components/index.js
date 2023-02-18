
import { uploadFile as uploadService } from '@/service/modules/app'
import assets from '@/utils/assets'

import Element from '@/plugins/element'
import Icon from './Icon'
import TableListCard from './TableListCard'
import FormFilterCard from './FormFilterCard'
import InputNumber from './InputNumber'
import Scrollbar from './Scrollbar'
import SelectTree from './SelectTree'
import DatePickerRange from './DatePickerRange'
import Image from './Image'
import TextLine from './TextLine'
import UploadFile from './UploadFile'
import RichContainer from './RichContainer'
import TinymceApplet from './TinymceApplet'
import Cascader from './Cascader'
import CascaderPanel from './CascaderPanel'
import CascaderArea from './CascaderArea'
import MulCascaderArea from './MulCascaderArea'
import exportTable from './exportTable'
import UploadFileCircle from './UploadFileCircle'
const Echarts = () => import('./Echarts' /* webpackChunkName: "Echarts" */)
const Tinymce = () => import('./Tinymce' /* webpackChunkName: "Tinymce" */).then((module) => {
  // 修改富文本图片上传方法
  module.settings.images_upload_handler = async function (blobInfo, success, failure) {
    return uploadService({ file: blobInfo.blob() }, { errorMessage: false }).then(result => success(assets(result.url)), failure)
  }
  return module
})

// 上传组件默认上传方法
UploadFile.extends.props.bucket = { type: String, default: 'bucket' }
UploadFile.extends.props.auth = { type: Boolean, default: false }
UploadFile.extends.props.urlKey.default = 'url'
UploadFile.extends.props.nameKey.default = 'originalFilename'
UploadFile.extends.props.upload.default = async function (file, onUploadProgress) {
  const result = await uploadService({ file }, { onUploadProgress, errorMessage: false })
  return result
}

function install (Vue) {
  Vue.component('ym-echarts', Echarts) // 图表
  Vue.component('ym-tinymce', Tinymce) // 富文本
  Vue.component('ym-tinymce-applet', TinymceApplet) // 富文本 小程序版本（剔除了不支持标签，例如视频标签）
  Vue.component('ym-upload-circle', UploadFileCircle)
  Vue.component('ym-icon', Icon) // 图标
  Vue.component('ym-table-list-card', TableListCard) // 表格列表
  Vue.component('ym-form-filter-card', FormFilterCard) // 头部筛选表单
  Vue.component('ym-input-number', InputNumber) // 数字输入框
  Vue.component('ym-scrollbar', Scrollbar) // 滚动条
  Vue.component('ym-select-tree', SelectTree) // 树选择器
  Vue.component('ym-image', Image) // 图片
  Vue.component('ym-text-line', TextLine) // 文本
  Vue.component('ym-upload-file', UploadFile) // 文件上传
  Vue.component('ym-upload-image', UploadFile.UploadImage) // 图片上传

  // 布局
  Vue.component('ym-row', Element.Row) // 栅格化
  Vue.component('ym-col', Element.Col) // 栅格化
  Vue.component('ym-tabs', Element.Tabs) // 标签页
  Vue.component('ym-rate', Element.Rate) // 标签页
  Vue.component('ym-page-header', Element.PageHeader) // 标签页
  Vue.component('ym-avatar', Element.Avatar) // 标签页

  Vue.component('ym-tab-pane', Element.TabPane) // 标签页
  Vue.component('ym-divider', Element.Divider) // 描述列表
  Vue.component('ym-descriptions', Element.Descriptions) // 描述列表
  Vue.component('ym-descriptions-item', Element.DescriptionsItem) // 描述列表
  Vue.component('ym-table', Element.Table) // 表格
  Vue.component('ym-table-column', Element.TableColumn) // 表格
  Vue.component('ym-popover', Element.Popover) // 弹出层
  Vue.component('ym-drawer', Element.Drawer) // 弹出层
  Vue.component('ym-card', Element.Card) // 卡片
  Vue.component('ym-tree', Element.Tree) // 树
  Vue.component('ym-pagination', Element.Pagination) // 分页
  Vue.component('ym-dialog', Element.Dialog) // 弹窗

  // 表单
  Vue.component('ym-form', Element.Form) // 表单
  Vue.component('ym-form-item', Element.FormItem) // 表单
  Vue.component('ym-checkbox-group', Element.CheckboxGroup) // 复选框
  Vue.component('ym-checkbox', Element.Checkbox) // 复选框
  Vue.component('ym-radio-group', Element.RadioGroup) // 单选框
  Vue.component('ym-radio', Element.Radio) // 单选框
  Vue.component('ym-input', Element.Input) // 输入框
  Vue.component('ym-switch', Element.Switch) // 开关
  Vue.component('ym-rate', Element.Rate) // 评分
  Vue.component('ym-transfer', Element.Transfer) // 穿梭框
  Vue.component('ym-cascader', Cascader) // 级联
  Vue.component('ym-cascader-panel', CascaderPanel) // 级联
  Vue.component('ym-cascader-area', CascaderArea) // 级联
  Vue.component('ym-mul-cascader-area', MulCascaderArea) // 级联
  Vue.component('ym-export-table', exportTable) // 级联
  Vue.component('ym-slider', Element.Slider) // 级联
  Vue.component('ym-time-select', Element.TimeSelect) // 时间选择器
  Vue.component('ym-date-picker', Element.DatePicker) // 日期时间选择器
  Vue.component('ym-date-picker-range', DatePickerRange) // 日期时间范围选择器
  Vue.component('ym-select', Element.Select) // 选择框
  Vue.component('ym-option', Element.Option) // 选择框
  Vue.component('ym-button', Element.Button) // 按钮
  Vue.component('ym-tag', Element.Tag) // 标签
  Vue.component('ym-link', Element.Link) // 链接
  Vue.component('ym-rich-container', RichContainer) // 富文本
}

export default { install }
