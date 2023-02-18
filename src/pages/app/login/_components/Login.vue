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
        <div v-for="(item,index) in applyOptions" :key="index">
          <!--图片验证码-->
          <el-form-item
            v-if="index === 'imgVerify'"
            :label="item.label"
            :prop="index"
            class="verify"
          >
            <div class="verify-input">
              <el-input v-model="form[index]" v-bind="[item]" :prefix-icon="item.icon"></el-input>
              <img class="verify-btn" :src="item.url" @click="chengeImgVerify()" alt="" />
            </div>
          </el-form-item>
          <!--短信验证码-->
          <el-form-item
            v-else-if="index === 'phoneVerify'"
            :label="item.label"
            :prop="index"
            class="verify"
          >
            <div class="verify-input">
              <el-input v-model="form[index]" v-bind="[item]" :prefix-icon="item.icon"></el-input>
              <el-button
                :disabled="!isDisabled"
                @click="sendPhoneMessage()"
              >{{ phoneText ? phoneText : '发送' }}</el-button>
            </div>
          </el-form-item>
          <!--注册协议-->
          <el-form-item v-else-if="index === 'agree'" :prop="index" class="agree">
            <el-checkbox v-model="form[index]">{{ item.label }}</el-checkbox>
            <router-link target="_blank" class="agree-url" :to="{ name: item.url }">《{{ item.name }}》</router-link>
            <!--其他连接-忘记密码-->
            <router-link
              v-if="item.forget"
              target="_blank"
              style="float: right"
              :to="{ name: item.forget.url }"
            >{{ item.forget.label }}</router-link>
          </el-form-item>
          <!--其他-->
          <el-form-item v-else-if="index === 'other'">
            <router-link
              v-if="applyOptions.other.left"
              target="_blank"
              :to="{ name: item.left.url }"
            >{{ item.left.label }}</router-link>
            <router-link
              v-if="applyOptions.other.right"
              target="_blank"
              style="float: right"
              :to="{ name: item.right.url }"
            >{{ item.right.label }}</router-link>
          </el-form-item>
          <!--按钮-->
          <el-form-item v-else-if="index === 'button'">
            <el-button
              type="primary"
              :loading="logining"
              v-bind="[item]"
              @click="beforeLogin()"
              class="submit-button"
            >{{ item.label }}</el-button>
          </el-form-item>
          <!--账户/密码等文本框-->
          <el-form-item v-else :label="item.label" :prop="index">
            <el-input v-model="form[index]" v-bind="[item]" :prefix-icon="item.icon"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { isPhone } from '@/utils/validate.js'
export default {
  props: {
    refForm: {
      type: String,
      default: 'form'
    },
    // 表单中的必填*
    star: {
      type: Boolean,
      default: false
    },
    // 标题
    system: {
      type: Object,
      default: () => {
        return {
          name: '欢迎来到',
          title: ''
        }
      }
    },
    news: {
      type: Array
    },
    // 表单配置项
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    // 验证手机号是否合法
    const checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'))
      } else if (!isPhone(value)) {
        callback(new Error('手机号码不合法'))
      } else {
        callback()
      }
      this.isDisabled = isPhone(value) ? (parseInt(this.phoneText) < 0) : false
    }
    // 短信验证码是否为空
    const checkSmscode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入短信验证码'))
      } else {
        callback()
      }
    }
    // 图片验证码是否为空
    const checkImgcode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入图片验证码'))
      } else {
        callback()
      }
    }
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
      logining: false,
      labelPosition: 'top',
      isDisabled: false, // 发送验证码按钮状态
      phoneText: '发送验证码',
      form: { // 表单值
        account: '',
        phone: '',
        password: '',
        confirm: '',
        phoneVerify: '',
        imgVerify: '',
        agree: ''
      },
      applyOptions: {}, // 表单项配置项
      rules: {
        account: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 3 到 15 个字符', trigger: 'change' }
        ],
        phone: [
          { required: true, validator: checkPhone, trigger: 'change' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'change' }
        ],
        confirm: [
          { required: true, validator: validateCheckPass, trigger: 'change' }
        ],
        phoneVerify: [
          { required: true, validator: checkSmscode, trigger: 'change' }
        ],
        imgVerify: [
          { required: true, validator: checkImgcode, trigger: 'change' }
        ],
        agree: [
          { required: true, validator: checkAgree, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // 初始化
    this.applyOptions = this.options
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
    // 点击图片验证码
    chengeImgVerify () {
      // this.$emit('chengeImgVerify')
      this.applyOptions.imgVerify.clickEvent()
    },
    // 点击发送验证码按钮（使用发送验证码必须配置手机号输入框）
    sendPhoneMessage () {
      const phone = this.form.phone
      if (isPhone(phone)) {
        this.initCountDown()
        // this.$emit('sendPhoneMessage')
        this.applyOptions.phoneVerify.clickEvent()
        let time = this.countDown
        this.phoneText = '已发送'
        if (this.isDisabled) {
          this.isDisabled = false
          const timer = setInterval(() => {
            time--
            this.phoneText = time + ' 秒'
            if (time === 0) {
              clearInterval(timer)
              this.phoneText = '重新发送'
              this.isDisabled = true
            }
          }, 1000)
        }
      }
    },
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
        const result = this.applyOptions.button.clickEvent(this.form)
        await Promise.resolve(result)
      } catch (error) {
      }
      this.resetButton()
    },
    // 清除按钮的loading状态
    resetButton () {
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
