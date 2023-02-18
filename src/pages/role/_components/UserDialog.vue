<template>
  <ym-dialog :visible.sync="currentVisible" :title="currentTitle" :width="width">
    <div class="m-hegith">
      <ym-form ref="form" :model="form" class="form" :rules="rules" label-width="100px" @submit.native.prevent>
        <ym-form-item label="姓名" prop="realName">
          <ym-input v-trim v-model="form.realName" :maxlength="20" placeholder="请输入"></ym-input>
        </ym-form-item>
        <ym-form-item label="账号" prop="loginName">
          <ym-input v-trim v-model="form.loginName" :maxlength="20" placeholder="请输入"></ym-input>
        </ym-form-item>
        <ym-form-item label="角色" prop="roles">
          <ym-select v-trim v-model="form.roles" multiple placeholder="请选择">
            <ym-option v-for="item in roleOptions" :value="item.value" :key="item.value" :label="item.label">{{ item.label }}</ym-option>
          </ym-select>
        </ym-form-item>
        <ym-form-item label="密码" prop="loginPasswd">
          <ym-input v-trim v-model="form.loginPasswd" :maxlength="20" placeholder="请输入"></ym-input>
        </ym-form-item>
      </ym-form>
    </div>
    <div slot="footer" class="ym-text-right">
      <ym-button @click="handleClose">关闭</ym-button>
      <ym-button type="primary" :loading="loading" @click="handleSubmit">{{
        isEdit ? "保存" : "添加"
      }}</ym-button>
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
      default: '用户'
    }
  },
  data () {
    return {
      loading: false,
      defaultForm: {
        realName: '',
        loginName: '',
        mobile: '',
        email: '',
        roles: ''
      },
      rules: {
        realName: [
          { type: 'string', required: true, message: '请输入姓名' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
            message: '姓名不支持特殊字符'
          }
        ],
        loginName: [
          { type: 'string', required: true, message: '请输入登录账户' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
            message: '登录账户不支持特殊字符'
          }
        ],
        loginPasswd: [
          { type: 'string', required: true, message: '请输入登录密码' },
          { type: 'string', min: 8, max: 16, message: '登录密码必须为8到16位' },
          {
            type: 'string',
            pattern: /^[a-zA-Z0-9-_+()*&^%$#@!~?><=/.]+$/,
            message:
              '有效字符包含：数字 字母 特殊字符（- _ + ( ) * & ^ % $ # @ ! ~ ? > < = / .）'
          },
          {
            type: 'string',
            pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,}$/,
            message: '登录密码必须是由字母/数字/特殊字符其中2种组合'
          }
        ],
        mobile: [
          {
            type: 'string',
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号码'
          }
        ],
        email: [
          { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
          {
            type: 'string',
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '请输入正确的邮箱'
          }
        ],
        roles: [{ required: true, message: '请选择角色', trigger: 'change' }],
        gender: [{ type: 'number', message: '请选择性别' }]
      },
      roleOptions: [],
      genderOptions: [],

      createChainAddress: true
    }
  },
  async created () {
    this.genderOptions = await this.$service.app.getDictionaryOptions('性别')
  },
  methods: {
    // 请求服务
    async submitService (form) {
      if (this.isEdit) {
        return this.$service.app.updateUser(form)
      } else {
        return this.$service.app.createUser({
          account: {
            ...form,
            loginPasswd: undefined
          },
          accountPasswd: {
            loginPasswd: this.form.loginPasswd
          },
          departmentId: [],
          createChainAddress: this.createChainAddress
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.m-hegith {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: calc(60vh - 100px);
}
</style>
