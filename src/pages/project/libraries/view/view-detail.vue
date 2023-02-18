<template>
  <div class="page">

    <div class="back">
      <span @click="toBack"><i class="el-icon-arrow-left"></i>
        <span class="back-span">返回</span>
      </span>
    </div>

    <detail :detail="projectDetail">
      <template v-slot:header>
        <el-switch
            :value="projectDetail.projectBase.status"
            @change="
              val => {
                statusChange(val, projectDetail.projectBase.id);
              }
            "
            active-value="publish"
            inactive-value="stop"
          >
          </el-switch>
      </template>

    </detail>

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
    },

    // 状态修改
    async statusChange (value, id) {
      // 状态先保持不变
      value === 'publish'
        ? (this.projectDetail.projectBase.status = 'stop')
        : (this.projectDetail.projectBase.status = 'publish')
      this.$confirm(value === 'publish' ? '是否发布？' : '是否停止？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        try {
          this.loading = true
          const params = {
            id: id,
            status: value
          }
          await this.$service.project.stausProjectDetails(params)
          value === 'publish'
            ? (this.projectDetail.projectBase.status = 'publish')
            : (this.projectDetail.projectBase.status = 'stop')
          this.$message.success('修改成功')
        } finally {
          this.loading = false
        }
      })
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
