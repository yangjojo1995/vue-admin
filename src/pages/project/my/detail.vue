<template>
  <div class="page">

    <div class="back">
      <span @click="toBack"><i class="el-icon-arrow-left"></i>
        <span class="back-span">返回</span>
      </span>
    </div>

    <detail :detail="projectDetail"></detail>

  </div>
</template>

<script>
import detail from '@/pages/project/detail'
export default {
  components: { detail },
  data () {
    return {
      id: '',
      projectDetail: {}
    }
  },
  created () {
    this.id = this.$route.query.id
    !!this.id && this.loadData(this.id)
  },
  methods: {
    // 加载数据
    async loadData (id) {
      this.projectDetail = await this.$service.project.getProjectDetails({ id: id })
    },

    // 返回
    toBack () {
      this.$router.go(-1)
    }

  }
}
</script>

<style lang="scss" scoped>
.page{

  .back{
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    margin-bottom: 16px;

    .back-span{
      cursor: d;
    }

    .btn-group{
      button{
        padding-left: 32px;
        padding-right: 32px;
      }
    }
  }

}
</style>
