<template>
<div class="page">
  <el-card class="card">

    <h1 class="ym-mb-5 ym-text-center">系统初始化</h1>

    <el-steps class="ym-mb-5" :active="step" align-center>
      <el-step title="系统配置"></el-step>
      <el-step title="管理员账号"></el-step>
    </el-steps>

    <template v-if="step === 0">
      <ym-form ref="form1" key="form1" :model="form.systemInfo" class="form" :rules="rules.systemInfo.fields" label-width="120px" @submit.native.prevent>
        <ym-form-item label="系统名称" prop="name">
          <ym-input v-model.trim="form.systemInfo.name" :maxlength="20" placeholder="请输入"></ym-input>
        </ym-form-item>
        <ym-form-item label="系统域名" prop="host">
          <ym-input v-model.trim="form.systemInfo.host" :maxlength="20" placeholder="请输入"></ym-input>
        </ym-form-item>
        <ym-form-item label="系统端口" prop="prot">
          <ym-input-number v-model.trim="form.systemInfo.prot" :min="0" :max="65535" :precision="0" placeholder="请输入"></ym-input-number>
        </ym-form-item>
        <ym-form-item class="ym-text-center" label-width="0">
          <ym-button type="primary" :loading="loading" @click="handleNext">下一步</ym-button>
        </ym-form-item>
      </ym-form>
    </template>

    <template v-if="step === 1">
      <ym-form ref="form2" key="form2" :model="form.account" class="form" :rules="rules.account.fields" label-width="100px" @submit.native.prevent>
        <ym-form-item label="登录名" prop="loginName">
          <ym-input v-model.trim="form.account.loginName" :maxlength="20" placeholder="请输入"></ym-input>
        </ym-form-item>
      </ym-form>
      <ym-form ref="form3" key="form3" :model="form.accountPasswd" class="form" :rules="rules.accountPasswd.fields" label-width="100px" @submit.native.prevent>
        <ym-form-item label="登录密码" prop="loginPasswd">
          <ym-input v-model.trim="form.accountPasswd.loginPasswd" type="password" :maxlength="20" show-password placeholder="请输入"></ym-input>
        </ym-form-item>
      </ym-form>
      <ym-form ref="form4" key="form4" :model="form.account" class="form" :rules="rules.account.fields" label-width="100px" @submit.native.prevent>
        <ym-form-item label="用户姓名" prop="realName">
          <ym-input v-model.trim="form.account.realName" :maxlength="20" placeholder="请输入"></ym-input>
        </ym-form-item>
        <ym-form-item label="联系电话" prop="mobile">
          <ym-input v-model.trim="form.account.mobile" :maxlength="11" placeholder="请输入"></ym-input>
        </ym-form-item>
        <ym-form-item label="邮箱" prop="email">
          <ym-input v-model.trim="form.account.email" :maxlength="200" placeholder="请输入"></ym-input>
        </ym-form-item>
        <ym-form-item label="地址" prop="address">
          <ym-input v-model.trim="form.account.address" :maxlength="200" placeholder="请输入"></ym-input>
        </ym-form-item>
        <ym-form-item class="ym-text-center" label-width="0">
          <ym-button @click="handleBack">上一步</ym-button>
          <ym-button type="primary" :loading="loading" @click="handleSubmit">点击初始化</ym-button>
        </ym-form-item>
      </ym-form>
    </template>

  </el-card>
</div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  layout: 'empty',
  data () {
    return {
      loading: false,
      step: 0,

      form: {
        systemInfo: {
          name: '',
          host: '',
          prot: '',
          logo: ''
        },
        accountPasswd: {
          loginPasswd: ''
        },
        account: {
          realName: '',
          loginName: '',
          mobile: '',
          email: '',
          address: '',
          accountIcon: '',
          gender: 0
        }
      },
      rules: {
        systemInfo: {
          type: 'object',
          required: true,
          fields: {
            name: [
              { type: 'string', message: '请输入系统名称' },
              { min: 2, max: 20, message: '长度在 2 到 20 个字符' }
            ],
            host: [
              { type: 'string', message: '请输入系统域名' },
              { type: 'string', pattern: /^(?:https?:\/\/)?(?=.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/, message: '域名格式有误' }
            ]
          }
        },
        accountPasswd: {
          type: 'object',
          required: true,
          fields: {
            loginPasswd: [
              { type: 'string', required: true, message: '请输入登录密码' },
              { type: 'string', min: 6, max: 20, message: '登录密码必须为6到20位' },
              { type: 'string', pattern: /^[a-zA-Z0-9-_+()*&^%$#@!~?><=/.]+$/, message: '有效字符包含：数字 字母 特殊字符（- _ + ( ) * & ^ % $ # @ ! ~ ? > < = / .）' },
              { type: 'string', pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,}$/, message: '登录密码必须是由字母/数字/特殊字符其中2种组合' }
            ]
          }
        },
        account: {
          type: 'object',
          required: true,
          fields: {
            realName: [
              { type: 'string', required: true, message: '请输入姓名' },
              { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
              { required: true, pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/, message: '姓名不支持特殊字符' }
            ],
            loginName: [
              { type: 'string', required: true, message: '请输入登录账户' },
              { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
              { required: true, pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/, message: '登录账户不支持特殊字符' }
            ],
            mobile: [
              { type: 'string', pattern: /^1\d{10}$/, message: '请输入正确的手机号码' }
            ],
            email: [
              { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
              { type: 'string', pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱' }
            ]
          }
        }
      }
    }
  },
  async created () {
  },
  methods: {
    ...mapActions('user', ['login']),
    // 请求服务
    async submitService (form) {
      await this.$service.app.systemInit(form)
      await this.login({
        loginKey: form.account.loginName,
        loginPasswd: form.accountPasswd.loginPasswd
      })
    },
    // 获取 form ref
    getFormRefs () {
      const refs = []
      for (const key of Object.keys(this.$refs)) {
        if (key.startsWith('form')) {
          if (Array.isArray(this.$refs[key])) {
            refs.push(...this.$refs[key])
          } else {
            refs.push(this.$refs[key])
          }
        }
      }
      return refs
    },
    // 校验
    validate () {
      const refs = this.getFormRefs()
      return Promise.all(refs.map(ref => {
        return new Promise((resolve, reject) => {
          if (!ref) return resolve(true)
          return ref.validate(async (valid) => {
            if (!valid) return reject(valid)
            return resolve(this.form)
          })
        })
      }))
    },
    handleBack () {
      this.step--
      // 清除校验
      const refs = this.getFormRefs()
      for (const ref of refs) {
        if (ref) this.$nextTick(ref.clearValidate)
      }
    },
    // 下一步
    async handleNext () {
      await this.validate()
      this.step++
    },
    // 提交
    async handleSubmit () {
      this.loading = true
      try {
        await this.validate()
        await this.submitService(this.form)
        this.$message.success('初始化成功')
        this.$router.push('/')
      } catch (error) {
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.card {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.divider {
  display: block;
  height: 1px;
  width: 100%;
  margin: 24px 0;
  background-color: #dcdfe6;
  position: relative;
}
</style>
