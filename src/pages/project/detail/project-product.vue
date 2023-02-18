<template>
  <div class="project" v-if="showFlag">

    <div class="title">产品和服务</div>
    <div class="table">
      <div class="table-group" v-if="projectProduct.productName">
        <div class="table-group-label flex-left">产品服务名称</div>
        <div class="table-group-value flex-left">{{ projectProduct.productName || '-'  }}</div>
      </div>
      <div class="table-group" v-if="projectProduct.description">
        <div class="table-group-label flex-left">项目服务描述</div>
        <div class="table-group-value flex-left">{{ projectProduct.description || '-'  }}</div>
      </div>
      <div class="table-group img-row" v-if="imgList.length > 0">
        <div class="table-group-label flex-left">产品图片</div>
        <div class="table-group-value flex-left">
          <el-image v-for="url in imgList" :key="url" :src="url" :preview-src-list="imgList"></el-image>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  components: {},
  props: {
    projectProduct: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    imgList: function () {
      if (this.projectProduct.image && Array.isArray(this.projectProduct.image)) {
        return this.projectProduct.image.map((url) => {
          return this.$assets(url)
        })
      } else {
        return []
      }
    },
    showFlag: function () {
      if (this.projectProduct.productName || this.projectProduct.description || (Array.isArray(this.projectProduct.image && this.projectProduct.image.length > 0))) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./project-css.scss";

::v-deep.table-group-value{
  img, .el-image__inner{
    max-height: 100px;
    margin: 4px 8px;
    object-fit: contain;
  }
}
</style>
