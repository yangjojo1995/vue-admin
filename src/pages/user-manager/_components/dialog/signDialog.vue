<template>
  <ym-dialog :visible.sync="currentVisible" title="" top="10vh" width="60vw">
    <div class="contents" v-html="signContent">
    </div>
    <div slot="footer" class="ym-text-right">
      <ym-button type="primary" @click="handleClose">确认</ym-button>
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
    },
    id: {
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
      remoteLoading: false,
      userList: [],
      signContent: ''
    }
  },
  computed: {},
  async mounted () {
    this.signContent = await this.$service.manager.content({
      id: this.id
    })
  },
  methods: {
    // 提交
    async submits () {
      this.loading = true
      try {
        this.$refs.form.validate(valid => {
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
<style lang="scss" scoped>
.contents {
  overflow-y: scroll;
  height: 60vh;
}
</style>
