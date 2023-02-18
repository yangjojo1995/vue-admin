<template>
  <ym-dialog :visible.sync="currentVisible" :title="title" :width="width">
    <ym-form ref="form" :model="form" class="form" :rules="rules" @submit.native.prevent>
      <ym-form-item prop="reason">
        <ym-input type="textarea" v-trim v-model="form.reason" placeholder=""></ym-input>
      </ym-form-item>
    </ym-form>
    <div slot="footer" class="ym-text-right">
      <ym-button @click="handleClose">关闭</ym-button>
      <ym-button type="primary" :loading="loading" @click="submits">确认</ym-button>
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
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      form: {
        reason: ''
      },
      rules: {
        reason: [
          { type: 'string', required: true, message: '请输入原因' },
          { min: 2, max: 100, message: '请输入2~100字' }
        ]
      },

      remoteLoading: false,
      userList: []
    }
  },
  computed: {
  },
  async created () {
  },
  methods: {
    // 提交
    async submits () {
      this.loading = true
      try {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$emit('submit-success', this.form)
          } else {
            return false
          }
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
