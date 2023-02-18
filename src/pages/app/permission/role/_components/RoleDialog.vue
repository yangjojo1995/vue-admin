<template>
  <ym-dialog :visible.sync="currentVisible" :title="currentTitle" :width="width">
    <ym-form ref="form" :model="form" class="form" :rules="rules" label-width="100px" @submit.native.prevent>
      <ym-form-item label="角色名称" prop="roleName">
        <ym-input v-model.trim="form.roleName" :maxlength="255" placeholder="请输入"></ym-input>
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
      default: '角色'
    },
    parent: {
      type: Object
    }
  },
  data () {
    return {
      loading: false,
      defaultForm: {
        roleName: ''
      },
      rules: {
        roleName: [
          { type: 'string', required: true, message: '请输入角色名称' },
          { max: 255, message: '长度在最多255个字符' }
        ]
      }

    }
  },
  async created () {
  },
  methods: {
    // 请求服务
    async submitService (form) {
      form = {
        ...form,
        fatherId: form.fatherId || (this.parent && this.parent.controlId) || undefined
      }
      if (this.isEdit) {
        return this.$service.app.updateRole(form)
      } else {
        return this.$service.app.createRole(form)
      }
    }
  }
}
</script>
