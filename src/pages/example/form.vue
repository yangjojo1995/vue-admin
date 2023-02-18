<template>
  <ym-card class="form-page">
    <div slot="header">表单</div>
    <ym-form ref="form" :model="form" class="form" :rules="rules" label-width="120px" @submit.native.prevent>
      <ym-form-item label="输入框" prop="value1">
        <ym-input v-model="form.value1" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="选择框" prop="value2">
        <ym-select v-model="form.value2" placeholder="请选择">
          <ym-option label="选项1" value="选项1"></ym-option>
          <ym-option label="选项2" value="选项2"></ym-option>
          <ym-option label="选项3" value="选项3"></ym-option>
        </ym-select>
      </ym-form-item>
      <ym-form-item label="时间" prop="value3">
        <ym-time-select v-model="form.value3" :picker-options="{ start: '08:30', step: '00:15', end: '18:30' }" placeholder="请选择"></ym-time-select>
      </ym-form-item>
      <ym-form-item label="日期" prop="value4">
        <ym-date-picker v-model="form.value4" type="date" placeholder="请选择"></ym-date-picker>
      </ym-form-item>
      <ym-form-item label="日期时间" prop="value5">
        <ym-date-picker v-model="form.value5" type="datetime" placeholder="请选择"></ym-date-picker>
      </ym-form-item>
      <ym-form-item label="周" prop="value6">
        <ym-date-picker v-model="form.value6" type="week" format="yyyy 第 WW 周" placeholder="请选择"></ym-date-picker>
      </ym-form-item>
      <ym-form-item label="月" prop="value7">
        <ym-date-picker v-model="form.value7" type="month" placeholder="请选择"></ym-date-picker>
      </ym-form-item>
      <ym-form-item label="日期范围" prop="value8">
        <ym-date-picker v-model="form.value8" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></ym-date-picker>
      </ym-form-item>
      <ym-form-item label="月份范围" prop="value9">
        <ym-date-picker v-model="form.value9" type="monthrange" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份"></ym-date-picker>
      </ym-form-item>
      <ym-form-item label="日期时间范围" prop="value10">
        <ym-date-picker v-model="form.value10" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></ym-date-picker>
      </ym-form-item>
      <ym-form-item label="单选框" prop="value11">
        <ym-radio-group v-model="form.value11">
          <ym-radio label="选项1">选项1</ym-radio>
          <ym-radio label="选项2">选项2</ym-radio>
          <ym-radio label="选项3">选项3</ym-radio>
        </ym-radio-group>
      </ym-form-item>
      <ym-form-item label="复选框" prop="value12">
        <ym-checkbox-group v-model="form.value12">
          <ym-checkbox label="选项1">选项1</ym-checkbox>
          <ym-checkbox label="选项2">选项2</ym-checkbox>
          <ym-checkbox label="选项3">选项3</ym-checkbox>
        </ym-checkbox-group>
      </ym-form-item>
      <ym-form-item label="数字输入框" prop="value13">
        <ym-input-number v-model="form.value13" placeholder="请输入"></ym-input-number>
      </ym-form-item>
      <ym-form-item label="级联选择器" prop="value14">
        <ym-cascader v-model="form.value14" :options="cascaderOptions"></ym-cascader>
      </ym-form-item>
      <ym-form-item label="级联选择器" prop="value20">
        <ym-cascader-area v-model="form.value20" :value0.sync="form.c0" :value1.sync="form.c1" :value2.sync="form.c2" :value3.sync="form.c3"></ym-cascader-area>
      </ym-form-item>
      <ym-form-item label="开关切换" prop="value15">
        <ym-switch v-model="form.value15"></ym-switch>
      </ym-form-item>
      <ym-form-item label="滑块" prop="value16">
        <ym-slider v-model="form.value16"></ym-slider>
      </ym-form-item>
      <ym-form-item label="评分" prop="value17">
        <ym-rate v-model="form.value17"></ym-rate>
      </ym-form-item>
      <ym-form-item label="穿梭框" prop="value18">
        <ym-transfer v-model="form.value18" :data="transferData"></ym-transfer>
      </ym-form-item>
      <ym-form-item label="文本框" prop="value19">
        <ym-input v-model="form.value1" type="textarea" :autosize="{ minRows: 4 }" show-word-limit placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="文本框" prop="value19">
        <ym-tinymce v-model="form.value1" type="textarea" :autosize="{ minRows: 4 }" show-word-limit placeholder="请输入"></ym-tinymce>
      </ym-form-item>
      <ym-form-item label="图片上传" prop="value14">
        <ym-upload-image v-model="form.value14"></ym-upload-image>
      </ym-form-item>
      <ym-form-item class="ym-text-right">
        <ym-button>返回</ym-button>
        <ym-button type="primary">保存</ym-button>
      </ym-form-item>
    </ym-form>
  </ym-card>
</template>

<script>
export default {
  data () {
    return {
      form: {
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        value6: '',
        value7: '',
        value8: [],
        value9: [],
        value10: [],
        value11: '',
        value12: [],
        value13: '',
        value14: [],
        value20: [],
        c0: '',
        c1: '',
        c2: '',
        c3: '',
        value15: false,
        value16: 0
      },
      rules: {},

      cascaderOptions: this.getCascaderOptions(),

      transferData: this.getTransferData()
    }
  },
  methods: {
    getCascaderOptions () {
      return [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, {
            value: 'typography',
            label: 'Typography 字体'
          }, {
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          }, {
            value: 'input',
            label: 'Input 输入框'
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器'
          }, {
            value: 'select',
            label: 'Select 选择器'
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }, {
            value: 'switch',
            label: 'Switch 开关'
          }, {
            value: 'slider',
            label: 'Slider 滑块'
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }, {
            value: 'rate',
            label: 'Rate 评分'
          }, {
            value: 'form',
            label: 'Form 表单'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'tag',
            label: 'Tag 标签'
          }, {
            value: 'progress',
            label: 'Progress 进度条'
          }, {
            value: 'tree',
            label: 'Tree 树形控件'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告'
          }, {
            value: 'loading',
            label: 'Loading 加载'
          }, {
            value: 'message',
            label: 'Message 消息提示'
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单'
          }, {
            value: 'tabs',
            label: 'Tabs 标签页'
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          }, {
            value: 'steps',
            label: 'Steps 步骤条'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          }, {
            value: 'popover',
            label: 'Popover 弹出框'
          }, {
            value: 'card',
            label: 'Card 卡片'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }]
    },
    getTransferData () {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        })
      }
      return data
    }
  }
}
</script>

<style lang='scss' scoped>
.form-page {
  max-width: 942px !important;
}
.form {
  padding: (40px - 24px);
  .el-date-editor,
  .el-cascader,
  .el-select {
    // display: block;
    width: 100%;
  }
  .el-rate {
    margin: 14px 0;
  }
}

.form-avatar {
  display: inline-block;
  vertical-align: middle;
  width: 108px;
  height: 108px;
  line-height: 108px;
  border: 1px dashed $--ym-text-color-secondary;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 50%;
  cursor: pointer;
  &__inner {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    &__hover {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      border-radius: 50%;
      z-index: 1;
      opacity: 0;
      color: rgb(255, 255, 255);
      background-color: #161c24;
      transition: $--ym-fade-transition;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      line-height: 32px;
      i {
        font-size: 24px;
      }
    }
    &__hover:hover {
      opacity: 0.72;
    }
  }
}
</style>
