<template>
  <div class="ym-container">
    <div class="ym-card">
      <el-card class="center">
        <el-row class="ym-card-box">
          <el-col :sm="12" class="ym-card-box-ad hidden-xs-only">
            <!--LOGO-->
            <div class="ym-card-box-ad__logo" :style="logoOptions.style">
              <template v-if="logoOptions.logoType == 'image'">
                <img :src="logoOptions.logoUrl" :alt="appTitle || ''" />
              </template>
              <template v-if="logoOptions.logoType == 'text'">
                <span class="ym-card-box-ad__title">{{ appTitle }}</span>
              </template>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" class="ym-card-form">
            <transition name="fade-transverse-reverse" mode="out-in">
              <!-- 初始化 -->
              <template v-if="step === 'init'">
                <InitPanel @init-success="handleInitCompleted"></InitPanel>
              </template>
              <!-- 初始化成功 -->
              <template v-else-if="step === 'init-success'">
                <div class="init-success">
                  <img
                    src="./_assets/img/complete.png"
                    alt="initialization complete!"
                  />
                  <p class="info">
                    <span>{{ appTitle }}</span> 初始化成功
                  </p>
                  <p class="detail">点击“确定”按钮进入登录界面</p>
                  <el-button
                    type="primary"
                    @click="handleToLoginStep"
                    class="submit-button"
                    >确定</el-button
                  >
                </div>
              </template>
              <!-- 登录 -->
              <template v-else-if="step === 'login'">
                <LoginPanel @login="handleLogin"></LoginPanel>
              </template>
            </transition>
          </el-col>
        </el-row>
      </el-card>
      <!-- 备案信息栏 -->
      <div class="bottom-box">
        <el-link type="primary" @click='goTo'>粤ICP备19061843号</el-link>
      </div>
    </div>
  </div>
</template>

<script>
import LoginPanel from './_components/LoginPanel'
import InitPanel from './_components/InitPanel'
import { mapState, mapActions } from 'vuex'

export default {
  layout: 'empty',
  components: {
    InitPanel,
    LoginPanel
  },
  data () {
    return {
      step: 'login', // init init-success login
      loading: false,
      // 左上角logo配置项
      logoOptions: {
        logoType: 'image',
        logoUrl: require('@/assets/images/global/app-login.png'),
        style: { width: '300px', left: '40px', top: '34px' }
      }
    }
  },
  computed: {
    ...mapState('app', {
      appTitle: 'title',
      appInfo: 'appInfo'
    }),
    ...mapState('user', {
      userInfo: 'userInfo'
    })
  },
  created () {
    // 初始化步骤
    this.step = this.appInfo ? 'login' : 'init'
  },
  mounted () {},
  methods: {
    ...mapActions('user', ['login']),
    // 初始化成功
    handleInitCompleted (form) {
      this.step = 'init-success'
    },

    // 确认初始化成功
    handleToLoginStep () {
      this.step = 'login'
    },
    goTo () {
      window.open('https://beian.miit.gov.cn/')
    },
    // 确认初始化成功
    async handleLogin (form) {
      await this.login({
        loginName: form.account,
        password: form.password
      })
      this.$message.success('登录成功！')
      this.$router.push('/project/review')
      const orgTags = this.userInfo.orgTags
      if (Array.isArray(orgTags) && orgTags.includes('推荐单位')) {
        if (!this.userInfo.phone && !this.userInfo.email) {
          try {
            await this.$confirm('个人信息未完善，无法接收相关的通知，是否立即完善个人信息？', '完善个人信息', {
              confirmButtonText: '立即完善',
              cancelButtonText: '下次吧'
            })
            this.$router.push('/my')
          } catch (error) {}
        } else {
          this.$router.push('/project/review')
        }
      } else {
        this.$router.push('/user-manager/review')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ym-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  position: relative;
  // overflow: auto;
  background: url("./_assets/img/bg_img.png") no-repeat;
  background-size: 100% 100%;
  background-color: #ffffff;
  .ym-card {
    width: 100%;
    padding-top: 5vh;
    padding-bottom: 40px;
    & .el-card .el-card__body {
      padding: 0;
    }
    &-box {
      display: flex;
      &-ad {
        & img {
          margin: 0 auto;
          display: block;
          width: 100%;
        }
        background: url("./_assets/img/logo_bg.png") no-repeat;
        background-color: #f9fafa;
        background-position: bottom right;
        &__logo {
          position: absolute;
          margin: 5px 15px;
          overflow: hidden;
          user-select: none;
        }
        &__title {
          font-family: "fangsong", sans-serif;
          font-size: 20px;
          color: $--ym-color-primary;
          text-shadow: 0px 0px 1px $--ym-color-primary;
        }
      }
    }
    &-form {
      padding: 40px;
      min-height: 546px;
      .init-success {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        img {
          height: 150px;
          width: 150px;
          margin-top: 20px;
          margin-bottom: 20px;
        }
        .info {
          font-size: $--ym-font-h3-size;
          span {
            font-weight: 400;
            color: $--ym-color-primary;
          }
        }
        .detail {
          color: $--ym-text-color-secondary;
        }
        .submit-button {
          width: 100%;
          margin-top: 48px;
          margin-bottom: 32px;
          font-size: 18px;
        }
      }
    }
  }
  .center {
    margin-right: auto;
    margin-left: auto;
    float: initial;
    max-width: 970px;
  }
  // .left {
  //   margin-left: 10%;
  //   margin-right: auto;
  //   float: initial;
  //   max-width: 970px;
  // }
  // .right {
  //   margin-right: 10%;
  //   margin-left: auto;
  //   float: initial;
  //   max-width: 970px;
  // }

  // 底部备案信息
  .bottom-box {
    font-size: 12px;
    color: $--ym-text-color-regular;
    position: absolute;
    bottom: 10px;
    left: 10%;
    right: 10%;
    text-align: center;
  }
}
</style>
