<template>
  <ym-dialog :visible.sync="currentVisible" :title="currentTitle" :width="width">
    <ym-form ref="form" :model="form" class="form" :rules="rules" label-width="100px" @submit.native.prevent>
      <ym-form-item v-if="parent && parent.dictionaryName" label="字典名称" prop="keyword">
        <ym-input :value="parent && parent.dictionaryName" :disabled="true" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="字段名称" prop="keyword">
        <ym-input v-model.trim="form.keyword" :maxlength="255" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="字段代码" prop="options">
        <ym-input-number v-model="form.options" :max="999999999" :min="0" :precision="0" placeholder="请输入"></ym-input-number>
      </ym-form-item>
    </ym-form>
    <div slot="footer" class="ym-text-right">
      <ym-button @click="handleClose">关闭</ym-button>
      <ym-button type="primary" :loading="loading" @click="handleSubmit">{{ isEdit ? '保存' : '添加'}}</ym-button>
    </div>
  </ym-dialog>
</template>

<script>
import DialogSingleForm from '@/mixins/DialogSingleForm'

export default {
  mixins: [DialogSingleForm],
  props: {
    title: {
      type: String,
      default: '字段'
    },
    parent: {
      type: Object
    }
  },
  data () {
    return {
      loading: false,
      defaultForm: {
        dictionaryId: undefined,
        fatherId: undefined,
        dictionaryName: '',
        keyword: '',
        options: '',
        weights: 0,
        systemName: ''
      },
      rules: {
        keyword: [
          { type: 'string', required: true, message: '请输入字段名称' },
          { type: 'string', max: 255, message: '最多可输入255个字' }
        ],
        options: [
          { type: 'number', required: true, message: '请输入字段代码' },
          { type: 'number', max: 999999999, message: '最大可输入999999999' }
        ]
      }
    }
  },
  created () {

  },
  methods: {
    // 请求服务
    async submitService (form) {
      // const parentFatherId = (this.parent && this.parent.fatherId) || undefined
      const parentDictionaryId = (this.parent && this.parent.dictionaryId) || undefined
      const parentKeyword = (this.parent && this.parent.keyword) || undefined
      const parentDictionaryName = (this.parent && this.parent.dictionaryName) || undefined

      form = {
        ...form,
        dictionaryName: parentDictionaryName || form.keyword || '',
        // fatherId: form.fatherId || (parentFatherId ? form.keyword : parentDictionaryId) || undefined
        fatherId: form.fatherId || (parentDictionaryId ? parentKeyword : '') || undefined
      }
      if (this.isEdit) {
        return this.$service.app.updateDictionary(form)
      } else {
        return this.$service.app.createDictionary(form)
      }
    }
  }
}
</script>
