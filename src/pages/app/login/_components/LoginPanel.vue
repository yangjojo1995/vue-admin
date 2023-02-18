<template>
  <YmLogin :options='options' :news="news" :system="system"></YmLogin>
</template>

<script>
import YmLogin from './Login'
import { mapState } from 'vuex'

export default {
  components: { YmLogin },
  data () {
    return {
      system: {
        name: '欢迎来到',
        title: this.appTitle
      },
      // 新闻
      news: [
        // { title: '账号: guest 密码: 123456' }
      ],
      options: {
        // 账号栏配置,不传入则采用默认账号栏配置
        account: {
          // 账号栏label名,显示在输入框上方
          // label: '用户',
          // 账号栏左侧图标,需要formStyle为icon
          icon: 'el-icon-user',
          // 账号输入框表单校验正则,作为登录操作以及第一次点击登录后的校验依据
          placeholder: '请输入用户名',
          clearable: true,
          // 校验规则
          rules: [
            { required: true, message: '请输入用户名', trigger: 'change' },
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
        button: {
          label: '登录',
          clickEvent: this.handleLogin.bind(this)
          // icon: 'el-icon-lock'
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
    // 处理登录
    async handleLogin (form) {
      this.$emit('login', form)
    }
  }
}
</script>
