<template>
  <div class="ym-login">
    <!-- 登录组件标题 -->
    <div class="ym-login-title">
      {{ system.name }}
      <span>{{ system.title }}</span>
    </div>
    <!-- 登录组件轮播新闻 -->
    <el-carousel
      v-if="news"
      class="ym-login-news"
      :autoplay="false"
      indicator-position="outside"
      arrow="never"
      height="50px"
    >
      <el-carousel-item v-for="(item,index) in news" :key="index">{{ item.title }}</el-carousel-item>
    </el-carousel>
    <div class="ym-login-form">
      <el-form
        :label-position="labelPosition"
        :rules="rules"
        :model="form"
        ref="forms"
        label-width="80px"
        :class="star ? 'star' : ''"
      >
          <!--公司简称-->
          <el-form-item prop="companyName">
            <el-input v-model="form.companyName" placeholder='请输入公司简称' prefix-icon='el-icon-house'></el-input>
          </el-form-item>
           <!--姓名-->
          <el-form-item prop="userName">
            <el-input v-model="form.userName" placeholder='请输入姓名' prefix-icon='el-icon-user'></el-input>
          </el-form-item>
           <!--手机号-->
          <el-form-item prop="phone">
            <el-input v-model="form.phone" placeholder='请输入手机号' prefix-icon='el-icon-user'></el-input>
          </el-form-item>
           <!--登录账号-->
          <el-form-item prop="loginName">
            <el-input v-model="form.loginName" placeholder='请输入登录账号' prefix-icon='el-icon-user'></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" placeholder='请输入密码' prefix-icon='el-icon-lock'></el-input>
          </el-form-item>
           <!--请确认密码-->
          <el-form-item prop="confirm">
            <el-input v-model="form.confirm" type="password" placeholder='请确认密码' prefix-icon='el-icon-lock'></el-input>
          </el-form-item>
           <!--按钮-->
          <el-form-item>
            <el-button
              type="primary"
              :loading="logining"
              @click="beforeLogin()"
              class="submit-button"
            >初始化</el-button>
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { encrypt } from '@/utils/jsencrypt'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'InitPanel',
  data () {
    // 验证密码
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    // 二次验证密码
    const validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const checkAgree = (rule, value, callback) => {
      if (value === '' || value === false) {
        callback(new Error('请勾选同意服务条款'))
      } else {
        callback()
      }
    }
    return {
      system: {
        name: '欢迎来到',
        title: ''
      },
      news: [
        { title: '系统尚未初始化，请设置超级管理员账号' }
      ],
      logining: false,
      labelPosition: 'top',
      isDisabled: false, // 发送验证码按钮状态
      phoneText: '发送验证码',
      form: { // 表单值
        account: '',
        password: '',
        confirm: '',
        agree: '',
        companyName: '',
        userName: '',
        phone: '',
        loginName: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 3 到 15 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'change' }
        ],
        confirm: [
          { required: true, validator: validateCheckPass, trigger: 'change' }
        ],
        agree: [
          { required: true, validator: checkAgree, trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请输入公司简称', trigger: 'change' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'change' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'change' }
        ],
        phone: [
          { type: 'string', pattern: /^1\d{10}$/, message: '请输入正确的手机号码', trigger: 'change' }
        ],
        loginName: [
          { required: true, message: '请输入登录账号', trigger: 'change' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState('app', {
      appTitle: 'title'
    })
  },
  mounted () {
    this.system.title = this.appTitle
    // 初始化
    // 更新验证规则
    Object.keys(this.options).forEach(item => {
      if (this.rules[item] && this.options[item].rules) {
        this.rules[item] = this.options[item].rules // 替换校验规则
      }
    })
    // 回车登录
    window.addEventListener('keydown', this.keyDown)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.keyDown, false)
  },
  methods: {
    ...mapActions('app', ['appInit']),
    // 处理初始化
    async handleInit (form) {
      await this.appInit({
        loginName: form.loginName,
        userName: form.userName,
        password: encrypt(form.password),
        phone: form.phone,
        companyName: form.companyName
      })
      this.$emit('init-success')
    },
    // 校验
    validate () {
      return new Promise((resolve, reject) => {
        return this.$refs.forms.validate(async (valid) => {
          if (!valid) return reject(valid)
          return resolve(this.form)
        })
      })
    },
    // 提交按钮触发事件
    async beforeLogin () {
      if (this.logining) return
      this.logining = true
      try {
        await this.validate()
        const result = this.$emit('init-success')
        await Promise.resolve(result)
      } catch (error) {
      }
      this.$set(this, 'logining', false)
    },
    keyDown (e) {
      // 如果是回车则执行登录方法
      if (e.keyCode === 13) {
        this.beforeLogin()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ym-login {
  &-title {
    width: max-content;
    font-size: $--ym-font-h3-size;
    text-align: center;
    margin: 20px 0;
    span {
      font-weight: 400;
      color: $--ym-color-primary;
    }
  }
  // 表头新闻
  &-news {
    margin: 30px 0;
    & .el-carousel__indicators--outside {
      text-align: left;
      & .is-active button {
        background-color: $--ym-color-primary;
      }
    }
  }
  &-form {
    .el-form-item__label:before {
      display: none;
    }
    .star {
      .el-form-item__label:before {
        display: inherit;
      }
    }
    .el-form--label-top {
      .submit-button {
        width: 100%;
        margin: 10px 0px;
        font-size: 18px;
      }
      // 验证码图形验证码
      .verify {
        &-input {
          width: 100%;
          display: inline-block;
        }
        .el-input {
          width: calc(60% - 20px);
          text-align: center;
        }
        .el-button {
          margin-left: 20px;
          width: 40%;
          text-align: center;
          padding: 12px;
        }
        &-btn {
          margin-left: 20px;
          width: 40%;
          height: 40px;
          float: right;
        }
      }
      // 同意
      .agree {
        .el-form-item__content,
        .el-checkbox,
        .el-link {
          margin: 0px;
          line-height: 19px;
        }
        &-url {
          color: $--ym-color-primary;
        }
      }
    }
  }
}
</style>
