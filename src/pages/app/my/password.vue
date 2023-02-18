<template>
<el-card>
  <ym-form ref="form" :model="form" class="form" :rules="rules" label-width="100px" @submit.native.prevent>
    <ym-form-item label="原密码" prop="oldPassword">
      <ym-input v-model="form.oldPassword" type="password" show-password placeholder="请输入原密码"></ym-input>
    </ym-form-item>
    <ym-form-item label="新密码" prop="newPassword">
      <ym-input v-model="form.newPassword" type="password" :maxlength="20" show-password placeholder="请输入新密码"></ym-input>
    </ym-form-item>
    <ym-form-item label="确认密码" prop="confirmPassword">
      <ym-input v-model="form.confirmPassword" type="password" show-password placeholder="请输入确认密码"></ym-input>
    </ym-form-item>
    <ym-form-item class="ym-text-right">
      <ym-button type="primary" @click="handleSubmit">保存</ym-button>
    </ym-form-item>
  </ym-form>
</el-card>
</template>

<script>
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
          { type: 'string', required: true, message: '请输入原密码' }
        ],
        newPassword: [
          { type: 'string', required: true, message: '请输入新密码' },
          { type: 'string', min: 6, max: 20, message: '登录密码必须为6到20位' },
          { type: 'string', pattern: /^[a-zA-Z0-9-_+()*&^%$#@!~?><=/.]+$/, message: '有效字符包含：数字 字母 特殊字符（- _ + ( ) * & ^ % $ # @ ! ~ ? > < = / .）' },
          { type: 'string', pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,}$/, message: '登录密码必须是由字母/数字/特殊字符其中2种组合' }
        ],
        confirmPassword: [
          { type: 'string', required: true, message: '请输入确认密码' },
          { type: 'string', validator: (r, v, c) => this.form.newPassword === v ? c() : c(false), message: '两次输入密码不一致' }
        ]
      }
    }
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
      await this.$service.app.updateMyPasswd({
        oldPassword: this.form.oldPassword,
        newPassword: this.form.newPassword
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
