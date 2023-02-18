<template>
  <div class="rich-container" v-html="html"></div>
</template>

<script>
export default {
  props: {
    html: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.rich-container {
  width: 100%;
  overflow: hidden;
  &::v-deep {
    img {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>
