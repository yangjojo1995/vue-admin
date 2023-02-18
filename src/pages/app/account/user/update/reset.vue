<template>
  <ym-form ref="form" class="form" label-width="100px">
    <el-alert
      class="alert-box"
      type="error"
      title="此操作无法恢复！请慎重操作！"
      show-icon
      :closable="false">
    </el-alert>
    <div class="center-box">
      <ym-button type="danger" @click="handleSubmit">重置此用户密码</ym-button>
    </div>
  </ym-form>
</template>

<script>
import { mapState } from 'vuex'
import copyText from '@/utils/copyText'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState('user', ['userInfo'])
  },
  methods: {
    async handleSubmit () {
      const result = await this.$service.app.resetUserPassword({
        id: this.$route.query.id
      })
      await this.$confirm(`账号：${result.loginName}<br />密码：${result.password}`, '重置密码成功', {
        confirmButtonText: '点击复制',
        dangerouslyUseHTMLString: true,
        type: 'success'
      })
      await copyText(`账号：${result.loginName}\n密码：${result.password}`)
      this.$message.success('复制成功')
    }
  }
}
</script>

<style lang='scss' scoped>
.form {
  padding: (40px - 24px);
}
.alert-box {
  margin-bottom: 24px;
  padding: 24px;
}
.center-box {
  text-align: center;
}
</style>
