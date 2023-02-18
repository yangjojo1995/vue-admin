<template>
  <ym-dialog :visible.sync="currentVisible" :title="currentTitle" :width="width">
    <ym-form ref="form" :model="form" class="form" :rules="rules" label-width="100px" @submit.native.prevent>
      <ym-form-item label="用户姓名" prop="realName">
        <ym-input v-model.trim="form.realName" :maxlength="20" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="登录名" prop="loginName">
        <ym-input v-model.trim="form.loginName" :maxlength="20" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item v-if="!isEdit" label="登录密码" prop="loginPasswd">
        <ym-input v-model="form.loginPasswd" type="password" :maxlength="20" show-password placeholder="请输入新密码"></ym-input>
      </ym-form-item>
      <ym-form-item label="头像" prop="accountIcon">
        <ym-upload-image bucket="account" v-model="form.accountIcon" fit="cover" :max-size="2 * 1048576"></ym-upload-image>
      </ym-form-item>
      <ym-form-item label="联系电话" prop="mobile">
        <ym-input v-model.trim="form.mobile" :maxlength="11" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="邮箱" prop="email">
        <ym-input v-model.trim="form.email" :maxlength="200" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="地址" prop="address">
        <ym-input v-model.trim="form.address" :maxlength="200" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="性别" prop="gender">
        <ym-radio-group v-if="genderOptions.length" v-model="form.gender">
          <ym-radio v-for="item in genderOptions" :key="item.value" :label="item.value">{{ item.label }}</ym-radio>
        </ym-radio-group>
        <span v-else>
          <span>查找不到 [性别] 字典</span>
        </span>
      </ym-form-item>
      <ym-form-item v-if="!isEdit" label="链上账号" prop="gender">
        <ym-radio-group v-model="createChainAddress">
          <ym-radio :label="true">是</ym-radio>
          <ym-radio :label="false">否</ym-radio>
        </ym-radio-group>
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
  name: 'UserDialog',
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
        address: '',
        accountIcon: '',
        gender: 0,
        loginPasswd: ''
      },
      rules: {
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
        loginPasswd: [
          { type: 'string', required: true, message: '请输入登录密码' },
          { type: 'string', min: 6, max: 20, message: '登录密码必须为6到20位' },
          { type: 'string', pattern: /^[a-zA-Z0-9-_+()*&^%$#@!~?><=/.]+$/, message: '有效字符包含：数字 字母 特殊字符（- _ + ( ) * & ^ % $ # @ ! ~ ? > < = / .）' },
          { type: 'string', pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,}$/, message: '登录密码必须是由字母/数字/特殊字符其中2种组合' }
        ],
        mobile: [
          { type: 'string', pattern: /^1\d{10}$/, message: '请输入正确的手机号码' }
        ],
        email: [
          { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
          { type: 'string', pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱' }
        ],
        accountIcon: [
          { type: 'string', message: '请上传头像' }
        ],
        gender: [
          { type: 'number', message: '请选择性别' }
        ]
      },

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
