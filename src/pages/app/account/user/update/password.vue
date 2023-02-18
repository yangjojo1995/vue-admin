<template>
  <ym-form ref="form" :model="form" class="form" :rules="rules" label-width="100px">
    <ym-form-item label="旧密码" prop="oldPassword">
      <ym-input v-model="form.oldPassword" type="password" autocomplete="new-password" show-password placeholder="请输入旧密码"></ym-input>
    </ym-form-item>
    <ym-form-item label="新密码" prop="newPassword">
      <ym-input v-model="form.newPassword" type="password" show-password placeholder="请输入新密码"></ym-input>
    </ym-form-item>
    <ym-form-item label="确认密码" prop="confirmPassword">
      <ym-input v-model="form.confirmPassword" type="password" show-password placeholder="请输入确认密码"></ym-input>
    </ym-form-item>
    <ym-form-item class="ym-text-right">
      <ym-button type="primary" @click="handleSubmit">保存</ym-button>
    </ym-form-item>
  </ym-form>
</template>

<script>
import { mapState } from 'vuex'
import { encrypt } from '@/utils/jsencrypt'

export default {
  data () {
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { type: 'string', required: true, message: '请输入当前密码' }
        ],
        newPassword: [
          { type: 'string', required: true, message: '请输入新密码' },
          { type: 'string', min: 8, max: 20, message: '新密码必须为8到20位' },
          { type: 'string', pattern: /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[`~!@#$%^&*()\-_=+[\]{}\\|;:'",<.>/?])^.{8,20}$/, message: '新密码必须是由数字、大小写字母及特殊字符组成' }
        ],
        confirmPassword: [
          { type: 'string', required: true, message: '请输入确认密码' },
          { type: 'string', validator: (r, v, c) => this.form.newPassword === v ? c() : c(false), message: '两次输入密码不一致' }
        ]
      }
    }
  },
  computed: {
    ...mapState('user', ['userInfo'])
  },
  methods: {
    // 校验
    validate () {
      return new Promise((resolve, reject) => {
        return this.$refs.form.validate(async (valid) => {
          if (!valid) return reject(valid)
          return resolve(this.form)
        })
      })
    },
    // 提交处理
    async handleSubmit () {
      await this.validate()
      await this.$service.user.updatePassword({
        oldPassword: encrypt(this.form.oldPassword),
        newPassword: encrypt(this.form.newPassword)
      })
      this.form = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      this.$message.success('修改密码成功')
      this.$refs.form.resetFields()
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
