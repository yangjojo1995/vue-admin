<template>
  <ym-tinymce
    v-model="currentValue"
    :disabled="disabled"
    :placeholder="placeholder"
    :upload="upload"
    :init="currentInit">
  </ym-tinymce>
</template>

<script>

export default {
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
      type: Function
    }
  },
  computed: {
    currentValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    currentInit () {
      return {
        ...(this.init || {}),
        plugins: 'lists advlist charmap fullscreen code codesample help hr image importcss insertdatetime preview searchreplace table visualblocks visualchars wordcount',
        toolbar: ['fontsizeselect formats | bold italic strikethrough forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | bullist numlist | image table | preview fullscreen']
      }
    }
  }
}
</script>
