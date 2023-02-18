<template>
  <div class="page">

    <div class="back">
      <span @click="toBack"><i class="el-icon-arrow-left"></i>
        <span class="back-span">返回</span>
      </span>
    </div>

    <div class="reason" v-if="projectDetail.projectAudit && projectDetail.projectAudit.status=='reason'">
      <div class="reason-row">很遗憾，您的项目未能通过审核，请根据推荐单位意见，修改后再次尝试提交</div>
      <div class="reason-row">审核单位：{{projectDetail.projectAudit.orgName}}</div>
      <div class="reason-row">审核批注：{{projectDetail.projectAudit.reason}}</div>
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
      this.projectDetail = await this.$service.project.getAuditDetail({ id: this.id })
      console.log(this.projectDetail)
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

  .reason{
    padding: 8px 32px;
    margin: 24px 0;
    border: 1px solid #F69A23;
    border-radius: 16px;
    box-shadow: 0px 2px 12px #F9D8AD;

    .reason-row{
      margin: 16px 0;
      color: #F69A23;
    }
  }
}
</style>
