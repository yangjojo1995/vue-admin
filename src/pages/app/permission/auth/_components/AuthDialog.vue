<template>
  <ym-dialog :visible.sync="currentVisible" :title="currentTitle" :width="width">
    <ym-form ref="form" :model="form" class="form" :rules="rules" label-width="100px" @submit.native.prevent>
      <ym-form-item label="权限类型" prop="controlCode">
        <ym-radio-group v-model="form.controlCode">
          <ym-radio :label="1">页面</ym-radio>
          <ym-radio :label="2">按钮</ym-radio>
          <ym-radio :label="3">接口</ym-radio>
        </ym-radio-group>
      </ym-form-item>
      <ym-form-item label="权限名称" prop="controlName">
        <ym-input v-model.trim="form.controlName" :maxlength="255" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item v-if="form.controlCode === 1" label="图标" prop="icon">
        <el-select v-model="form.controlIcon" popper-class="icon-select-popper-1627558110754" clearable placeholder="请输入图标">
          <el-option v-for="item in iconfontGlyphs" :key="item.font_class" :label="item.font_class" :value="item.font_class">
            <ym-icon :icon="item.font_class"></ym-icon>
          </el-option>
        </el-select>
      </ym-form-item>
      <ym-form-item label="权限资源" prop="controlUri">
        <ym-input v-model.trim="form.controlUri" :maxlength="255" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="排序" prop="weights">
        <ym-input-number v-model="form.weights" :max="999999999" :min="0" placeholder="请输入"></ym-input-number>
      </ym-form-item>
    </ym-form>
    <div slot="footer" class="ym-text-right">
      <ym-button @click="handleClose">关闭</ym-button>
      <ym-button type="primary" :loading="loading" @click="handleSubmit">{{ isEdit ? '保存' : '添加'}}</ym-button>
    </div>
  </ym-dialog>
</template>

<script>
import axios from 'axios'
import DialogSingleForm from '@/mixins/DialogSingleForm'

export default {
  mixins: [DialogSingleForm],
  props: {
    title: {
      type: String,
      default: '权限'
    },
    parent: {
      type: Object
    }
  },
  data () {
    return {
      loading: false,
      defaultForm: {
        controlCode: 1,
        controlName: '',
        controlIcon: '',
        controlUri: '',
        weights: ''
      },
      rules: {
        controlName: [
          { type: 'string', required: true, message: '请输入权限名称' },
          { max: 255, message: '长度在最多255个字符' }
        ],
        controlUri: [
          { type: 'string', required: true, message: '请输入权限资源' },
          { max: 255, message: '长度在最多255个字符' }
        ]
      },

      iconfontGlyphs: []
    }
  },
  async created () {
    const result = await axios.get(this.$CONFIG.ALI_ICON_JSON_URL)
    this.iconfontGlyphs = result.data.glyphs
  },
  methods: {
    // 请求服务
    async submitService (form) {
      form = {
        ...form,
        fatherId: form.fatherId || (this.parent && this.parent.controlId) || undefined
      }
      if (this.isEdit) {
        return this.$service.app.updateAuth(form)
      } else {
        return this.$service.app.createAuth(form)
      }
    }
  }
}
</script>

<style lang="scss">
.icon-select-popper-1627558110754 {
  width: 1px;
  .el-select-dropdown__list {
    // width: 1px;
    display: block;
    overflow: hidden;
    padding: 6px;
  }
  .el-select-dropdown__item {
    display: inline-block;
    width: 32px;
    height: 32px;
    padding: 0;
    line-height: 32px;
    text-align: center;
  }
}
</style>
