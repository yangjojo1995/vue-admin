<template>
  <YmLogin :options='options' :news="news" :system="system"></YmLogin>
</template>

<script>
import YmLogin from './Login'
import { mapState, mapActions } from 'vuex'

export default {
  components: { YmLogin },
  data () {
    return {
      system: {
        name: '欢迎来到',
        title: this.appTitle
      },
      news: [
        { title: '系统尚未初始化，请设置超级管理员账号' }
      ],
      options: {
        // 账号栏配置,不传入则采用默认账号栏配置
        companyName: {
          // 账号栏label名,显示在输入框上方
          // label: '用户',
          // 账号栏左侧图标,需要formStyle为icon
          icon: 'el-icon-house',
          // 账号输入框表单校验正则,作为登录操作以及第一次点击登录后的校验依据
          placeholder: '请输入公司简称',
          clearable: true,
          // 校验规则
          rules: [
            { required: true, message: '请输入公司简称', trigger: 'change' },
            { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'change' }
          ]
        },
        userName: {
          // 账号栏label名,显示在输入框上方
          // label: '用户',
          // 账号栏左侧图标,需要formStyle为icon
          icon: 'el-icon-user',
          // 账号输入框表单校验正则,作为登录操作以及第一次点击登录后的校验依据
          placeholder: '请输入姓名',
          clearable: true,
          // 校验规则
          rules: [
            { required: true, message: '请输入姓名', trigger: 'change' },
            { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'change' }
          ]
        },
        phone: {
          // 账号栏label名,显示在输入框上方
          // label: '用户',
          // 账号栏左侧图标,需要formStyle为icon
          icon: 'el-icon-user',
          // 账号输入框表单校验正则,作为登录操作以及第一次点击登录后的校验依据
          placeholder: '请输入手机号',
          clearable: true,
          // 校验规则
          rules: [
            // { required: true, message: '请输入手机号', trigger: 'change' },
            { type: 'string', pattern: /^1\d{10}$/, message: '请输入正确的手机号码', trigger: 'change' }
          ]
        },
        loginName: {
          // 账号栏label名,显示在输入框上方
          // label: '用户',
          // 账号栏左侧图标,需要formStyle为icon
          icon: 'el-icon-user',
          // 账号输入框表单校验正则,作为登录操作以及第一次点击登录后的校验依据
          placeholder: '请输入登录账号',
          clearable: true,
          // 校验规则
          rules: [
            { required: true, message: '请输入登录账号', trigger: 'change' },
            { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'change' }
          ]
        },
        // 密码栏配置,不传入则采用默认密码栏设置
        password: {
          // label: '密码',
          icon: 'el-icon-lock',
          placeholder: '请输入密码',
          type: 'password',
          clearable: true
        },
        confirm: {
          // label: '密码',
          icon: 'el-icon-lock',
          type: 'password',
          placeholder: '请确认密码'
        },
        button: {
          label: '初始化',
          clickEvent: this.handleInit.bind(this)
        }
      }
    }
  },
  computed: {
    ...mapState('app', {
      appTitle: 'title'
    })
  },
  created () {
    this.system.title = this.appTitle
  },
  methods: {
    ...mapActions('app', ['appInit']),
    ...mapActions('user', ['login']),
    // 处理初始化
    async handleInit (form) {
      await this.appInit({
        loginName: form.loginName,
        userName: form.userName,
        password: form.password,
        phone: form.phone,
        companyName: form.companyName
      })
      this.$emit('init-success')
    }
  }
}
</script>
