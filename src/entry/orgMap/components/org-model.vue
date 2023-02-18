<template>
  <div>
    <transition name="fade">
      <div class="dialog-box" v-if="showShadow"></div>
    </transition>
    <transition name="fade">
      <div class="org-dialog" v-if="showModel" >
        <div class="org-dialog-title">提示</div>
        <div class="org-dialog-content">您尚未登录，点击跳转登录页</div>
        <div class="org-dialog-foot">
          <div class="org-dialog-foot-btn" @click="handleSubmit">确定</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    showModel: {
      type: Boolean,
      default: false
    },
    showShadow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 前往登录页
    handleSubmit () {
      this.$emit('handleSubmit')
    }
  }
}

</script>

<style lang="scss" scoped>
.fade-enter{
  opacity: 0;
}
.fade-enter-active{
  transition: opacity 3s;
}
.fade-leave-to{
  opacity: 0;
}
.fade-leave-active{
  transition: opacity 3s;
}

.dialog-box{
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background:rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  position: fixed;
  z-index: 1000000000;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.org-dialog{
  position: fixed;
  background: #fff;
  width: 300px;
  height: 160px;
  transition: all 0.3s ease;
  top: calc(50vh - 80px);
  left: calc(50% - 150px);
  border-radius: 12px;
  z-index: 10000000000;
  box-shadow: 0 -2px 12px 0 rgb(0 0 0 / 10%);
  overflow: hidden;

  .org-dialog-title{
    color: #333;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin: 24px 0;
    height: 20px;
  }

  .org-dialog-content {
    color: #666;
    font-size: 14px;
    text-align: center;
    height: 20px;
    margin: 24px 0;
  }

  .org-dialog-foot {
    border-top: 1px solid #ddd;
    height: 48px;

    .org-dialog-foot-btn{
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
      font-size: 16px;
      font-weight: bold;
    }
  }

}

</style>
