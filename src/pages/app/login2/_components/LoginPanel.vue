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
        :ref="refForm"
        label-width="80px"
        :class="star ? 'star' : ''"
      >
          <!--账户/密码等文本框-->
          <el-form-item prop="account">
            <el-input v-model="form.account" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <!--按钮-->
          <el-form-item>
            <el-button
              type="primary"
              :loading="logining"
              @click="beforeLogin()"
              class="submit-button"
            >登录</el-button>
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'LoginPanel',
  props: {
    refForm: {
      type: String,
      default: 'form'
    },
    // 表单中的必填*
    star: {
      type: Boolean,
      default: false
    }
  },
  data () {
    // 验证密码
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      logining: false,
      labelPosition: 'top',
      news: [],
      system: {
        name: '欢迎来到',
        title: ''
      },
      form: { // 表单值
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 3 到 15 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'change' }
        ]
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
  mounted () {
    // 回车登录
    window.addEventListener('keydown', this.keyDown)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.keyDown, false)
  },
  methods: {
    // 校验
    validate () {
      return new Promise((resolve, reject) => {
        return this.$refs[this.refForm].validate(async (valid) => {
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
        const result = this.$emit('login', this.form)
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
