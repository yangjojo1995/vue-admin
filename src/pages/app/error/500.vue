<template>
  <div class="ym-result">
    <div class="ym-result-content">
      <div class="ym-result-image">
        <img :src="image"/>
      </div>
      <div class="ym-result-subtitle">{{ content }}</div>
      <div class="ym-result-extra">
        <slot>
          <ym-button type="primary" @click="$router.push(homeTo)">返回首页</ym-button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: { title: '500' },
  data () {
    return {
      code: 500,
      content: '抱歉，服务器报告了一个错误！',
      image: require('./_assets/image/500.png'),
      homeTo: '/'
    }
  }
}
</script>

<style lang="scss">
body[route-path*="/app/error/404"] .layout-main {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style lang="scss" scoped>
.ym-result {
  background-color: $--ym-color-white;
  border-radius: $--ym-border-radius-base;
  &-content {
    position: relative;
    width: 100%;
    top: 40%;
  }
  &-image {
    max-width: 325px;
    background-position: center center;
    background-size: cover;
    margin: auto;
    img {
      width: 100%;
    }
  }
  &-icon {
    margin-bottom: 24px;
    text-align: center;
  }
  &-title {
    color: rgba(0,0,0,.85);
    font-size: 24px;
    line-height: 3;
    font-weight:900;
    text-align: center;
  }
  &-subtitle {
    color: $--ym-color-primary;
    font-size: 20px;
    font-weight:900;
    line-height: 1.6;
    text-align: center;
  }
  &-extra {
    margin: 25px 0 0;
    text-align: center;
  }
}
</style>
